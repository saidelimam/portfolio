/**
 * Sanitization utilities for both client and server-side use
 */

// Sanitize HTML to prevent XSS attacks
export function sanitizeHTML(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  const reg = /[&<>"'/]/gi;
  return String(str).replace(reg, (match) => map[match]);
}

// Sanitize URL to prevent javascript: and data: URLs
export function sanitizeURL(url) {
  if (!url) return '';
  url = String(url).trim();
  // Prevent javascript: and data: URLs
  if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
    return '';
  }
  return url;
}

