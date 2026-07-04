# Said Elimam's Portfolio Website Template

A light, modern, performant, and responsive portfolio website template.
Built with HTML, LESS, and vanilla JavaScript, powered by Vite, enhanced by AI.

**Preview:** [saidelimam.com](https://www.saidelimam.com)

> **Note:** This template generates a fully static website. All JSON data is injected into HTML at build time via Vite plugins, resulting in plain HTML files with no server-side rendering or database requirements. Perfect for hosting on any static hosting platform, and SEO-friendly!

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+

### Installation
```bash
# Clone the repository
git clone https://github.com/saidelimam/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Customization

### 1. Update Personal Information
Edit `public/api/metadata.json`:
```json
{
  "facebookAppId": "your-facebook-app-id",
  "themeColor": "#c2185b",
  "person": {
    "name": "Your Name",
    "location": "City, Country",
    "tagline": "Your Professional Tagline",
    "fullName": "Your Full Name - Professional Title",
    "website": "https://yourwebsite.com"
  },
  "about": {
    "description": "Your professional description..."
  },
  "skills": ["Skill 1", "Skill 2"],
  "companies": [{"name": "Company", "url": "https://company.com"}]
}
```

### 2. Add Your Projects
Edit `public/api/projects.json` with your projects data.

### 3. Update Social Links
Edit `public/api/links.json` with your social media profiles.

### 4. Replace Images
- `public/img/profile_picture.jpg` - Your profile photo
- `public/img/logo-white.webp` - Your logo (white version)
- `public/img/logo-black.webp` - Your logo (black version)

### 5. Customize Colors
Edit `src/styles/variables.less` to match your brand colors.

## 📁 Key Files

- `layout.html` - Base HTML template with common structure (head, header, footer, scripts)
- `public/api/metadata.json` - Personal information, skills, companies, theme color, facebook app ID
- `public/api/projects.json` - Project showcase data
- `public/api/links.json` - Social media links
- `public/api/videography.json` - Video gallery data
- `public/api/discography.json` - Music albums data
- `src/components/` - Gallery item templates (photography-item.html, videography-item.html, discography-item.html)
- `src/styles/variables.less` - Color scheme and styling
- `src/js/utils.js` - Utility functions (debounce, browser detection, image security, etc.)
- `src/js/core.js` - Core transversal functionality (header effects, smooth scrolling, page loading spinner)
- `src/js/modals.js` - Shared modal functionality
- `src/js/photography.js` - Photography gallery lightbox with image loading spinner
- `src/js/videography.js` - Video gallery with dual filtering (type and project), URL parameter support, and YouTube embed handling
- `src/js/discography.js` - Discography page with Spotify embed support

## 🎨 Gallery Pages

See [DOCUMENTATION.md](DOCUMENTATION.md#gallery-pages) for details about the photography, videography, and discography galleries.

## 📚 Documentation

For complete documentation including:
- Detailed project structure
- All features and interactive elements
- Security configuration
- Advanced customization options

👉 **[Read Full Documentation](DOCUMENTATION.md)**

## 🛠️ Development

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

## 📦 Tech Stack

- **Vite** - Build tool and dev server
- **LESS** - CSS preprocessing with variables and mixins
- **Vanilla JavaScript** - No frameworks, ES6 modules
- **Inline SVG icons** - Custom sprite (`layout.html`), no icon-font dependency
- **Local Fonts** - Typography (Roboto loaded locally from `public/fonts/` to avoid external requests)

### Code Organization

See [DOCUMENTATION.md](DOCUMENTATION.md#code-organization) for detailed code structure information.

## ✨ Features

- ✅ Fully responsive design
- ✅ Modern UI with animated background (hero section only)
- ✅ SEO optimized
- ✅ Fast performance with optimized animations
- ✅ Accessible (WCAG compliant)
- ✅ Gallery pages for photos/videos/music with lightbox
- ✅ Loading spinners - Page navigation spinner for internal links and image lightbox spinner
- ✅ Image protection (drag and right-click prevention)
- ✅ Smart animation pausing on scroll (saves resources)
- ✅ Browser navigation support for modals
- ✅ Security headers included (see [SECURITY.md](SECURITY.md))
- ✅ Hot Module Replacement (HMR)
- ✅ Data-driven with JSON files
- ✅ Performance optimizations for low-end devices and Instagram browser

## 💰 Why Choose This Over WordPress, Squarespace, or Wix?

### Cost Comparison

| Platform | Initial Cost | Annual Cost | 5-Year Total |
|----------|-------------|--------------|--------------|
| **This Template** | Free | $0-60* | **$0-300** |
| WordPress + Hosting | $50-200 | $60-400/year | **$350-2,200** |
| Squarespace | $0 | $144-216/year | **$720-1,080** |
| Wix | $0 | $168-300/year | **$840-1,500** |

*Optional: Free on Netlify/Vercel/Cloudflare Pages, or $5-20/year for a custom domain + hosting

### Advantages

**🚀 Performance**
- Lightning-fast load times (no database queries, no server-side processing)
- Perfect Lighthouse scores
- Zero bloat from CMS overhead

**💰 Cost**
- **Free hosting** on Netlify, Vercel, Cloudflare Pages, or GitHub Pages
- No monthly/yearly subscriptions
- Only pay for a domain (optional)

**🔒 Security**
- No database = no SQL injection vulnerabilities
- No plugins to update or security patches
- Reduced attack surface

**🎨 Design Freedom**
- Complete code ownership and full customization
- No template restrictions
- No "premium" feature limitations

**⚡ Development**
- Version control with Git
- Easy content updates via JSON files
- Fast deployment (automated with GitHub)

**📈 SEO**
- 100% control over meta tags and structure
- No plugin conflicts affecting SEO
- Fast indexing with static HTML

**📦 Portability**
- Own your code
- Host anywhere, anytime
- No vendor lock-in

### Best For

- ✅ Creative professionals (photographers, videographers, designers)
- ✅ Developers showcasing portfolios
- ✅ Artists and musicians
- ✅ Anyone who wants professional results without subscriptions

### Not Ideal For

- ❌ E-commerce stores (use Shopify for that)
- ❌ Blogs with hundreds of posts (use WordPress)
- ❌ Sites requiring frequent content updates by non-technical users

## 🌐 Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## 📄 License

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

You are free to use and modify this template, but you must:
- Give appropriate credit
- Link back to this repository
- Indicate if changes were made

View the full [LICENSE](LICENSE) file.

## 👨‍💻 Author

**Said Elimam** - Filmmaker, Music Composer & Engineer from Paris

- Website: [saidelimam.com](https://www.saidelimam.com)
- Email: [contact@saidelimam.com](mailto:contact@saidelimam.com)
- GitHub: [@saidelimam](https://github.com/saidelimam)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

⭐ If you found this template useful, please consider giving it a star!
