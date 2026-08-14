import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Read social/profile URLs from links.json to populate schema.org `sameAs`.
 * Only absolute http(s) links are included (e.g. mailto: links are skipped).
 * @returns {string[]} Array of profile URLs
 */
function readSocialUrls() {
  try {
    const linksPath = resolve(process.cwd(), 'public/api/links.json');
    if (!existsSync(linksPath)) return [];
    const links = JSON.parse(readFileSync(linksPath, 'utf-8'));
    return links
      .filter((link) => link && typeof link.url === 'string' && /^https?:\/\//i.test(link.url))
      .map((link) => link.url);
  } catch {
    return [];
  }
}

/**
 * Build a schema.org JSON-LD `<script>` describing the person, the website and
 * the current page (ProfilePage for home, CollectionPage + BreadcrumbList for
 * galleries). Undefined fields are dropped automatically by JSON.stringify.
 * @param {Object} metadata - Parsed metadata.json
 * @param {string} canonicalUrl - Canonical URL of the current page
 * @param {string} pageName - Page slug ("" for the home page)
 * @returns {string} A JSON-LD script tag
 */
function buildStructuredData(metadata, canonicalUrl, pageName) {
  const website = metadata.person.website;
  const personId = `${website}/#person`;
  const siteId = `${website}/#website`;
  const socialUrls = readSocialUrls();

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: metadata.person.name,
    url: website,
    image: `${website}/img/profile_picture.jpg`,
    description: metadata.person.tagline,
    jobTitle: Array.isArray(metadata.roles) && metadata.roles.length ? metadata.roles : undefined,
    knowsAbout: Array.isArray(metadata.skills) && metadata.skills.length ? metadata.skills : undefined,
    address: metadata.person.location
      ? { '@type': 'PostalAddress', addressLocality: metadata.person.location, addressCountry: 'FR' }
      : undefined,
    sameAs: socialUrls.length ? socialUrls : undefined,
  };

  const webSite = {
    '@type': 'WebSite',
    '@id': siteId,
    url: website,
    name: `${metadata.person.name} — Portfolio`,
    inLanguage: 'en',
    publisher: { '@id': personId },
  };

  const graph = [person, webSite];

  if (!pageName) {
    graph.push({
      '@type': 'ProfilePage',
      '@id': `${website}/#webpage`,
      url: website,
      name: `${metadata.person.name} — Portfolio`,
      isPartOf: { '@id': siteId },
      about: { '@id': personId },
      mainEntity: { '@id': personId },
      inLanguage: 'en',
    });
  } else {
    const labelMap = {
      photography: 'Photography',
      videography: 'Videography',
      discography: 'Discography',
      privacy: 'Privacy Policy',
    };
    const label = labelMap[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const isCollection = ['photography', 'videography', 'discography'].includes(pageName);
    const pageObj = {
      '@type': isCollection ? 'CollectionPage' : 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: `${label} — ${metadata.person.name}`,
      isPartOf: { '@id': siteId },
      about: { '@id': personId },
      inLanguage: 'en',
      breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
    };
    graph.push(pageObj);

    // For videography page, add the latest video as a CreativeWork
    if (pageName === 'videography') {
      const latestVideo = readLatestVideo();
      if (latestVideo) {
        graph.push({
          '@type': 'VideoObject',
          name: latestVideo.title,
          datePublished: latestVideo.date,
          director: { '@id': personId },
          isPartOf: { '@id': `${canonicalUrl}#webpage` },
        });
        pageObj.mainEntity = {
          '@type': 'VideoObject',
          name: latestVideo.title,
          datePublished: latestVideo.date,
          director: { '@id': personId },
        };
      }
    }

    // For discography page, add the latest album as a CreativeWork
    if (pageName === 'discography') {
      const latestAlbum = readLatestAlbum();
      if (latestAlbum) {
        graph.push({
          '@type': 'MusicAlbum',
          name: latestAlbum.title,
          datePublished: latestAlbum.date,
          byArtist: { '@id': personId },
          isPartOf: { '@id': `${canonicalUrl}#webpage` },
        });
        pageObj.mainEntity = {
          '@type': 'MusicAlbum',
          name: latestAlbum.title,
          datePublished: latestAlbum.date,
          byArtist: { '@id': personId },
        };
      }
    }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: website },
        { '@type': 'ListItem', position: 2, name: label, item: canonicalUrl },
      ],
    });
  }

  // Escape "<" so the JSON can never break out of the surrounding <script> tag.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * Read the latest video from videography.json.
 * @returns {{title: string, date: string} | null}
 */
function readLatestVideo() {
  try {
    const path = resolve(process.cwd(), 'public/api/videography.json');
    if (!existsSync(path)) return null;
    const videos = JSON.parse(readFileSync(path, 'utf-8'));
    if (!Array.isArray(videos) || videos.length === 0) return null;
    // Sort by date descending, return the most recent
    const latest = videos.sort((a, b) => {
      const parseDate = (d) => {
        const [m, y] = d.split('/').map(Number);
        return new Date(y, m - 1);
      };
      return parseDate(b.date) - parseDate(a.date);
    })[0];
    return { title: latest.title, date: latest.date };
  } catch {
    return null;
  }
}

