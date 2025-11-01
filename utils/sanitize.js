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
    '/': '&#x2F;',
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

/**
 * Sanitize embed HTML (iframes, embed tags) to allow only safe content
 * Removes dangerous scripts, event handlers, and validates src URLs
 */
export function sanitizeEmbed(embedHTML) {
  if (!embedHTML) return '';
  
  // Create a temporary container to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = embedHTML;
  
  // Remove script tags and their content
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove style tags that could contain malicious CSS
  const styles = tempDiv.querySelectorAll('style');
  styles.forEach(style => style.remove());
  
  // Process iframes and embed tags
  const iframes = tempDiv.querySelectorAll('iframe');
  const embeds = tempDiv.querySelectorAll('embed');
  const objects = tempDiv.querySelectorAll('object');
  
  // Combine all embed-like elements
  const allEmbeds = [...iframes, ...embeds, ...objects];
  
  allEmbeds.forEach(element => {
    // Sanitize src attribute
    if (element.src) {
      const src = sanitizeURL(element.src);
      if (!src || src.toLowerCase().startsWith('javascript:') || src.toLowerCase().startsWith('data:')) {
        element.remove();
        return;
      }
      element.src = src;
    }
    
    // Remove dangerous attributes
    const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'];
    dangerousAttrs.forEach(attr => {
      element.removeAttribute(attr);
    });
    
    // Remove data attributes that could be used for XSS
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-') && attr.name !== 'data-video-id') {
        element.removeAttribute(attr.name);
      }
    });
    
    // Note: We don't add sandbox attribute automatically as it would break legitimate embeds
    // (YouTube, Spotify, etc. need full functionality). The sandbox can be added manually in the JSON
    // if needed for additional security on untrusted content.
  });
  
  // Remove any remaining elements that could execute code
  const dangerousElements = tempDiv.querySelectorAll('form, input, button, meta, link, base');
  dangerousElements.forEach(el => el.remove());
  
  return tempDiv.innerHTML;
}
