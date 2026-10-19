/**
 * Client-Side HTML Sanitizer for Safe Rich Text Rendering
 * Strips script tags, iframes, inline event handlers, and dangerous URL protocols.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'ul', 'ol', 'li',
  'blockquote', 'q', 'cite',
  'pre', 'code', 'kbd', 'samp',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'div', 'span', 'section', 'article', 'sub', 'sup'
]);

const ALLOWED_ATTRIBUTES = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  th: new Set(['colspan', 'rowspan', 'scope', 'align']),
  td: new Set(['colspan', 'rowspan', 'align']),
  code: new Set(['class']),
  pre: new Set(['class']),
  div: new Set(['class']),
  span: new Set(['class']),
};

export function sanitizeClientHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  let sanitized = rawHtml;

  // 1. Remove dangerous blocks completely
  sanitized = sanitized.replace(/<\s*(script|iframe|object|embed|style|applet|meta|link|form|svg)[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*(script|iframe|object|embed|style|applet|meta|link|form|svg)[^>]*\/?>/gi, '');

  // 2. Strip inline event handlers
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Disarm javascript: or data: protocols
  sanitized = sanitized.replace(/(href|src)\s*=\s*['"]\s*(javascript|vbscript|data):[\s\S]*?['"]/gi, '$1="#"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*(javascript|vbscript|data):[^\s>]*/gi, '$1="#"');

  // 4. Clean tag names and attributes
  sanitized = sanitized.replace(/<\s*([a-zA-Z0-9]+)([^>]*)>/g, (match, tagName, attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) return '';

    const allowedForTag = ALLOWED_ATTRIBUTES[lowerTag] || new Set();
    const cleanAttrs = [];
    const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      if (attrName.startsWith('on') || attrName === 'style') continue;

      if (allowedForTag.has(attrName)) {
        if (attrName === 'href' || attrName === 'src') {
          const trimmedVal = attrVal.trim().toLowerCase();
          if (trimmedVal.startsWith('javascript:') || trimmedVal.startsWith('vbscript:') || trimmedVal.startsWith('data:text/html')) {
            continue;
          }
        }

        if (lowerTag === 'a' && attrName === 'target' && attrVal === '_blank') {
          cleanAttrs.push('target="_blank" rel="noopener noreferrer"');
          continue;
        }

        cleanAttrs.push(`${attrName}="${attrVal.replace(/"/g, '&quot;')}"`);
      }
    }

    return `<${lowerTag}${cleanAttrs.length ? ' ' + cleanAttrs.join(' ') : ''}>`;
  });

  // 5. Clean closing tags
  sanitized = sanitized.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, (match, tagName) => {
    const lowerTag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) return '';
    return `</${lowerTag}>`;
  });

  return sanitized;
}

export default sanitizeClientHtml;
