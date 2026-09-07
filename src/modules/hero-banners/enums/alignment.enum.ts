export const ALIGNMENT = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

export type Alignment = typeof ALIGNMENT[keyof typeof ALIGNMENT];
