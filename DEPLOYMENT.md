# Deployment Guide - Istanbul Tourist Pass

This guide provides solutions for deploying your Vue 3 application to various platforms and fixing the Cloudflare Wrangler deployment error.

## 🚀 Quick Fix for Cloudflare Wrangler Error

The error you encountered is likely due to missing configuration files. We've added the necessary files to resolve this:

### Files Added:
- `wrangler.toml` - Cloudflare Pages configuration
- `vercel.json` - Vercel deployment configuration  
- `public/_redirects` - Netlify SPA routing
- Updated `vite.config.js` - Optimized build settings
- Updated `package.json` - Added deployment scripts

## 📋 Deployment Options

### 1. **Cloudflare Pages**
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy:cloudflare
```

### 2. **Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy:vercel
```

### 3. **Netlify**
```bash
# Build the project
npm run build

# Deploy the dist folder to Netlify
# (Use Netlify UI or CLI)
```

### 4. **GitHub Pages**
```bash
# Build the project
npm run build

# Deploy using GitHub Actions
# (Add .github/workflows/deploy.yml)
```

## 🔧 Configuration Files Explained

### `wrangler.toml` (Cloudflare Pages)
```toml
name = "istanbul-tourist-pass"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
entry-point = "."

[build]
command = "npm run build"
```

### `vercel.json` (Vercel)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### `public/_redirects` (Netlify)
```
/*    /index.html   200
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

2. **Routing Issues**
   - Ensure SPA routing is configured (all platforms above include this)
   - Check that `public/_redirects` or equivalent is present

3. **API CORS Issues**
   - The external API (`searchyourtour.com`) should handle CORS
   - If issues persist, consider using a proxy

4. **Asset Loading Issues**
   - Ensure all assets are in the `dist` folder
   - Check that paths are relative, not absolute

### Environment Variables:
If you need to add environment variables for different environments:

```bash
# .env.production
VITE_API_URL=https://searchyourtour.com/api
VITE_APP_TITLE=Istanbul Tourist Pass
```

## 📱 Testing Deployment

After deployment, test these key features:

1. **Homepage** - Should load without errors
2. **Attractions Page** - Should fetch and display Istanbul tours
3. **Tours Page** - Should show all available tours
4. **Tour Details** - Should display individual tour information
5. **Navigation** - All routes should work correctly
6. **Mobile Responsiveness** - Should work on all devices

## 🔄 CI/CD Integration

### GitHub Actions Example:
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: istanbul-tourist-pass
          directory: dist
```

## 📞 Support

If you continue to experience deployment issues:

1. Check the platform-specific documentation
2. Verify all configuration files are present
3. Test the build locally: `npm run build`
4. Check the deployment logs for specific error messages

## ✅ Success Checklist

- [ ] Build completes without errors: `npm run build`
- [ ] All configuration files are present
- [ ] SPA routing is configured
- [ ] Environment variables are set (if needed)
- [ ] API calls work in production
- [ ] All pages load correctly
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable 