export const SEO_ROBOTS = {
  INDEX_FOLLOW: 'index, follow',
  INDEX_NOFOLLOW: 'index, nofollow',
  NOINDEX_FOLLOW: 'noindex, follow',
  NOINDEX_NOFOLLOW: 'noindex, nofollow',
} as const;

export type SeoRobots = typeof SEO_ROBOTS[keyof typeof SEO_ROBOTS];