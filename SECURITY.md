# Security Features

This document outlines the security measures implemented in the portfolio website.

## Security Headers

The site implements comprehensive security headers through multiple layers:

### 1. HTTP Security Headers (via `public/_headers`)

When deployed, the following headers should be configured on your server:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

X-Content-Type-Options: nosniff

X-XSS-Protection: 1; mode=block

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), speaker=()

X-Frame-Options: DENY

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 2. Meta Tags (in HTML)

Additional security meta tags in `index.html`:

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information

## XSS Prevention

### Input Sanitization

All inputs from JSON files are sanitized before being rendered:

1. **HTML Sanitization**: The `sanitizeHTML()` function in `src/js/projects.js` escapes:
   - `<` → `&lt;`
   - `>` → `&gt;`
   - `&` → `&amp;`
   - `"` → `&quot;`
   - `'` → `&#x27;`
   - `/` → `&#x2F;`

2. **URL Sanitization**: The `sanitizeURL()` function prevents:
   - `javascript:` URLs
   - `data:` URLs
   - Other dangerous URL schemes

3. **External Links**: All external links use `rel="noopener noreferrer"` to prevent:
   - Tabnabbing attacks
   - Access to `window.opener`

## Content Security Policy

The site implements a strict CSP that:

- Restricts script sources to self, CDNjs, and Font Awesome
- Restricts style sources to self, Google Fonts, and CDNjs
- Prohibits inline scripts (except where necessary for Vite)
- Blocks frame embedding
- Prevents MIME sniffing

## Platform-Specific Configuration

### Netlify

✅ **`public/_headers` file is automatically recognized!**

Just deploy to Netlify and the headers will be applied. No additional configuration needed.

### Vercel

✅ **Use the included `vercel.json` file**

The `vercel.json` file in the project root contains all security headers and will be automatically applied when deploying to Vercel.

### Apache

✅ **Use the included `public/.htaccess` file**

Copy the `.htaccess` file to your Apache server's public directory. The file includes all security headers.

If needed, you can configure manually:

```apache
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), speaker=()"
</IfModule>
```

### Nginx

Configure manually in your nginx server block:

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), speaker=()";
```

### Cloudflare Pages

Add these in the Cloudflare dashboard under **Rules** → **Transform Rules** → **Modify Response Header**

#### Manual Dashboard Configuration

Alternatively, add headers in the Cloudflare dashboard:

1. Go to your Pages project
2. Navigate to **Settings** → **Custom Headers**
3. Add the following headers:
   - `Content-Security-Policy`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), speaker=()`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

### GitHub Pages

❌ **GitHub Pages does NOT support custom headers**

You'll need to use a service like Cloudflare in front of GitHub Pages or deploy to a platform that supports headers (Netlify, Vercel, etc.)

## robots.txt Security

- Prevents crawling of sensitive directories (`/src/`, `/plugins/`, etc.)
- Blocks access to configuration files
- Protects security contact information

## Dependencies Security

Regularly update dependencies:

```bash
npm audit
npm audit fix
```

Current devDependencies:

- `vite@^7.1.12` - Modern build tool
- `less@^4.2.0` - CSS preprocessor
- `less-watch-compiler@^1.16.3` - File watcher
- `concurrently@^9.2.1` - Command runner

## External Resources

The site loads resources from trusted CDNs:

- Google Fonts (https://fonts.googleapis.com, https://fonts.gstatic.com)
- Font Awesome (https://cdnjs.cloudflare.com)
- All resources use HTTPS

## Reporting Security Issues

If you discover a security vulnerability, please contact:

- Email: contact@saidelimam.com
- Security contact: See `public/.well-known/security.txt`

Please provide:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact assessment
4. Suggested fix (if applicable)

## Updates and Maintenance

- Regularly update dependencies using `npm audit` and `npm update`
- Review and update security headers as needed
- Monitor for security advisories in used libraries
- Test security headers using tools like [SecurityHeaders.com](https://securityheaders.com)

## Additional Security Considerations

1. **HTTPS Only**: Always deploy with HTTPS (TLS 1.2+)
2. **Input Validation**: All JSON data should be validated before use
3. **Service Worker**: Implements secure caching strategies
4. **No User Authentication**: No sensitive user data is stored
5. **Static Site**: No server-side vulnerabilities
6. **Regular Updates**: Keep dependencies up to date

---

Last updated: January 27, 2025
