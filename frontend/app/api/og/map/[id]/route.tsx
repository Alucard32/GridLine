import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Create an edge-compatible Supabase client for public data only
// This doesn't require cookies since we're only reading published maps
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch map data with author info
    const { data: mapData, error } = await supabase
      .from('maps')
      .select(`
        id,
        title,
        subtitle,
        thumbnail_url,
        sculpture_thumbnail_url,
        product_type,
        vote_score,
        profiles!maps_user_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !mapData) {
      return new Response('Map not found', { status: 404 });
    }

    // Type assertion for the map data with profiles
    // Note: Direct Supabase client returns joins as arrays
    const map = mapData as unknown as {
      id: string;
      title: string;
      subtitle: string | null;
      thumbnail_url: string | null;
      sculpture_thumbnail_url: string | null;
      product_type: 'poster' | 'sculpture';
      vote_score: number;
      profiles: { username: string; display_name: string | null; avatar_url: string | null } | { username: string; display_name: string | null; avatar_url: string | null }[];
    };

    // Handle profiles as either object or array (Supabase returns array for joins)
    const profilesData = map.profiles;
    const author = Array.isArray(profilesData) ? profilesData[0] : profilesData;

    if (!author) {
      return new Response('Author not found', { status: 404 });
    }
    const thumbnailUrl = map.product_type === 'sculpture'
      ? map.sculpture_thumbnail_url
      : map.thumbnail_url;
    const productLabel = map.product_type === 'sculpture' ? 'Journey Sculpture' : 'Adventure Print';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FAF9F7',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Main content area */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              padding: '40px',
              gap: '40px',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                display: 'flex',
                width: '400px',
                height: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#E8E4DC',
              }}
            >
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={map.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: '24px',
                  }}
                >
                  No Preview
                </div>
              )}
            </div>

            {/* Info panel */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              {/* Product type badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    backgroundColor: map.product_type === 'sculpture' ? '#8B5A2B' : '#2D5A3D',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {productLabel}
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#262420',
                  lineHeight: 1.2,
                  maxWidth: '500px',
                }}
              >
                {map.title}
              </div>

              {/* Subtitle */}
              {map.subtitle && (
                <div
                  style={{
                    fontSize: '24px',
                    color: '#666',
                    maxWidth: '500px',
                  }}
                >
                  {map.subtitle}
                </div>
              )}

              {/* Author info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '20px',
                }}
              >
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.display_name || author.username}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#2D5A3D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 600,
                    }}
                  >
                    {(author.display_name || author.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '20px', fontWeight: 600, color: '#262420' }}>
                    {author.display_name || author.username}
                  </span>
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    @{author.username}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginTop: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#ef4444',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span style={{ fontSize: '20px', fontWeight: 600 }}>{map.vote_score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 40px',
              borderTop: '1px solid #E8E4DC',
              backgroundColor: '#F5F3EF',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {/* Mountain icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#2D5A3D">
                <path d="M12 2L2 22h20L12 2zm0 4l7 14H5l7-14z" />
              </svg>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#2D5A3D',
                }}
              >
                GridLine
              </span>
            </div>
            <span
              style={{
                fontSize: '16px',
                color: '#666',
              }}
            >
              gridline.eu
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
