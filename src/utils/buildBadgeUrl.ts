/**
 * Parameters accepted by buildBadgeUrl.
 */
export interface BuildBadgeUrlParams {
  /** The left-hand label text on the badge (e.g. 'visitors') */
  label: string;
  /** The right-hand message / value text on the badge (e.g. 'count') */
  message: string;
  /** The badge colour (e.g. 'blue', 'green', '#ff0000') */
  color: string;
  /**
   * Optional URL to embed as the badge link.
   * The value will be fully percent-encoded so that characters such as
   * ':', '/', and '#' become '%3A', '%2F', and '%23' respectively.
   */
  link?: string;
}

/**
 * buildBadgeUrl
 *
 * Builds a shields.io static-badge URL from the supplied parameters.
 *
 * Key encoding guarantees
 * -----------------------
 * • The `link` query-parameter value is encoded with `encodeURIComponent`,
 *   so colons, slashes, and hash characters are all percent-encoded
 *   (%3A, %2F, %23).  This ensures no bare '#' appears in the URL outside
 *   the initial scheme portion, which would otherwise be misinterpreted as
 *   a URL fragment delimiter.
 * • Top-level query parameters are separated by literal '&' characters
 *   (not '%26'), keeping the URL human-readable and correctly parsed by
 *   standard URL consumers.
 *
 * @example
 * buildBadgeUrl({ label: 'visitors', message: 'count', color: 'blue' })
 * // → 'https://img.shields.io/static/v1?label=visitors&message=count&color=blue'
 *
 * @example
 * buildBadgeUrl({
 *   label: 'visitors',
 *   message: 'count',
 *   color: 'blue',
 *   link: 'https://example.com/path#section',
 * })
 * // → 'https://img.shields.io/static/v1?label=visitors&message=count&color=blue&link=https%3A%2F%2Fexample.com%2Fpath%23section'
 */
export function buildBadgeUrl({
  label,
  message,
  color,
  link,
}: BuildBadgeUrlParams): string {
  const BASE = 'https://img.shields.io/static/v1';

  // Build each key=value pair, percent-encoding the values so that
  // special characters (including '#') cannot break the URL structure.
  const parts: string[] = [
    `label=${encodeURIComponent(label)}`,
    `message=${encodeURIComponent(message)}`,
    `color=${encodeURIComponent(color)}`,
  ];

  // Only append the link parameter when it was explicitly provided.
  if (link !== undefined) {
    // encodeURIComponent encodes ':', '/', '#', '?', '&', etc.
    // e.g. 'https://example.com/path#section'
    //   → 'https%3A%2F%2Fexample.com%2Fpath%23section'
    parts.push(`link=${encodeURIComponent(link)}`);
  }

  // Join with a literal '&' — NOT '%26' — so the query string is valid.
  return `${BASE}?${parts.join('&')}`;
}