/**
 * Read the latest album from discography.json.
 * @returns {{title: string, date: string} | null}
 */
function readLatestAlbum() {
  try {
    const path = resolve(process.cwd(), 'public/api/discography.json');
    if (!existsSync(path)) return null;
    const albums = JSON.parse(readFileSync(path, 'utf-8'));
    if (!Array.isArray(albums) || albums.length === 0) return null;
    // Sort by date descending, return the most recent
    const latest = albums.sort((a, b) => {
      const parseDate = (d) => {
        const [m, y] = d.split('/').map(Number);
        return new Date(y, m - 1);
      };
      return parseDate(b.date) - parseDate(a.date);
    })[0];
    return { title: latest.title, date: latest.date };
  } catch {
    return null;
  }
}

/**
 * Vite plugin to inject metadata from metadata.json into HTML
 * @param {Object} options - Plugin options
 * @param {string} [options.metadataPath] - Override the default metadata file path (useful for testing)
 * @returns {Object} Vite plugin object
 */
export default function metadataPlugin(options = {}) {
  // Allow overriding metadata path for testing
  const defaultMetadataPath = resolve(process.cwd(), 'public/api/metadata.json');
  const getMetadataPath = () => options.metadataPath || defaultMetadataPath;

  return {
    name: 'inject-metadata',
    transformIndexHtml(html, context) {
      try {
        const metadataPath = getMetadataPath();

        if (!existsSync(metadataPath)) {
          console.warn('Metadata JSON not found at:', metadataPath);
          return html;
        }

        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

        // Replace theme color placeholder
        const themeColor = metadata.themeColor || '#c2185b'; // Fallback to default if not set
        html = html.replace(/{{THEME_COLOR}}/g, themeColor);

        // Determine the current page name and canonical URL from the path.
        // Examples: pages/photography.html -> "photography"; index.html -> "" (root)
        let pageName = '';
        let canonicalUrl = metadata.person.website; // Default to website root
        if (context.path) {
          const pathMatch = context.path.match(/(?:pages\/)?([^\/]+)\.html$/);
          if (pathMatch && pathMatch[1] !== 'index') {
            pageName = pathMatch[1];
            canonicalUrl = `${metadata.person.website}/${pageName}`;
          }
          // index.html and other root pages use the default website URL
        }

        // Per-page titles & descriptions give each page a unique, descriptive
        // snippet for search engines and social cards (avoids duplicate metadata).
        const name = metadata.person.name;
        const tagline = metadata.person.tagline;
        const baseDescription = `${name}, ${tagline}. Check out his work and contact him for booking requests!`;
        const latestVideo = readLatestVideo();
        const videoMention = latestVideo ? ` Latest release: "${latestVideo.title}" (${latestVideo.date}).` : '';
        const latestAlbum = readLatestAlbum();
        const albumMention = latestAlbum ? ` Latest release: "${latestAlbum.title}" (${latestAlbum.date}).` : '';
        const pageDescriptions = {
          photography: `Photography by ${name} — a curated gallery of stills capturing light, emotion and story, from Paris and beyond.`,
          videography: `Films, demo reels and music videos directed and shot by ${name}, a Paris-based filmmaker and cinematographer.${videoMention}`,
          discography: `Original music compositions and productions by ${name}. Stream the full discography.${albumMention}`,
          privacy: `Privacy policy for ${name}'s portfolio — what data is collected, how it is used, and how it is protected.`,
        };
        const pageTitles = {
          photography: `Photography — ${name}`,
          videography: `Videography — ${name}`,
          discography: `Discography — ${name}`,
          privacy: `Privacy Policy — ${name}`,
        };
        const metaDescription = pageDescriptions[pageName] || baseDescription;
        const socialTitle = pageTitles[pageName] || `${name} - Portfolio`;
        const socialDescription =
          pageDescriptions[pageName] || `${tagline}. Check out my work and contact me for booking requests!`;

        // Replace all tags
        html = html.replace(/{{TITLE}}/g, name);
        html = html.replace(/{{META_DESCRIPTION}}/g, metaDescription);
        html = html.replace(/{{META_AUTHOR}}/g, name);
        // Static 2026 fallback for no-JS visitors; JavaScript bumps this to the
        // live current year at runtime (see the copyright script in layout.html).
        html = html.replace(/{{META_COPYRIGHT}}/g, `© 2026 ${name}`);
        html = html.replace(/{{FACEBOOK_APP_ID}}/g, metadata.facebookAppId);

        // Canonical / Open Graph / Twitter URLs all resolve to the canonical URL
        html = html.replace(/{{CANONICAL_URL}}/g, canonicalUrl);
        html = html.replace(/{{OG_URL}}/g, canonicalUrl);
        html = html.replace(/{{OG_TITLE}}/g, socialTitle);
        html = html.replace(/{{OG_DESCRIPTION}}/g, socialDescription);
        html = html.replace(/{{OG_IMAGE}}/g, `${metadata.person.website}/img/profile_picture.jpg`);
        html = html.replace(/{{OG_IMAGE_ALT}}/g, `${name} - Profile Picture`);
        html = html.replace(/{{OG_SITE_NAME}}/g, `${name} Portfolio`);
        html = html.replace(/{{TWITTER_URL}}/g, canonicalUrl);
        html = html.replace(/{{TWITTER_TITLE}}/g, socialTitle);
        html = html.replace(/{{TWITTER_DESCRIPTION}}/g, socialDescription);
        html = html.replace(/{{TWITTER_IMAGE}}/g, `${metadata.person.website}/img/profile_picture.jpg`);
        html = html.replace(/{{TWITTER_IMAGE_ALT}}/g, `${name} - Profile Picture`);

        // Replace logo image alt placeholder
        html = html.replace(/{{LOGO_IMG_ALT}}/g, metadata.person.fullName);

        // Replace hero h1 placeholder
        html = html.replace(/{{HERO_H1}}/g, metadata.person.fullName);

        // Replace hero tagline placeholder
        html = html.replace(/{{HERO_TAGLINE}}/g, metadata.person.tagline);

        // Hero display name — accent the final word for an artistic touch
        const heroName = (metadata.person.name || '').trim();
        const nameParts = heroName.split(/\s+/).filter(Boolean);
        let heroNameHTML = heroName;
        if (nameParts.length > 1) {
          const lastWord = nameParts.pop();
          heroNameHTML = `${nameParts.join(' ')} <span class="hero-title-accent">${lastWord}</span>`;
        }
        html = html.replace(/{{HERO_NAME}}/g, heroNameHTML);

        // Hero location label
        html = html.replace(/{{HERO_LOCATION}}/g, metadata.person.location || '');

        // Hero rotating roles — duplicate the first role at the end so the
        // vertical slide loops seamlessly (see .hero-roles in main.less).
        const roles = Array.isArray(metadata.roles) ? metadata.roles : [];
        let rolesHTML = '';
        if (roles.length > 0) {
          const loopRoles = [...roles, roles[0]];
          rolesHTML = `<span class="hero-roles-track">${loopRoles
            .map((role) => `<span class="hero-role">${role}</span>`)
            .join('')}</span>`;
        }
        html = html.replace(/{{HERO_ROLES}}/g, rolesHTML);

        // Replace about description placeholder with truncated version and Read more link
        const fullDescription = metadata.about.description || '';
        const truncatedLength = 350;
        let descriptionHTML = fullDescription;
        
        if (fullDescription.length > truncatedLength) {
          // Find a good break point (end of sentence or space near 1000 characters)
          let breakPoint = truncatedLength;
          const nearEnd = fullDescription.substring(truncatedLength - 50, truncatedLength + 50);
          // Try to break at sentence end
          const sentenceEnd = nearEnd.search(/[.!?]\s/);
          if (sentenceEnd > 0) {
            breakPoint = truncatedLength - 50 + sentenceEnd + 1;
          } else {
            // Try to break at space
            const spaceIndex = nearEnd.lastIndexOf(' ');
            if (spaceIndex > 0) {
              breakPoint = truncatedLength - 50 + spaceIndex + 1;
            }
          }
          
          const truncatedText = fullDescription.substring(0, breakPoint).trim();
          const remainingText = fullDescription.substring(breakPoint).trim();
          
          descriptionHTML = `<span class="about-description-text"><span class="about-description-truncated">${truncatedText}...</span><span class="about-description-full" style="display: none;">${fullDescription}</span></span> <a href="#" class="about-read-more" aria-label="Read more about me">Read more</a>`;
        }
        
        html = html.replace(/{{ABOUT_DESCRIPTION}}/g, descriptionHTML);

        // Generate skills HTML
        const skillsHTML = metadata.skills
          .map(
            (skill) =>
              `<span class="skill-tag" role="listitem">${skill}</span>`
          )
          .join('\n');

        // Replace skills placeholder
        html = html.replace(/{{SKILLS}}/g, skillsHTML);

        // Generate companies HTML. Each link sits inside its own list item so
        // the anchor keeps its implicit "link" role (ARIA disallows role="listitem"
        // on an <a>), while the list/listitem semantics live on <ul>/<li>.
        const companiesHTML = metadata.companies
          .map(
            (company) =>
              `<li class="company-item"><a href="${company.url}" target="_blank" class="company-tag" rel="noopener noreferrer" aria-label="${company.name} company">${company.name}</a></li>`
          )
          .join('\n');

        // Replace companies placeholder
        html = html.replace(/{{COMPANIES}}/g, companiesHTML);

        // Inject JSON-LD structured data (only when the layout exposes the slot)
        if (html.includes('{{STRUCTURED_DATA}}')) {
          html = html.replace(/{{STRUCTURED_DATA}}/g, buildStructuredData(metadata, canonicalUrl, pageName));
        }

        return html;
      } catch (error) {
        console.error('Error in metadata plugin:', error);
        return html;
      }
    },
  };
}
