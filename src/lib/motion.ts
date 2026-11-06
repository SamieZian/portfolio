// Brand motion identity (motion-design skill): one signature curve, three durations,
// one entrance pattern (rise out of a mask). Everything animated on the site uses these.

export const EASE = [0.16, 1, 0.3, 1] as const; // expo-out, the signature curve
export const EASE_IN = [0.7, 0, 0.84, 0] as const; // exits accelerate away

export const DUR = { quick: 0.18, base: 0.45, slow: 0.9 } as const;

// Stagger budgets: keep any cascade under ~500ms total.
export const stagger = (count: number, budget = 0.45, max = 0.08) =>
  Math.min(max, budget / Math.max(count, 1));
