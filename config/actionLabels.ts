/**
 * Configuration for action label pills.
 *
 * Keys are the raw label strings as they appear in the CSV (lowercase, trimmed).
 * - `displayName` — text shown on the pill; defaults to label.toUpperCase()
 * - `color`       — Tailwind color name from the ISF palette (e.g. 'isf-gold',
 *                   'isf-red', 'isf-green'); defaults to 'isf-gold'
 *
 * Only labels present in this config will be rendered as pills.
 */
export interface ActionLabelConfig {
  displayName?: string
  /**
   * Full Tailwind background class, e.g. 'bg-isf-gold'. Must be a complete
   * string literal AND must also be added to the `safelist` array in
   * tailwind.config.js — Tailwind's extractor does not reliably pick up class
   * names from TS object values at build time.
   */
  bgClass?: string
}

// MAINTENANCE: any new bgClass value added here must also be added to the
// `safelist` array in tailwind.config.js.
export const ACTION_LABEL_CONFIG: Record<string, ActionLabelConfig> = {
  'testing': {
    displayName: 'TEST',
    bgClass: 'bg-isf-gold',
  },
  'user-submitted': {},
}

/**
 * Resolved pill descriptor — all fields guaranteed to be present.
 */
export interface LabelPill {
  key: string
  displayName: string
  bgClass: string
}

/**
 * Returns a resolved LabelPill for a given label key, or null if the label
 * is not present in the config (i.e. should not be displayed as a pill).
 */
export function getLabelPill(label: string): LabelPill | null {
  const cfg = ACTION_LABEL_CONFIG[label]
  if (!cfg)
    return null
  return {
    key: label,
    displayName: cfg.displayName ?? label.toUpperCase(),
    bgClass: cfg.bgClass ?? 'bg-isf-gold',
  }
}
