import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conditional classes and resolves conflicts using Tailwind's class precedence.
 * 
 * @param inputs - Class values (strings, objects, arrays, or undefined/null)
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * cn('px-4', isActive && 'bg-primary', { 'text-white': isDark })
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats coordinates into a human-readable string with direction indicators.
 * 
 * @param center - Tuple of [longitude, latitude] coordinates
 * @returns Formatted string like "37.77° N, 122.42° W"
 * 
 * @example
 * ```ts
 * formatCoordinates([-122.42, 37.77]) // "37.77° N, 122.42° W"
 * ```
 */
export function formatCoordinates(center: [number, number]): string {
  const [lon, lat] = center;
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}

/**
 * Formats a distance in meters to a human-readable string.
 * Uses km for distances >= 1000m, otherwise meters.
 *
 * @param meters - Distance in meters
 * @returns Formatted string like "42.5 km" or "850 m"
 *
 * @example
 * ```ts
 * formatDistance(42500) // "42.5 km"
 * formatDistance(850) // "850 m"
 * ```
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    // Show one decimal for values < 100, no decimal for larger values
    return km < 100 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Formats elevation gain in meters to a human-readable string with up arrow.
 *
 * @param meters - Elevation gain in meters
 * @returns Formatted string like "1,234 m ↑"
 *
 * @example
 * ```ts
 * formatElevation(1234) // "1,234 m ↑"
 * formatElevation(50) // "50 m ↑"
 * ```
 */
export function formatElevation(meters: number): string {
  const rounded = Math.round(meters);
  // Add thousands separator for readability
  const formatted = rounded.toLocaleString('en-US');
  return `${formatted} m ↑`;
}

/**
 * Converts a hex color string to rgba() CSS format.
 * Supports both 3-digit and 6-digit hex colors.
 * 
 * @param hex - Hex color string (e.g., "#ff0000" or "#f00")
 * @param alpha - Alpha value between 0 and 1
 * @returns RGBA CSS string (e.g., "rgba(255, 0, 0, 0.5)")
 * 
 * @example
 * ```ts
 * hexToRgba('#ff0000', 0.5) // "rgba(255, 0, 0, 0.5)"
 * hexToRgba('#f00', 1) // "rgba(255, 0, 0, 1)"
 * ```
 */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.trim();
  if (!normalized.startsWith('#')) {
    return normalized;
  }

  const raw = normalized.slice(1);
  const expanded =
    raw.length === 3
      ? raw
          .split('')
          .map(ch => ch + ch)
          .join('')
      : raw;

  if (expanded.length !== 6) return normalized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Determines if a hex color is dark using ITU-R BT.709 luminance formula.
 * Useful for choosing appropriate text colors on colored backgrounds.
 * 
 * @param hex - Hex color string (e.g., "#000000" or "#fff")
 * @returns true if the color is dark (luminance < 0.5), false if light
 * 
 * @example
 * ```ts
 * isColorDark('#000000') // true
 * isColorDark('#ffffff') // false
 * ```
 */
export function isColorDark(hex: string): boolean {
  const normalized = hex.trim();
  if (!normalized.startsWith('#')) return false;

  const raw = normalized.slice(1);
  const expanded =
    raw.length === 3
      ? raw
          .split('')
          .map(ch => ch + ch)
          .join('')
      : raw;

  if (expanded.length !== 6) return false;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  // ITU-R BT.709 luminance formula
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

/**
 * Throttles a function to execute at most once per specified time interval.
 * Useful for limiting the rate of expensive operations like map updates.
 * 
 * @param func - Function to throttle
 * @param wait - Minimum milliseconds between function calls
 * @returns Throttled function
 * 
 * @example
 * ```ts
 * const throttledUpdate = throttle(updateMap, 60);
 * // updateMap will be called at most once every 60ms
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let previous = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown;

  return function(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        if (lastArgs) {
          func.apply(lastThis, lastArgs);
        }
      }, remaining);
    }
  };
}

/**
 * Debounces a function to execute only after the specified delay has passed
 * since the last invocation. Useful for search inputs and other user-triggered events.
 * 
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait after last call before executing
 * @returns Debounced function
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce(performSearch, 300);
 * // performSearch will only run 300ms after user stops typing
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}
