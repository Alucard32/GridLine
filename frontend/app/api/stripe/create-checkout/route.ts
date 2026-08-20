import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getStripeProducts, type ExportProduct } from '@/lib/stripe/products';
import { createClient } from '@/lib/supabase/server';
import { createPendingOrder } from '@/lib/actions/orders';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product, mapId, exportConfig } = body as {
      product: ExportProduct;
      mapId?: string;
      exportConfig?: Record<string, unknown>;
    };

    // Validate product
    const products = getStripeProducts();
    const productData = products[product];

    if (!productData) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    if (!productData.priceId) {
      logger.error('Missing price ID for product:', product);
      return NextResponse.json(
        { error: 'Product not configured' },
        { status: 500 }
      );
    }

    // Get base URL for redirect
    // In development, always use localhost unless STRIPE_REDIRECT_URL is explicitly set
    // This prevents accidentally redirecting to production during local testing
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? process.env.STRIPE_REDIRECT_URL || 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.VERCEL_URL ||
          'https://gridline.eu';

    // Get user if authenticated (optional for guest checkout)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // CRITICAL: Create a pending order BEFORE checkout to store full config
    // This avoids Stripe's 500 character metadata limit
    logger.info('Creating pending order for product:', product);
    let pendingOrder;
    try {
      pendingOrder = await createPendingOrder({
        product,
        userId: user?.id,
        mapId,
        exportConfig,
      });
    } catch (pendingOrderError) {
      logger.error('Exception in createPendingOrder:', pendingOrderError);
      return NextResponse.json(
        { error: 'Failed to prepare order' },
        { status: 500 }
      );
    }

    if (!pendingOrder) {
      logger.error('createPendingOrder returned null - check server logs for database error');
      return NextResponse.json(
        { error: 'Failed to prepare order' },
        { status: 500 }
      );
    }

    logger.info('Pending order created:', pendingOrder.orderId);

    // Build metadata - only store IDs, not full config
    const metadata: Record<string, string> = {
      product,
      pendingOrderId: pendingOrder.orderId, // Reference to pending order with full config
    };

    if (mapId) {
      metadata.mapId = mapId;
    }

    if (user?.id) {
      metadata.userId = user.id;
    }

    // Only store minimal export config info (resolution key, not full config)
    if (exportConfig?.resolutionKey) {
      metadata.resolutionKey = String(exportConfig.resolutionKey);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: productData.priceId,
          quantity: 1,
        },
      ],
      // Redirect URLs
      success_url: `${baseUrl}/export/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/create?canceled=true`,
      // Customer info
      customer_email: user?.email || undefined,
      // Metadata for webhook processing
      metadata,
      // EU compliance
      billing_address_collection: 'required',
      // Allow promo codes
      allow_promotion_codes: true,
      // Automatic tax calculation (optional, requires Stripe Tax setup)
      // automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    logger.error('Stripe checkout error:', error);

    // Handle Stripe-specific errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
