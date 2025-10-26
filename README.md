# Portfolio Website

A modern, responsive portfolio website built with HTML, CSS (compiled from LESS), and vanilla JavaScript, powered by Vite for optimal development and build experience.

## Project Structure

```
portfolio/
├── index.html              # Main HTML entry point
├── public/                 # Static assets (served from root)
│   └── img/               # Images (logos, profile picture)
├── src/                   # Source files (processed by Vite)
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   ├── styles/
│   │   ├── main.less      # LESS source file with variables and mixins
│   │   └── main.css       # Compiled CSS file
│   └── assets/            # Additional assets (empty for now)
├── dist/                  # Production build output
├── vite.config.js        # Vite configuration
├── package.json           # NPM configuration with build scripts
└── README.md             # This file
```

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Gradient backgrounds, smooth animations, glassmorphism effects
- **Vite-Powered**: Fast development server with Hot Module Replacement (HMR)
- **LESS Preprocessing**: Organized styles with variables, mixins, and nesting
- **CSS Variables**: For easy theme customization
- **Smooth Scrolling**: Enhanced navigation experience
- **Interactive Elements**: Hover effects and animations
- **Scroll Animations**: Elements animate in as they come into view
- **Scroll-to-Top Button**: Convenient navigation back to top
- **Modular JavaScript**: Well-organized, maintainable code structure
- **Dynamic Logo**: Logo changes color based on scroll position
- **Optimized Builds**: Production-ready builds with asset optimization

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

#### Colors
Edit the CSS variables in `src/styles/main.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ffd700;
  --text-color: #333;
  --text-light: #666;
  --white: #fff;
}
```

#### LESS Variables
Edit the LESS variables in `src/styles/main.less`:
```less
@primary-color: #667eea;
@secondary-color: #764ba2;
@accent-color: #ffd700;
```

### Vite Configuration
The project uses Vite for development and building. Key configuration in `vite.config.js`:
- **Static Site**: Configured for static HTML/CSS/JS
- **LESS Support**: Built-in LESS preprocessing
- **Asset Handling**: Optimized handling of images and fonts
- **Development Server**: Hot Module Replacement (HMR) enabled
- **Production Builds**: Optimized bundles with asset optimization

## Sections

- **Hero**: Introduction with profile picture and social links
- **About**: Personal description and background
- **Projects**: Featured work showcase
- **Skills**: Technology stack and expertise areas

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC