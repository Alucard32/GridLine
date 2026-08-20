'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';

interface GridLineLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

/**
 * GridLine Mountain Logo
 * Stylized mountain peak with trail path
 * Forest green to sunset orange gradient
 */
export function GridLineLogo({ size = 'md', className, showText = false }: GridLineLogoProps) {
  // Generate unique IDs for gradients to avoid conflicts when multiple logos are rendered
  const uniqueId = useId();
  const mountainGradientId = `mountain-gradient-${uniqueId}`;
  const trailGradientId = `trail-gradient-${uniqueId}`;

  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], 'flex-shrink-0')}
        aria-label="GridLine logo"
      >
        <defs>
          {/* Forest to sunset gradient - using hex for browser compatibility */}
          <linearGradient id={mountainGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2d7a4e" /> {/* Forest green */}
            <stop offset="100%" stopColor="#e8873c" /> {/* Sunset orange */}
          </linearGradient>
          {/* Trail gradient */}
          <linearGradient id={trailGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a9968" /> {/* Lighter forest */}
            <stop offset="100%" stopColor="#f5a855" /> {/* Lighter sunset */}
          </linearGradient>
        </defs>

        {/* Main mountain shape */}
        <path
          d="M16 4L28 26H4L16 4Z"
          fill={`url(#${mountainGradientId})`}
        />

        {/* Secondary peak (smaller, offset) */}
        <path
          d="M22 12L28 26H16L22 12Z"
          fill={`url(#${mountainGradientId})`}
          opacity="0.7"
        />

        {/* Trail/path winding up the mountain */}
        <path
          d="M10 24C12 22 13 20 14 18C15 16 15.5 14 16 12C16.5 10 16.8 8 17 6"
          stroke={`url(#${trailGradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Trail marker dots - off-white for visibility on both themes */}
        <circle cx="11" cy="23" r="1" fill="#faf8f5" opacity="0.95" />
        <circle cx="14.5" cy="17" r="1" fill="#faf8f5" opacity="0.95" />
        <circle cx="16.5" cy="10" r="1" fill="#faf8f5" opacity="0.95" />

        {/* Summit marker - sunset orange accent */}
        <circle cx="16" cy="6" r="1.5" fill="#e8873c" />
      </svg>

      {showText && (
        <span className={cn('font-bold text-foreground font-display', textSizeClasses[size])}>
          GridLine
        </span>
      )}
    </div>
  );
}
