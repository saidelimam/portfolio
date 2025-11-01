# Full Documentation

This is the complete documentation for Said Elimam's Portfolio Website Template. For a quick start guide, see [README.md](README.md).

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Development](#development)
- [Customization](#customization)
- [Vite Configuration](#vite-configuration)
- [Browser Support](#browser-support)
- [License](#license)

For contributing guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).  
For security configuration, see [SECURITY.md](SECURITY.md).

---

## Project Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── public/                 # Static assets (served from root)
│   ├── api/               # Data files
│   │   ├── projects.json  # Projects data
│   │   ├── videography.json # Videography data
│   │   ├── discography.json # Discography data
│   │   ├── links.json     # Social media links data
│   │   └── metadata.json  # Site metadata (name, tagline, skills, etc.)
│   ├── img/               # Images (logos, profile picture, icons, snapshots)
│   │   ├── icon/          # Project icons
│   │   ├── snapshot/      # Project snapshots
│   │   ├── photography/   # Photography gallery images
│   │   └── videography/   # Videography cover images
│   ├── favicon.webp       # WebP favicon
│   ├── favicon.png        # PNG favicon fallback
│   ├── robots.txt         # Search engine instructions
│   ├── ai.txt            # AI system guidelines
│   ├── _headers          # Security headers (for Netlify)
│   ├── .htaccess         # Apache security headers
│   ├── service-worker.js # PWA service worker
│   └── .well-known/      # Standard metadata files
│       ├── security.txt   # Security contact info
│       └── pgp-key.txt    # PGP public key
├── pages/                 # Additional HTML pages
│   ├── photography.html   # Photography gallery page
│   ├── videography.html  # Videography gallery page
│   ├── discography.html   # Discography page
│   └── privacy.html       # Privacy policy page
├── src/                   # Source files (processed by Vite)
│   ├── js/
│   │   ├── main.js        # Core JavaScript functionality (header, scroll, background animations)
│   │   ├── projects.js    # Project modal and data management
│   │   ├── lightbox.js    # Photography gallery lightbox with touch/swipe navigation
│   │   ├── videography.js # Videography video loading with YouTube embeds
│   │   ├── modals.js      # Shared modal functionality (open/close, navigation, spinners)
│   │   ├── links.js       # Social links initialization
│   │   └── utils.js       # Utility functions (sanitization, debounce, browser detection, image security)
│   ├── styles/
│   │   ├── main.less      # Main LESS file with imports
│   │   ├── background.less # Animated background effects (hero section only)
│   │   ├── variables.less  # LESS variables and constants
│   │   ├── modals.less    # Modal-specific styles
│   │   ├── tooltips.less  # Custom tooltip styles
│   │   ├── links.less     # Social links styles with responsive layout
│   │   ├── performance.less # Performance optimizations (Instagram browser, low-performance devices)
│   │   └── gallery.less   # Gallery styles (photography & videography)
├── dist/                  # Production build output
├── vite.config.js        # Vite configuration
├── utils/                # Shared utilities
│   └── sanitize.js       # HTML/URL sanitization functions
├── plugins/              # Vite custom plugins
│   ├── vite.metadata-plugin.js # Site metadata injection
│   ├── vite.projects-plugin.js # Projects data injection
│   ├── vite.links-plugin.js     # Social links injection
│   ├── vite.photography-plugin.js # Photography gallery injection
│   ├── vite.videography-plugin.js # Videography gallery injection
│   ├── vite.discography-plugin.js # Discography injection
│   └── vite.pages-plugin.js # Pages reorganization
├── vercel.json           # Vercel deployment config with security headers
├── package.json          # NPM configuration with build scripts
├── .prettierrc           # Prettier code formatter configuration
├── .prettierignore      # Prettier ignore rules
├── .gitignore            # Git ignore rules
├── LICENSE                # Creative Commons license
├── README.md             # Quick start guide
└── SECURITY.md           # Security documentation
```

## Features

### Core Functionality

- **Responsive Design**: Works on desktop, tablet, and mobile with optimized layouts
- **Modern UI**: Animated gradient backgrounds (body), cinematic lighting effects and dust particles (hero section only), glassmorphism
- **Vite-Powered**: Fast development server with Hot Module Replacement (HMR)
- **LESS Preprocessing**: Organized styles with variables, mixins, and nesting
- **Modular Architecture**: Separated LESS and JavaScript files for maintainability
- **Data-Driven Content**: Projects, videography, and links loaded from JSON files via Vite plugins
- **Shared Utilities**: Centralized functions (sanitization, debounce, browser detection, image security, modal management)
- **Performance Optimized**: Animation disabling for low-performance devices, Opera browsers, and Instagram browser
- **Smart Animation Control**: Animations pause automatically when scrolling past 500px to save resources

### Interactive Elements

- **Smooth Scrolling**: Enhanced navigation experience with passive event listeners
- **Scroll-to-Top Button**: Convenient navigation with Font Awesome chevron icon, shows after 50px scroll
- **Dynamic Logo**: Logo changes color based on scroll position (white/black) with smooth transitions
- **Custom Tooltips**: Styled tooltips for social media links
- **Social Links**: Brand-colored hover effects for each platform (Instagram gradient, Spotify green, etc.)
  - Desktop (>768px): Rounded square icons with brand-colored hover effects
  - Mobile/Tablet (≤768px): Full-width button layout in a column for better touch interaction
- **Project Modals**: Detailed project information with snapshots, metadata, browser navigation support
- **Modal System**: Shared modal utilities for consistent behavior (open/close, navigation, media pausing)
- **Cinematic Background**: Rotating gradient background with animated spotlight effects (hero section only)
- **Dust Particles**: Floating purple particles with individual movement patterns (hero section only)
- **Body Gradient**: Animated linear gradient background with blue, purple, and pink shades
- **Animation Pausing**: All background animations pause when scrolling past 500px
- **Photography Gallery**: Lightbox with swipe navigation, keyboard controls, and image protection
- **Videography Gallery**: Click-to-play video grid with YouTube embeds and loading spinners
- **Discography**: Album showcase with Spotify embeds and loading spinners
- **Image Security**: All images protected from dragging and right-clicking

### Accessibility & SEO

- **WCAG Compliant**: Full accessibility support with ARIA labels and semantic HTML
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, structured data
- **Screen Reader Support**: Proper heading hierarchy and descriptive alt text
- **Multi-language**: English, French, and Arabic language support
- **Security Headers**: Security.txt, robots.txt, and AI guidelines

### Security

- **XSS Prevention**: Input sanitization for all user-generated content via `utils/sanitize.js`
- **Image Protection**: All images (profile, gallery, project snapshots) protected from dragging and right-clicking
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options, HSTS
  - Automatic for Netlify: `public/_headers`
  - Vercel: `vercel.json`
  - Apache: `public/.htaccess`
- **Secure External Links**: All links use rel="noopener noreferrer"
- **URL Sanitization**: Prevents javascript: and data: URL attacks
- **Content Security Policy**: Restricts resource loading
- **Service Worker**: `public/service-worker.js` implements secure caching
- **Robots.txt**: Prevents crawling of sensitive files and directories
- **Documentation**: See `SECURITY.md` for platform-specific setup

### Project Showcase

- **Project Cards**: Interactive cards with type indicators, blurred backgrounds, and hover effects
- **Project Details**: Comprehensive modals with snapshots, tags, metadata, and embed support
- **Company Showcase**: Links to companies worked with
- **Skills Display**: Animated skill tags with hover effects
- **Social Integration**: Links to Instagram, IMDB, Spotify, LinkedIn, YouTube, GitHub, and Email

### Gallery Pages

- **Photography Gallery** (`/photography`): Full-screen mosaic grid with lightbox modal, swipe navigation, keyboard controls (arrow keys, Escape), and protected images (no drag, no right-click)
- **Videography Gallery** (`/videography`): Video grid (1-3 columns responsive) with cover images, click-to-play YouTube embeds, loading spinners, only one video plays at a time, protected cover images
- **Discography** (`/discography`): Album showcase with Spotify embeds, loading spinners, title and date headers, responsive 1-2 column layout

## Development

### Prerequisites

- Node.js 20.19+ or 22.12+ (Vite requirement)
- npm (for dependencies and build tools)

### Setup

1. Use this template: Click "Use this template" on GitHub to create your own repository
2. Clone your repository: `git clone https://github.com/yourusername/portfolio.git`
3. Navigate to the project: `cd portfolio`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`
6. Open `http://localhost:3000` in your browser

### Development Workflow

- **Dev Server**: `npm run dev` - Vite development server with HMR
- **Build**: `npm run build` - Production build to `dist/` folder
- **Preview**: `npm run preview` - Preview production build
- **Build CSS**: `npm run build-css` - One-time LESS compilation
- **Watch CSS**: `npm run watch-css` - Auto-compile LESS on changes

### Dependencies

All development dependencies are included locally:

- **vite**: Modern build tool and development server
- **less**: LESS CSS preprocessor
- **less-watch-compiler**: Auto-compilation on file changes
- **concurrently**: Run multiple commands simultaneously

## Customization

This template is fully customizable through JSON files and LESS variables.

### Step 1: Update Personal Information

1. Edit `public/api/metadata.json` to update your personal information (see Metadata section below)
2. Update `public/img/profile_picture.jpg` with your own photo
3. Replace `public/img/logo-white.webp` and `public/img/logo-black.webp` with your logos

### Step 2: Add Your Projects

Edit `public/api/projects.json` to add your own projects (see Project Data section below)

### Step 3: Update Social Links

Edit `public/api/links.json` to update your social media links (see Social Links Data section below)

### Step 4: Customize Styling

Edit LESS variables to match your brand colors (see LESS Variables section below)

### Metadata

Edit site-wide information in `public/api/metadata.json`:

```json
{
  "person": {
    "name": "Your Name",
    "location": "City, Country",
    "tagline": "Your Professional Tagline",
    "fullName": "Your Full Professional Name",
    "website": "https://yourwebsite.com",
    "facebookAppId": "your-facebook-app-id"
  },
  "about": {
    "description": "Your professional description..."
  },
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "companies": [{ "name": "Company Name", "url": "https://company.com" }]
}
```

### LESS Variables

Edit the LESS variables in `src/styles/variables.less`:

```less
// Color palette
@accent-color: #c2185b;
@accent-light: lighten(@accent-color, 50%);
@primary-color: #667eea;
@secondary-color: @accent-color;
@accent-text-color: @white;
@text-color: #333;
@text-light: #666;
@white: #fff;

// Typography
@font-family:
  'Roboto',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

// Spacing
@spacing-xs: 0.5rem;
@spacing-sm: 1rem;
@spacing-md: 1.5rem;
@spacing-lg: 2rem;
@spacing-xl: 3rem;
```

### Project Data

Edit project information in `public/api/projects.json`:

```json
[
  {
    "type": "dev",
    "date": "01/2025",
    "title": "Project Name",
    "icon": "img/icon/project.ico",
    "description": "Project description",
    "details": "Detailed project information",
    "snapshot": "img/snapshot/project.jpg",
    "tags": ["React", "Node.js", "TypeScript"],
    "links": [{ "text": "Visit Project", "url": "https://example.com" }]
  }
]
```

### Social Links Data

Edit social media links in `public/api/links.json`:

```json
[
  {
    "platform": "GitHub",
    "url": "https://github.com/saidelimam",
    "icon": "fab fa-github",
    "label": "Review my code on GitHub"
  }
]
```

### Videography Data

Edit videography gallery in `public/api/videography.json`:

```json
[
  {
    "title": "Video Title",
    "videoId": "youtube-video-id",
    "cover": "cover-image.jpg"
  }
]
```

Add cover images to `public/img/videography/` with the filename matching the `cover` field.

### Discography Data

Edit discography albums in `public/api/discography.json`:

```json
[
  {
    "title": "Album Title",
    "date": "MM/YYYY",
    "embed": "<iframe>Spotify or other embed code</iframe>"
  }
]
```

The `embed` field should contain the full HTML iframe code from Spotify or other streaming platforms.

### Vite HTML Placeholder System

The HTML uses placeholder tags with double brackets `{{TAG}}` that are replaced at build time by Vite plugins:

- `{{TITLE}}` - Site title
- `{{META_DESCRIPTION}}` - Meta description
- `{{META_AUTHOR}}` - Author meta tag
- `{{META_COPYRIGHT}}` - Copyright meta tag
- `{{FACEBOOK_APP_ID}}` - Facebook App ID
- `{{OG_URL}}`, `{{OG_TITLE}}`, `{{OG_DESCRIPTION}}`, etc. - Open Graph tags
- `{{TWITTER_URL}}`, `{{TWITTER_TITLE}}`, etc. - Twitter Card tags
- `{{LOGO_IMG}}` - Logo image
- `{{HERO_H1}}`, `{{HERO_TAGLINE}}` - Hero section content
- `{{ABOUT_DESCRIPTION}}` - About me description
- `{{SKILLS}}` - Skills list
- `{{COMPANIES}}` - Companies list
- `{{PROJECTS}}` - Project cards
- `{{SOCIAL_LINKS}}` - Social media links
- `{{PHOTOS}}` - Photography gallery images
- `{{VIDEOS}}` - Videography gallery items
- `{{ALBUMS}}` - Discography albums

## Vite Configuration

The project uses Vite for development and building. Key configuration in `vite.config.js`:

- **Static Site**: Configured for static HTML/CSS/JS
- **LESS Support**: Built-in LESS preprocessing
- **Asset Handling**: Optimized handling of images and fonts
- **Development Server**: Hot Module Replacement (HMR) enabled
- **Production Builds**: Optimized bundles with asset optimization
- **Custom Plugins**:
  - `plugins/vite.metadata-plugin.js`: Injects site metadata from `public/api/metadata.json`
  - `plugins/vite.projects-plugin.js`: Injects project cards from `public/api/projects.json`
  - `plugins/vite.links-plugin.js`: Injects social links from `public/api/links.json`
  - `plugins/vite.photography-plugin.js`: Injects photography gallery from `public/img/photography/`
  - `plugins/vite.videography-plugin.js`: Injects videography gallery from `public/api/videography.json`
  - `plugins/vite.discography-plugin.js`: Injects discography albums from `public/api/discography.json`
  - `plugins/vite.pages-plugin.js`: Reorganizes pages from `pages/` to clean URLs

## Sections

- **Hero**: Introduction with profile picture (protected), subtitle, animated background (gradient, cinematic lights, dust particles), social media links with responsive layout (rounded squares on desktop, full-width buttons on mobile/tablet), brand-colored hover effects, and custom tooltips
- **About**: Personal description, skills expertise, and companies worked with in a responsive 2-column layout
- **Projects**: Featured work showcase with interactive modals, browser navigation support, protected project snapshots, and metadata
- **Galleries**: Navigation buttons to Photography, Videography, and Discography gallery pages
- **Footer**: Copyright and privacy policy links

### Gallery Pages

- **Photography (`/photography`)**: Full-screen image mosaic with lightbox modal, keyboard navigation (arrow keys, Escape), swipe support on touch devices, and protected images (no drag, no right-click)
- **Videography (`/videography`)**: Video grid with protected cover images, play button overlay, YouTube embeds with loading spinners, one video plays at a time, responsive 1-2-3 column layout
- **Discography (`/discography`)**: Album showcase with Spotify embeds and loading spinners, title and date headers, responsive 1-2 column layout

### Code Organization

The JavaScript code is organized into modular files:

- **`src/js/main.js`**: Core functionality (header scroll effects, smooth scrolling, background animations, scroll-to-top, discography embeds, profile picture security)
- **`src/js/projects.js`**: Project data loading, project cards initialization, and project modal management
- **`src/js/lightbox.js`**: Photography gallery lightbox with touch/swipe navigation, keyboard controls, and image protection
- **`src/js/videography.js`**: Video gallery initialization, YouTube embed loading with spinners, and cover image protection
- **`src/js/modals.js`**: Shared modal utilities (open/close, browser navigation, close handlers, iframe spinner management)
- **`src/js/utils.js`**: Utility functions (debounce, browser detection, low-performance device detection, scroll handler creation, image security, modal state management, iframe spinner hiding, media pausing)

### Performance Optimizations

- **RequestAnimationFrame**: Used for smooth scroll handlers to optimize repaints
- **Passive Event Listeners**: Applied to scroll and touch events for better performance
- **Hardware Acceleration**: CSS transforms with translateZ(0) for GPU acceleration
- **Animation Pausing**: Background animations pause when scrolling past 500px
- **Instagram Browser Detection**: Simplified animations and disabled expensive effects
- **Low-Performance Device Detection**: Based on CPU cores, RAM, and connection speed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

### What this means:

**You are free to:**

- ✅ Share — copy and redistribute the material in any medium or format
- ✅ Adapt — remix, transform, and build upon the material for any purpose, even commercially

**Under the following conditions:**

- ⚠️ **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made

### Attribution Requirements:

If you use this template for your portfolio, please include a credit and link back to this repository. You can do this by:

1. Adding an attribution in your website footer or README
2. Including a link to the original repository: `https://github.com/saidelimam/portfolio`
3. Example: "Built using Said Elimam's Portfolio Template (https://github.com/saidelimam/portfolio)"

View the full license text in the [LICENSE](LICENSE) file or at [Creative Commons](http://creativecommons.org/licenses/by/4.0/)

