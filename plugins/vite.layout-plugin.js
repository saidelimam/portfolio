import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Vite plugin to merge layout.html with page HTML files
 * This plugin runs BEFORE other plugins that replace placeholders
 * It merges common structure from layout.html into each page HTML
 * @param {Object} options - Plugin options
 * @param {string} [options.layoutPath] - Override the default layout file path (useful for testing)
 * @returns {Object} Vite plugin object
 */
export default function layoutPlugin(options = {}) {
  // Allow overriding layout path for testing
  const defaultLayoutPath = resolve(process.cwd(), 'layout.html');
  const getLayoutPath = () => options.layoutPath || defaultLayoutPath;

  return {
    name: 'layout-merge',
    enforce: 'pre', // Run before other plugins
    transformIndexHtml(html, context) {
        try {
          const layoutPath = getLayoutPath();

          if (!existsSync(layoutPath)) {
            console.warn('Layout HTML not found at:', layoutPath);
            return html;
          }

          const layoutHTML = readFileSync(layoutPath, 'utf-8');

          // Extract head and body content from layout
          const layoutHeadMatch = layoutHTML.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
          const layoutBodyMatch = layoutHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

          if (!layoutHeadMatch || !layoutBodyMatch) {
            console.warn('Could not parse layout.html structure');
            return html;
          }

          const layoutHeadContent = layoutHeadMatch[1];
          const layoutBodyContent = layoutBodyMatch[1];

          // Extract head and body content from page HTML
          const pageHeadMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
          const pageBodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

          if (!pageHeadMatch || !pageBodyMatch) {
            console.warn('Could not parse page HTML structure');
            return html;
          }

          const pageHeadContent = pageHeadMatch[1];
          const pageBodyContent = pageBodyMatch[1];

          // Extract scripts from page body
          const pageBodyScripts = [];
          const allBodyScriptsMatch = pageBodyContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
          if (allBodyScriptsMatch) {
            pageBodyScripts.push(...allBodyScriptsMatch);
          }

          // Merge head tags: add layout tags that don't exist in page
          const mergedHead = mergeHeadTags(layoutHeadContent, pageHeadContent);
          
          // Extract scripts from page head
          const pageHeadScripts = [];
          const allHeadScriptsMatch = pageHeadContent.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
          if (allHeadScriptsMatch) {
            pageHeadScripts.push(...allHeadScriptsMatch);
          }

          // Merge body content: replace placeholders in layout with page content
          let mergedBody = layoutBodyContent;
          
          // NOTE: We no longer inject a main.js script tag here
          // Each page-specific script (home.js, photography.js, videography.js, discography.js)
          // imports what it needs from core.js internally
          // Vite handles bundling, minification, and hashing automatically in production
          
          // Combine all scripts (from head and body), remove duplicates
          const allScripts = [...new Set([...pageHeadScripts, ...pageBodyScripts])];
          
          // All scripts are additional scripts (no main.js anymore - it's merged into home.js)
          let additionalScripts = allScripts;
          
          // NOTE: Script path handling for production builds
          // In development: Vite serves files as-is, relative paths work correctly
          // In production: Vite automatically processes all <script type="module"> tags:
          //   1. Bundles and minifies the JS files
          //   2. Adds content hashes to filenames (e.g., assets/main-abc123.js)
          //   3. Replaces script src paths in HTML with the actual hashed filenames
          //   4. Resolves paths relative to the source HTML file location
          // So we keep relative paths here (../src/js/ or src/js/) and let Vite handle the rest
          // The pages plugin moves files after build, but Vite has already resolved all paths correctly
          
          // Inject additional scripts
          if (additionalScripts.length > 0) {
            mergedBody = mergedBody.replace(/\{\{ADDITIONAL_SCRIPTS\}\}/g, additionalScripts.join('\n    '));
          } else {
            // Remove placeholder if no additional scripts found
            mergedBody = mergedBody.replace(/\{\{ADDITIONAL_SCRIPTS\}\}/g, '');
          }
          
          // Extract and replace {{MAIN_CONTENT}} placeholder with only the inner content (not the main tag itself)
          const pageMainMatch = pageBodyContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
          if (pageMainMatch) {
            mergedBody = mergedBody.replace(/\{\{MAIN_CONTENT\}\}/g, pageMainMatch[1]);
          }
          
          // Extract and replace {{NAV_LINKS}} placeholder in header
          const pageNavMatch = pageBodyContent.match(/<ul[^>]*class=["']nav-links["'][^>]*>([\s\S]*?)<\/ul>/i);
          if (pageNavMatch) {
            mergedBody = mergedBody.replace(/\{\{NAV_LINKS\}\}/g, pageNavMatch[1]);
          } else {
            // Replace with empty string if no nav links found
            mergedBody = mergedBody.replace(/\{\{NAV_LINKS\}\}/g, '');
          }
          
          // Extract any other page-specific content (modals, etc.) and append after footer
          const pageOtherContent = pageBodyContent
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<main[^>]*>[\s\S]*?<\/main>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .trim();
          
                  if (pageOtherContent) {
                    // Insert before closing body tag (before scripts)
                    // Find the first script tag and insert content before it
                    mergedBody = mergedBody.replace(/(\s*)(<script type="module"[^>]*>)/i, `${pageOtherContent}\n    $1$2`);
                  }

          // Reconstruct the HTML with merged content
          const htmlMatch = html.match(/<!doctype html>/i);
          const htmlTagMatch = html.match(/<html[^>]*>/i);
          const htmlTag = htmlTagMatch ? htmlTagMatch[0] : '<html lang="en">';
          const htmlCloseTag = html.match(/<\/html>/i) ? '</html>' : '';

          return `${htmlMatch ? htmlMatch[0] : ''}\n${htmlTag}\n  <head>\n${mergedHead}\n  </head>\n  <body>\n${mergedBody}\n  </body>\n${htmlCloseTag}`;
        } catch (error) {
          console.error('Error merging layout:', error);
          return html;
        }
    },
  };
}

/**
 * Merge head tags from layout and page
 * Page tags override layout tags when they have the same key (meta name, property, etc.)
 */
function mergeHeadTags(layoutHead, pageHead) {
  // Split both into individual tags
  const layoutTags = extractTags(layoutHead);
  const pageTags = extractTags(pageHead);

  // Create a map to store merged tags by key
  // Add layout tags first
  const mergedTagMap = new Map();
  
  // First, add all layout tags
  layoutTags.forEach((layoutTag) => {
    const key = getTagKey(layoutTag);
    if (key) {
      mergedTagMap.set(key, layoutTag);
    }
  });

  // Then, add page tags (this will override layout tags with the same key)
  pageTags.forEach((pageTag) => {
    const key = getTagKey(pageTag);
    if (key) {
      mergedTagMap.set(key, pageTag); // Overrides layout tag if same key
    }
  });

  // Convert map to array (page tags have overridden layout tags at this point)
  const merged = Array.from(mergedTagMap.values());

  // Add any tags without keys (unkeyed tags) - add page tags first, then layout
  pageTags.forEach((pageTag) => {
    const key = getTagKey(pageTag);
    if (!key && !merged.includes(pageTag)) {
      merged.push(pageTag);
    }
  });

  layoutTags.forEach((layoutTag) => {
    const key = getTagKey(layoutTag);
    if (!key && !merged.includes(layoutTag)) {
      merged.push(layoutTag);
    }
  });

  // Sort tags: title first, then meta, then links, then scripts, then others
  return sortHeadTags(merged).join('\n    ');
}


/**
 * Extract individual tags from head content
 */
function extractTags(headContent) {
  const tags = [];
  
  // Match various tag types
  const tagPatterns = [
    /<title[^>]*>[\s\S]*?<\/title>/gi,
    /<meta[^>]*\/?>/gi,
    /<link[^>]*\/?>/gi,
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<noscript[^>]*>[\s\S]*?<\/noscript>/gi,
  ];

  tagPatterns.forEach((pattern) => {
    const matches = headContent.match(pattern);
    if (matches) {
      tags.push(...matches);
    }
  });

  return tags;
}

/**
 * Get a unique key for a tag to identify duplicates
 */
function getTagKey(tag) {
  // Extract tag name
  const tagNameMatch = tag.match(/<(\w+)/i);
  if (!tagNameMatch) return null;

  const tagName = tagNameMatch[1].toLowerCase();

  // For specific tags, use attributes as key
  if (tagName === 'meta') {
    const nameMatch = tag.match(/name=["']([^"']+)["']/i);
    const propertyMatch = tag.match(/property=["']([^"']+)["']/i);
    const httpEquivMatch = tag.match(/http-equiv=["']([^"']+)["']/i);
    
    if (nameMatch) return `meta:name:${nameMatch[1]}`;
    if (propertyMatch) return `meta:property:${propertyMatch[1]}`;
    if (httpEquivMatch) return `meta:http-equiv:${httpEquivMatch[1]}`;
    return null;
  }

  if (tagName === 'link') {
    const relMatch = tag.match(/rel=["']([^"']+)["']/i);
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (relMatch && hrefMatch) return `link:rel:${relMatch[1]}:href:${hrefMatch[1]}`;
    if (relMatch) return `link:rel:${relMatch[1]}`;
    return null;
  }

  if (tagName === 'title') return 'title';
  if (tagName === 'style') return 'style:inline';
  
  return `tag:${tagName}`;
}

/**
 * Sort head tags in a logical order
 */
function sortHeadTags(tags) {
  const sorted = [];
  const others = [];

  // Extract title
  const title = tags.find((tag) => tag.match(/<title/i));
  if (title) sorted.push(title);

  // Extract charset meta
  const charset = tags.find((tag) => tag.match(/charset/i));
  if (charset) sorted.push(charset);

  // Extract other meta tags
  const metaTags = tags.filter((tag) => tag.match(/<meta/i) && !tag.match(/charset/i));
  sorted.push(...metaTags);

  // Extract link tags (favicons, stylesheets, etc.)
  const linkTags = tags.filter((tag) => tag.match(/<link/i));
  sorted.push(...linkTags);

  // Extract style tags
  const styleTags = tags.filter((tag) => tag.match(/<style/i));
  sorted.push(...styleTags);

  // Extract script and noscript tags
  const scriptTags = tags.filter((tag) => tag.match(/<script|<noscript/i));
  sorted.push(...scriptTags);

  // Add any remaining tags
  tags.forEach((tag) => {
    if (!sorted.includes(tag)) {
      others.push(tag);
    }
  });
  sorted.push(...others);

  return sorted;
}

