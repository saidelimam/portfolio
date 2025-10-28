import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export default function metadataPlugin() {
  return {
    name: 'inject-metadata',
    transformIndexHtml(html, context) {
      try {
        const metadataPath = resolve(process.cwd(), 'public/api/metadata.json');

        if (!existsSync(metadataPath)) {
          console.warn('Metadata JSON not found at:', metadataPath);
          return html;
        }

        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

        // Generate skills HTML
        const skillsHTML = metadata.skills
          .map(
            (skill) =>
              `                            <span class="skill-tag" role="listitem">${skill}</span>`
          )
          .join('\n');

        // Generate companies HTML
        const companiesHTML = metadata.companies
          .map(
            (company) =>
              `                            <a href="${company.url}" target="_blank" class="company-tag" role="listitem" rel="noopener noreferrer" aria-label="${company.name} company">${company.name}</a>`
          )
          .join('\n');
        
        // Replace all tags
        
        html = html.replace(/{{TITLE}}/g, metadata.person.name);
        html = html.replace(
          /{{META_DESCRIPTION}}/g,
          `<meta name="description" content="${metadata.person.name}, ${metadata.person.tagline}. Check out his work and contact him for booking requests!"/>`
        );
        html = html.replace(
          /{{META_AUTHOR}}/g,
          `<meta name="author" content="${metadata.person.name}"/>`
        );
        html = html.replace(
          /{{META_COPYRIGHT}}/g,
          `<meta name="copyright" content="© 2025 ${metadata.person.name}"/>`
        );
        html = html.replace(
          /{{FACEBOOK_APP_ID}}/g,
          `<meta property="fb:app_id" content="${metadata.person.facebookAppId}"/>`
        );
        
        html = html.replace(
          /{{OG_URL}}/g,
          `<meta property="og:url" content="${metadata.person.website}"/>`
        );
        html = html.replace(
          /{{OG_TITLE}}/g,
          `<meta property="og:title" content="${metadata.person.name} - Portfolio"/>`
        );
        html = html.replace(
          /{{OG_DESCRIPTION}}/g,
          `<meta property="og:description" content="${metadata.person.tagline}. Check out my work and contact me for booking requests!"/>`
        );
        html = html.replace(
          /{{OG_IMAGE}}/g,
          `<meta property="og:image" content="${metadata.person.website}/img/profile_picture.jpg"/>`
        );
        html = html.replace(
          /{{OG_IMAGE_ALT}}/g,
          `<meta property="og:image:alt" content="${metadata.person.name} - Profile Picture"/>`
        );
        html = html.replace(
          /{{OG_SITE_NAME}}/g,
          `<meta property="og:site_name" content="${metadata.person.name} Portfolio"/>`
        );
        html = html.replace(
          /{{TWITTER_URL}}/g,
          `<meta property="twitter:url" content="${metadata.person.website}"/>`
        );
        html = html.replace(
          /{{TWITTER_TITLE}}/g,
          `<meta property="twitter:title" content="${metadata.person.name} - Portfolio"/>`
        );
        html = html.replace(
          /{{TWITTER_DESCRIPTION}}/g,
          `<meta property="twitter:description" content="${metadata.person.tagline}. Check out my work and contact me for booking requests!"/>`
        );
        html = html.replace(
          /{{TWITTER_IMAGE}}/g,
          `<meta property="twitter:image" content="${metadata.person.website}/img/profile_picture.jpg"/>`
        );
        html = html.replace(
          /{{TWITTER_IMAGE_ALT}}/g,
          `<meta property="twitter:image:alt" content="${metadata.person.name} - Profile Picture"/>`
        );
        html = html.replace(
          /{{LOGO_IMG}}/g,
          `<img src="/img/logo-white.webp" alt="${metadata.person.fullName}" />`
        );
        html = html.replace(/{{HERO_H1}}/g, metadata.person.fullName);
        html = html.replace(/{{HERO_TAGLINE}}/g, metadata.person.tagline);
        html = html.replace(/{{ABOUT_DESCRIPTION}}/g, metadata.about.description);
        html = html.replace(/{{SKILLS}}/g, skillsHTML);
        html = html.replace(/{{COMPANIES}}/g, companiesHTML);

        return html;
      } catch (error) {
        console.error('Error in metadata plugin:', error);
        return html;
      }
    },
  };
}
