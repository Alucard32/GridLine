import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import {
  createOrder,
  completePendingOrder,
  updateOrderStatus,
  type Order,
} from '@/lib/actions/orders';
import { getStripeProducts, type ExportProduct } from '@/lib/stripe/products';
import { logger } from '@/lib/logger';
import { trackPurchaseCompleted, updateBrevoContact } from '@/lib/brevo';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/service';

// Disable body parsing - we need raw body for signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    logger.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info('Checkout session expired:', session.id);
        // Clean up pending order if exists
        const pendingOrderId = session.metadata?.pendingOrderId;
        if (pendingOrderId) {
          await updateOrderStatus(pendingOrderId, 'failed');
          logger.info('Marked pending order as failed:', pendingOrderId);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        logger.info('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    // Return 200 to prevent Stripe from retrying (we logged the error)
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  logger.info('Processing checkout completion:', session.id);

  // Extract metadata
  const { product, mapId, userId, pendingOrderId, exportConfig } =
    session.metadata || {};

  if (!product) {
    logger.error('Missing product in checkout metadata:', session.id);
    return;
  }

  // Get customer email
  const email = session.customer_email || session.customer_details?.email;
  if (!email) {
    logger.error('Missing customer email:', session.id);
    return;
  }

  // Get product amount
  const products = getStripeProducts();
  const productData = products[product as ExportProduct];
  const amount = productData?.amount || session.amount_total || 0;

  // PRIORITY: Complete pending order if exists (new flow - config stored in DB)
  if (pendingOrderId) {
    const order = await completePendingOrder({
      orderId: pendingOrderId,
      email,
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent as string | undefined,
      amount,
    });

    if (order) {
      logger.info('Pending order completed successfully:', order.id);
      // Track purchase in Brevo for email automation (non-blocking)
      sendBrevoEvent(order, session, email, product, amount);
    } else {
      logger.error(
        'Failed to complete pending order:',
        pendingOrderId,
        'for session:',
        session.id
      );
    }
    return;
  }

  // FALLBACK: Create new order (legacy flow - config in metadata)
  // Parse export config if present
  let parsedExportConfig: Record<string, unknown> | undefined;
  if (exportConfig) {
    try {
      parsedExportConfig = JSON.parse(exportConfig);
    } catch {
      logger.warn('Failed to parse export config:', exportConfig);
    }
  }

  // Create order record
  const order = await createOrder({
    email,
    stripeSessionId: session.id,
    stripePaymentIntent: session.payment_intent as string | undefined,
    product: product as ExportProduct,
    amount,
    userId: userId || undefined,
    mapId: mapId || undefined,
    exportConfig: parsedExportConfig,
  });

  if (order) {
    logger.info('Order created successfully:', order.id);
    // Track purchase in Brevo for email automation (non-blocking)
    sendBrevoEvent(order, session, email, product, amount);
  } else {
    logger.error('Failed to create order for session:', session.id);
  }
}

/**
 * Track purchase event in Brevo for email automation
 * Non-blocking - errors are logged but don't affect webhook response
 */
function sendBrevoEvent(
  order: Order,
  session: Stripe.Checkout.Session,
  email: string,
  product: string,
  amount: number
) {
  logger.info('sendBrevoEvent called:', { email, product, amount, orderId: order.id });

  // Get customer name from Stripe session
  const customerName = session.customer_details?.name || '';
  const firstName = customerName.split(' ')[0] || 'there';

  // Determine product type and name
  const productType: 'poster' | 'sculpture' = product.startsWith('sculpture')
    ? 'sculpture'
    : 'poster';

  const productNames: Record<string, string> = {
    'poster-small': 'Small Poster (8×12")',
    'poster-medium': 'Medium Poster (12×18")',
    'poster-large': 'Large Poster (16×24")',
    'sculpture-stl': '3D Sculpture STL',
  };
  const productName = productNames[product] || product;

  // Build download URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gridline.eu';
  const downloadLink = `${baseUrl}/api/export/download?token=${order.download_token}`;

  logger.info('Tracking Brevo purchase event:', { email, productName, downloadLink });

  // Track event (fire and forget) - triggers automation workflows
  trackPurchaseCompleted(email, {
    product,
    amount,
    productName,
    productType,
    downloadLink,
    firstName,
  })
    .then((result) => {
      logger.info('Brevo purchase event result:', result);
    })
    .catch((err) => {
      logger.error('Failed to track Brevo purchase event:', err);
    });

  // Update purchase stats in Brevo (non-blocking) - updates contact attributes
  updatePurchaseStats(email, amount);
}

/**
 * Update purchase statistics in Brevo contact
 * Queries database for accurate totals
 */
async function updatePurchaseStats(email: string, newAmount: number) {
  logger.info('updatePurchaseStats called:', { email, newAmount });

  try {
    const supabase = createServiceClient();

    // Get purchase totals for this email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orders, error: dbError } = await (supabase as any)
      .from('orders')
      .select('amount')
      .eq('email', email)
      .eq('status', 'completed');

    if (dbError) {
      logger.error('Database error fetching orders:', dbError);
    }

    const orderList = (orders || []) as { amount: number }[];
    const purchaseCount = orderList.length || 1;
    const totalSpent = orderList.reduce((sum, o) => sum + (o.amount || 0), 0) || newAmount;

    logger.info('Updating Brevo contact with purchase stats:', {
      email,
      purchaseCount,
      totalSpent,
      ordersFound: orderList.length
    });

    // Update Brevo contact with purchase stats (includes HAS_PURCHASED)
    const result = await updateBrevoContact(email, {
      HAS_PURCHASED: true,
      PURCHASE_COUNT: purchaseCount,
      TOTAL_SPENT: totalSpent,
      LAST_PURCHASE_DATE: new Date().toISOString(),
    });

    logger.info('Brevo purchase stats update result:', { email, success: result });
  } catch (err) {
    logger.error('Failed to update Brevo purchase stats:', err);
  }
}

/**
 * Handle refund event
 */
async function handleRefund(charge: Stripe.Charge) {
  logger.info('Processing refund for charge:', charge.id);

  // Find order by payment intent
  const paymentIntent = charge.payment_intent as string;
  if (!paymentIntent) {
    logger.warn('No payment intent on refunded charge');
    return;
  }

  // Note: We'd need to look up the order by payment_intent
  // For now, just log it - full refund handling would require
  // querying orders by stripe_payment_intent
  logger.info('Refund processed for payment intent:', paymentIntent);
}
