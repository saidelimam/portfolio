# Said Elimam - Portfolio Website

A modern, responsive portfolio website for Said Elimam - Filmmaker, Music Composer and Engineer from Paris. Built with HTML, CSS (compiled from LESS), and vanilla JavaScript, powered by Vite for optimal development and build experience.

## Project Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── public/                 # Static assets (served from root)
│   ├── img/               # Images (logos, profile picture, icons, snapshots)
│   │   ├── icon/          # Project icons
│   │   └── snapshot/      # Project snapshots
│   ├── favicon.webp       # WebP favicon
│   ├── favicon.png        # PNG favicon fallback
│   ├── robots.txt         # Search engine instructions
│   ├── ai.txt            # AI system guidelines
│   └── .well-known/      # Standard metadata files
│       ├── security.txt   # Security contact info
│       └── pgp-key.txt    # PGP public key
├── src/                   # Source files (processed by Vite)
│   ├── js/
│   │   ├── main.js        # Core JavaScript functionality
│   │   └── projects.js    # Project modal and data management
│   ├── styles/
│   │   ├── main.less      # Main LESS file with imports
│   │   ├── variables.less # LESS variables and constants
│   │   ├── modals.less    # Modal-specific styles
│   │   ├── tooltips.less  # Custom tooltip styles
│   │   └── responsive.less # Responsive design styles
│   └── privacy.html       # Privacy policy page
├── dist/                  # Production build output
├── vite.config.js        # Vite configuration
├── package.json           # NPM configuration with build scripts
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Features

### Core Functionality
- **Responsive Design**: Works on desktop, tablet, and mobile with optimized layouts
- **Modern UI**: Gradient backgrounds, smooth animations, glassmorphism effects
- **Vite-Powered**: Fast development server with Hot Module Replacement (HMR)
- **LESS Preprocessing**: Organized styles with variables, mixins, and nesting
- **Modular Architecture**: Separated LESS files for maintainability

### Interactive Elements
- **Smooth Scrolling**: Enhanced navigation experience
- **Scroll Animations**: Elements animate in as they come into view using IntersectionObserver
- **Scroll-to-Top Button**: Convenient navigation with Font Awesome chevron icon
- **Dynamic Logo**: Logo changes color based on scroll position (white/black)
- **Custom Tooltips**: Styled tooltips for social media links
- **Project Modals**: Detailed project information with snapshots and metadata

### Accessibility & SEO
- **WCAG Compliant**: Full accessibility support with ARIA labels and semantic HTML
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, structured data
- **Screen Reader Support**: Proper heading hierarchy and descriptive alt text
- **Multi-language**: English, French, and Arabic language support
- **Security Headers**: Security.txt, robots.txt, and AI guidelines

### Project Showcase
- **Project Cards**: Interactive cards with type indicators and hover effects
- **Project Details**: Comprehensive modals with snapshots, tags, and metadata
- **Company Showcase**: Links to companies worked with
- **Skills Display**: Animated skill tags with hover effects
- **Social Integration**: Links to Instagram, IMDB, Spotify, LinkedIn, YouTube

## Development

### Prerequisites
- Node.js 20.19+ or 22.12+ (Vite requirement)
- npm (for dependencies and build tools)

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:3000` in your browser

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

### Customization

#### LESS Variables
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
@font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

// Spacing
@spacing-xs: 0.5rem;
@spacing-sm: 1rem;
@spacing-md: 1.5rem;
@spacing-lg: 2rem;
@spacing-xl: 3rem;
```

#### Project Data
Edit project information in `src/js/projects.js`:
```javascript
const projectsData = [
  {
    type: 'dev',
    date: '01/2025',
    title: 'Project Name',
    icon: 'img/icon/project.ico',
    description: 'Project description',
    details: 'Detailed project information',
    snapshot: 'img/snapshot/project.jpg',
    tags: ['React', 'Node.js', 'TypeScript'],
    links: [
      { text: 'Visit Project', url: 'https://example.com' }
    ]
  }
];
```

### Vite Configuration
The project uses Vite for development and building. Key configuration in `vite.config.js`:
- **Static Site**: Configured for static HTML/CSS/JS
- **LESS Support**: Built-in LESS preprocessing
- **Asset Handling**: Optimized handling of images and fonts
- **Development Server**: Hot Module Replacement (HMR) enabled
- **Production Builds**: Optimized bundles with asset optimization

## Sections

- **Hero**: Introduction with profile picture, subtitle, and social media links
- **About**: Personal description and multidisciplinary background
- **Projects**: Featured work showcase with interactive modals and project snapshots
- **Skills**: Technology stack, expertise areas, and companies worked with
- **Footer**: Copyright and privacy policy links

## Current Projects

### GoCollab.cc
- **Type**: Development
- **Date**: January 2025
- **Description**: Social Network for Creative Professionals
- **Technologies**: React, Node.js, Cloudflare, PostgreSQL, PWA, AI
- **Features**: Real-time communication, project tracking, resource management
- **Link**: [Visit Platform](https://gocollab.cc)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact

- **Website**: [saidelimam.com](https://www.saidelimam.com)
- **Email**: contact@saidelimam.com
- **Instagram**: [@saidelimam](https://www.instagram.com/saidelimam)
- **IMDB**: [Said Elimam](https://www.imdb.com/name/nm15497367/)
- **Spotify**: [Said Elimam](https://open.spotify.com/artist/3lGVrfvhQFWnGtoM9LrFC4)
- **LinkedIn**: [Said Elimam](https://www.linkedin.com/in/saidelimam/)
- **YouTube**: [@saidelimam](https://www.youtube.com/@saidelimam)

## License

ISC