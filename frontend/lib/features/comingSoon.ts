/**
 * Coming Soon Features Configuration
 *
 * Features that are planned but not yet available.
 * Users can vote for features they want prioritized.
 * Votes are tracked via PostHog analytics.
 */

export type FeatureCategory = 'poster' | 'sculpture';

export interface ComingSoonFeature {
  key: string;
  label: string;
  description: string;
  category: FeatureCategory;
  icon: string; // Lucide icon name
}

export const COMING_SOON_FEATURES: ComingSoonFeature[] = [
  // Poster features
  {
    key: 'print_fulfillment',
    label: 'Print & Ship',
    description: 'We print and ship directly to you',
    category: 'poster',
    icon: 'Truck',
  },
  {
    key: 'framing',
    label: 'Custom Framing',
    description: 'Premium frames in multiple styles',
    category: 'poster',
    icon: 'Frame',
  },
  {
    key: 'canvas_prints',
    label: 'Canvas Prints',
    description: 'Gallery-ready canvas art',
    category: 'poster',
    icon: 'Image',
  },
  {
    key: 'metal_prints',
    label: 'Metal Prints',
    description: 'Modern aluminum photo prints',
    category: 'poster',
    icon: 'Layers',
  },
  // Sculpture features
  {
    key: 'sculpture_printing',
    label: '3D Printing Service',
    description: 'We 3D print your sculpture',
    category: 'sculpture',
    icon: 'Printer',
  },
  {
    key: 'sculpture_materials',
    label: 'Premium Materials',
    description: 'Resin, metal, ceramic options',
    category: 'sculpture',
    icon: 'Gem',
  },
];

/**
 * Get features filtered by category
 */
export const getFeaturesByCategory = (category: FeatureCategory): ComingSoonFeature[] =>
  COMING_SOON_FEATURES.filter((f) => f.category === category);

/**
 * localStorage key for storing user's feature votes
 */
export const FEATURE_VOTES_STORAGE_KEY = 'gridline_feature_votes';

/**
 * Get user's voted feature keys from localStorage
 */
export function getVotedFeatures(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FEATURE_VOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save user's voted feature keys to localStorage
 */
export function saveVotedFeatures(featureKeys: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FEATURE_VOTES_STORAGE_KEY, JSON.stringify(featureKeys));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Toggle vote for a feature
 * Returns the new voted state
 */
export function toggleFeatureVote(featureKey: string): boolean {
  const current = getVotedFeatures();
  const isVoted = current.includes(featureKey);

  if (isVoted) {
    saveVotedFeatures(current.filter((k) => k !== featureKey));
    return false;
  } else {
    saveVotedFeatures([...current, featureKey]);
    return true;
  }
}
