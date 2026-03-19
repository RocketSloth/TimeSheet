/**
 * encodeQueryParam
 *
 * Percent-encodes a string so it can be safely used as a query-parameter
 * value in a URL. Delegates to the built-in `encodeURIComponent`, which
 * encodes every character that is not an unreserved URI character
 * (A–Z a–z 0–9 - _ . ~).
 *
 * Examples:
 *   encodeQueryParam('https://example.com') // 'https%3A%2F%2Fexample.com'
 *   encodeQueryParam('foo#bar')             // 'foo%23bar'
 *   encodeQueryParam('hello world')         // 'hello%20world'
 *   encodeQueryParam('')                    // ''
 *
 * @param value - The raw string to encode.
 * @returns The percent-encoded string.
 */
export function encodeQueryParam(value: string): string {
  return encodeURIComponent(value);
}
