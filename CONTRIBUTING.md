# Contributing

Thank you for your interest in contributing to Said Elimam's Portfolio Website Template!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:
1. Open an issue on GitHub
2. Describe the problem or suggestion clearly
3. Include steps to reproduce if it's a bug
4. Provide screenshots if applicable

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes: `git commit -m "Add your feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Code Style

- Follow existing code style
- Use Prettier for formatting (configuration in `.prettierrc`)
- Write meaningful commit messages
- Keep changes focused and modular

## Code Organization

The codebase follows a modular structure:

- **HTML Templating**: Common HTML structure in `layout.html`, page-specific content in `index.html` and `pages/*.html`
- **Component Templates** (`src/components/`): HTML templates for gallery items (photography-item.html, videography-item.html, discography-item.html)
- **Utilities** (`src/js/utils.js`): Extract reusable functions here (debounce, browser detection, image security, etc.)
- **Modals** (`src/js/modals.js`): Shared modal functionality should go here
- **Feature Modules**: Each feature has its own file (projects.js, photography.js, videography.js, home.js)
- **Style Organization**: LESS files are organized by purpose (main, gallery, modals, background, header, performance)
- **Vite Plugins** (`plugins/`): Custom build-time plugins for layout merging, data injection, and gallery generation

When adding new features:
- Use existing utilities when possible
- Add new utilities to `utils.js` if they're reusable
- Keep modal-related code in `modals.js`
- Follow the existing pattern for feature modules
- For new gallery types, add a component template to `src/components/` and update `vite.gallery-plugin.js`
- For new pages, add HTML file and ensure it merges with `layout.html` correctly

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Run before committing
npm run build
```

## Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🚀 Performance optimizations
- 🔒 Security enhancements
- 🧪 Testing

## Testing Guidelines

For detailed testing documentation, see:
- [Main Testing Guide](tests/README.md) - Overview of test structure and running tests
- [Build-Time Tests](tests/build-time/README.md) - Testing Vite plugins and build scripts
- [Runtime Tests](tests/runtime/README.md) - Testing browser-side JavaScript code

When submitting changes, please test:

- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile devices**: Touch interactions, swipe gestures, touch swipe-down to close modals
- **Responsive design**: Different screen sizes (especially discography full-width layout)
- **Accessibility**: Keyboard navigation, screen readers
- **Performance**: Especially on low-end devices
- **Image security**: Ensure drag and right-click protection works
- **Modal functionality**: Browser navigation (back button) works correctly, touch swipe-down closes modals on mobile
- **Loading spinners**: Page navigation spinner appears on internal links and hides on page load, image lightbox spinner shows until image loads
- **Videography filtering**: Filter buttons work correctly, videos stop when filters change
- **Animation pausing**: Animations pause when scrolling past the threshold (ANIMATION_PAUSE_SCROLL_THRESHOLD)

## Questions?

Feel free to open an issue for any questions or reach out to the maintainer.

---

## License

By contributing, you agree that your contributions will be licensed under the same [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE) license that covers the project.

