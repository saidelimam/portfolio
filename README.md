# Said Elimam's Portfolio Website Template

A modern, performant, and responsive portfolio website template. Built with HTML, CSS (compiled from LESS), and vanilla JavaScript, powered by Vite for optimal development and build experience.

Perfect for showcasing your work as a filmmaker, music composer, engineer, or any creative professional.

You can preview it live at [saidelimam.com](https://www.saidelimam.com)

## Project Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── public/                 # Static assets (served from root)
│   ├── api/               # Data files
│   │   ├── projects.json  # Projects data
│   │   ├── links.json     # Social media links data
│   │   └── metadata.json  # Site metadata (name, tagline, skills, etc.)
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
│   │   ├── background.less # Animated background effects
│   │   ├── variables.less # LESS variables and constants
│   │   ├── modals.less    # Modal-specific styles
│   │   ├── tooltips.less  # Custom tooltip styles
│   │   └── responsive.less # Responsive design styles
│   └── privacy.html       # Privacy policy page
├── dist/                  # Production build output
├── vite.config.js        # Vite configuration
├── plugins/              # Vite custom plugins
│   ├── vite.metadata-plugin.js # Site metadata injection
│   ├── vite.projects-plugin.js # Projects data injection
│   └── vite.links-plugin.js     # Social links injection
├── package.json           # NPM configuration with build scripts
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Features

### Core Functionality
- **Responsive Design**: Works on desktop, tablet, and mobile with optimized layouts
- **Modern UI**: Animated gradient backgrounds, cinematic lighting effects, glassmorphism
- **Vite-Powered**: Fast development server with Hot Module Replacement (HMR)
- **LESS Preprocessing**: Organized styles with variables, mixins, and nesting
- **Modular Architecture**: Separated LESS files for maintainability
- **Data-Driven Content**: Projects and links loaded from JSON files via Vite plugins
- **Performance Optimized**: Animation disabling for low-performance devices and Opera browsers

### Interactive Elements
- **Smooth Scrolling**: Enhanced navigation experience
- **Scroll Animations**: Elements animate in as they come into view using IntersectionObserver
- **Scroll-to-Top Button**: Convenient navigation with Font Awesome chevron icon
- **Dynamic Logo**: Logo changes color based on scroll position (white/black)
- **Custom Tooltips**: Styled tooltips for social media links
- **Project Modals**: Detailed project information with snapshots and metadata
- **Cinematic Background**: Rotating gradient background with animated light effects
- **Dust Particles**: Floating purple particles with individual movement patterns

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
- **Social Integration**: Links to Instagram, IMDB, Spotify, LinkedIn, YouTube, GitHub, and Email

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

### Customization

This template is fully customizable through JSON files and LESS variables.

#### Step 1: Update Personal Information
1. Edit `public/api/metadata.json` to update your personal information (see Metadata section below)
2. Update `public/img/profile_picture.jpg` with your own photo
3. Replace `public/img/logo-white.webp` and `public/img/logo-black.webp` with your logos

#### Step 2: Add Your Projects
Edit `public/api/projects.json` to add your own projects (see Project Data section below)

#### Step 3: Update Social Links
Edit `public/api/links.json` to update your social media links (see Social Links Data section below)

#### Step 4: Customize Styling
Edit LESS variables to match your brand colors (see LESS Variables section below)

#### Metadata
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
  "companies": [
    { "name": "Company Name", "url": "https://company.com" }
  ]
}
```

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
    "links": [
      { "text": "Visit Project", "url": "https://example.com" }
    ]
  }
]
```

#### Social Links Data
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

### Vite Configuration
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

## Sections

- **Hero**: Introduction with profile picture, subtitle, and social media links with custom tooltips
- **About**: Personal description, skills expertise, and companies worked with
- **Projects**: Featured work showcase with interactive modals, project snapshots, and metadata
- **Footer**: Copyright and privacy policy links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## About the Author

This template was created by **Said Elimam** - Filmmaker, Music Composer & Engineer from Paris.

**Contact**: [Website](https://www.saidelimam.com) | [Email](mailto:contact@saidelimam.com) | [GitHub](https://github.com/saidelimam)

## Contributing

Contributions are welcome! Feel free to submit a Pull Request or open an Issue for any improvements.

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