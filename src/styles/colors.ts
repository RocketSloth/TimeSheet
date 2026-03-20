/**
 * Dark Forest Color Palette
 *
 * A cohesive dark-forest-themed color token set designed for the TimeSheet
 * application.  Every role required by the UI is represented:
 *
 *   background    – primary page / app background
 *   surface       – cards, panels, secondary containers
 *   accent        – interactive highlights, buttons, links
 *   textPrimary   – main readable text
 *   textSecondary – muted / supporting text
 *   border        – dividers, outlines, separators
 *   error         – destructive actions, validation errors
 */

export interface DarkForestPalette {
  /** Very dark green – primary page background */
  background: string;
  /** Slightly lighter dark green – card / panel surface */
  surface: string;
  /** Muted emerald / moss green – interactive accent */
  accent: string;
  /** Soft off-white / pale sage – primary readable text */
  textPrimary: string;
  /** Muted grey-green – secondary / supporting text */
  textSecondary: string;
  /** Mid-dark green – borders, dividers, outlines */
  border: string;
  /** Muted red – danger / error states */
  error: string;
}

/**
 * The canonical dark-forest palette tokens used throughout the app.
 *
 * Colour rationale
 * ────────────────
 * background    #1a2e1a  – deep, almost-black green evoking a dense canopy at night
 * surface       #243524  – a shade lighter to lift cards off the background
 * accent        #4a7c59  – muted emerald / moss; earthy yet clearly interactive
 * textPrimary   #d4e4d4  – pale sage off-white for comfortable reading contrast
 * textSecondary #8faa8f  – grey-green for de-emphasised or supporting copy
 * border        #3a5a3a  – subtle mid-green that separates without shouting
 * error         #c45c5c  – warm muted red; stands out against greens while
 *                          staying harmonious with the forest palette
 */
export const darkForestPalette: DarkForestPalette = {
  background: '#1a2e1a',
  surface: '#243524',
  accent: '#4a7c59',
  textPrimary: '#d4e4d4',
  textSecondary: '#8faa8f',
  border: '#3a5a3a',
  error: '#c45c5c',
};

export default darkForestPalette;
