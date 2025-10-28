# Portfolio Website Template

A modern, performant, and responsive portfolio website template. Built with HTML, LESS, and vanilla JavaScript, powered by Vite.

**Preview:** [saidelimam.com](https://www.saidelimam.com)

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
  "person": {
    "name": "Your Name",
    "location": "City, Country",
    "tagline": "Your Professional Tagline",
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

- `public/api/metadata.json` - Personal information, skills, companies
- `public/api/projects.json` - Project showcase data
- `public/api/links.json` - Social media links
- `public/api/videography.json` - Video gallery data
- `public/api/discography.json` - Music albums data
- `src/styles/variables.less` - Color scheme and styling

## 🎨 Gallery Pages

- **Photography** (`/photography`) - Image gallery with lightbox
- **Videography** (`/videography`) - Video showcase with YouTube embeds
- **Discography** (`/discography`) - Music albums with Spotify embeds

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
- **LESS** - CSS preprocessing
- **Vanilla JavaScript** - No frameworks
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Roboto)

## ✨ Features

- ✅ Fully responsive design
- ✅ Modern UI with animations
- ✅ SEO optimized
- ✅ Fast performance
- ✅ Accessible (WCAG compliant)
- ✅ Gallery pages for photos/videos/music
- ✅ Security headers included (see [SECURITY.md](SECURITY.md))
- ✅ Hot Module Replacement (HMR)
- ✅ Data-driven with JSON files

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
