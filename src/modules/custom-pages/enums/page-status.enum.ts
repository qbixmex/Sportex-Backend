export const PAGE_STATUS = {
  DRAFT: 'draft',
  HOLD: 'hold',
  UNPUBLISHED: 'unpublished',
  PUBLISHED: 'published',
} as const;

export type PageStatus = typeof PAGE_STATUS[keyof typeof PAGE_STATUS];