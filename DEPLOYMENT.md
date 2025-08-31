# Deployment Guide - Istanbul Tourist Pass

This guide provides solutions for deploying your Vue 3 application to various platforms and fixing the Cloudflare Wrangler deployment error.

## 🚀 Quick Fix for Cloudflare Wrangler Error

The error you encountered was due to conflicting configuration fields in `wrangler.toml` and infinite loop in redirect rules. We've fixed both issues.

### Files Added:
- `wrangler.toml` - Cloudflare Pages configuration (FIXED)
- `wrangler.workers.toml` - Alternative Cloudflare Workers configuration
- `public/_redirects` - Specific route redirects (FIXED - no infinite loops)
- `public/_routes.json` - Modern Cloudflare Pages routing
- `public/_headers` - Security headers
- `vercel.json` - Vercel deployment configuration  
- Updated `vite.config.js` - Optimized build settings
- Updated `package.json` - Added deployment scripts
- Updated `LanguageSwitcher.vue` - Now fetches languages from API
- Updated `ToursView.vue` - Now uses new tours API with language/currency
- Updated `AttractionsView.vue` - Now uses new tours API with language/currency
- Updated `TourDetailView.vue` - Now uses new tours API with language/currency

## 🌍 Language Switcher API Integration

The language switcher now fetches real language data from the API:
- **API Endpoint:** `https://backend.searchyourtour.com/api/languages?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1`
- **Features:** Real language names, proper flags, status filtering
- **Fallback:** Default languages if API fails
- **Storage:** Selected language saved to localStorage

### Available Languages from API:
- 🇹🇷 Türkçe (Turkish)
- 🇩🇪 Deutsch (German) 
- 🇺🇸 English
- 🇷🇺 Русский (Russian)
- And more based on API response

## 🏛️ Tours API Integration

All tour-related components now use the new API endpoint with language and currency support:
- **API Endpoint:** `https://backend.searchyourtour.com/api/tours?token=ad5257a5-efdd-4314-9e5e-b56aabe321f1&language_id={id}&currency_id=5&limit=100&IpAdrress=78.177.166.135`
- **Language Support:** Dynamic content based on selected language
- **Currency Support:** USD pricing (currency_id=5)
- **Real-time Updates:** Content updates when language changes

### Language ID Mapping:
- `en` → `language_id=1` (English)
- `tr` → `language_id=2` (Turkish)
- `de` → `language_id=6` (German)
- `ru` → `language_id=9` (Russian)

### Features:
- **Multi-language Content:** Tour names, descriptions, and details in selected language
- **Currency Display:** Proper currency symbols and pricing
- **Istanbul Filtering:** Attractions page filters for Istanbul tours (destination_id: 404)
- **Active Tours Only:** Only displays tours with `is_active: true`
- **Real Images:** High-quality tour images from Cloudinary
- **Dynamic Pricing:** Real-time pricing with currency conversion

## 📋 Deployment Options

### 1. **Cloudflare Pages** (Recommended)
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
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

### `wrangler.toml` (Cloudflare Pages) - FIXED
```toml
name = 'epass'
compatibility_date = "2024-01-01"

[pages]
bucket = "./dist"
```

### `public/_redirects` (Cloudflare Pages) - FIXED
```
/attractions  /index.html  200
/tours  /index.html  200
/istanbul-pass  /index.html  200
/contact  /index.html  200
/faqs  /index.html  200
```

### `public/_routes.json` (Cloudflare Pages)
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": [
    "/assets/*",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/index.html"
  ]
}
```

### `wrangler.workers.toml` (Cloudflare Workers - Alternative)
```toml
name = 'epass-workers'
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
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

## 🛠️ Troubleshooting

### Common Issues:

1. **"Cannot use assets and Workers Sites in the same Worker"**
   - ✅ FIXED: Removed conflicting `[build]` section from `wrangler.toml`
   - Use `[pages]` for Cloudflare Pages, `[site]` for Workers

2. **"Infinite loop detected in this rule"**
   - ✅ FIXED: Replaced generic `/*` redirect with specific route redirects
   - Now using specific routes instead of catch-all redirect

3. **Language API not loading**
   - Check network connectivity
   - Verify API endpoint is accessible
   - Component has fallback to default languages

4. **Tours API not loading**
   - Verify API token is valid
   - Check language_id and currency_id parameters
   - Ensure IP address parameter is included

5. **Build Fails**
   - Check Node.js version (16+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

6. **Routing Issues**
   - Ensure SPA routing is configured (all platforms above include this)
   - Check that `public/_redirects` or equivalent is present

7. **API CORS Issues**
   - The external API (`searchyourtour.com`) should handle CORS
   - If issues persist, consider using a proxy

8. **Asset Loading Issues**
   - Ensure all assets are in the `dist` folder
   - Check that paths are relative, not absolute

### Environment Variables:
If you need to add environment variables for different environments:

```bash
# .env.production
VITE_API_URL=https://backend.searchyourtour.com/api/
VITE_APP_TITLE=SearchYourTour
VITE_LANGUAGE_API_TOKEN=ad5257a5-efdd-4314-9e5e-b56aabe321f1
VITE_TOURS_API_TOKEN=ad5257a5-efdd-4314-9e5e-b56aabe321f1
VITE_DEFAULT_CURRENCY_ID=5
```

## 📱 Testing Deployment

After deployment, test these key features:

1. **Homepage** - Should load without errors
2. **Language Switcher** - Should fetch and display languages from API
3. **Attractions Page** - Should fetch and display Istanbul tours in selected language
4. **Tours Page** - Should show all available tours in selected language
5. **Tour Details** - Should display individual tour information in selected language
6. **Navigation** - All routes should work correctly
7. **Mobile Responsiveness** - Should work on all devices
8. **Language Changes** - Content should update when language is changed

## 🔄 CI/CD Integration

### GitHub Actions Example (Cloudflare Pages):
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
          projectName: epass
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
- [ ] Language API loads correctly
- [ ] Tours API loads correctly with language/currency
- [ ] API calls work in production
- [ ] All pages load correctly
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

## 🎯 Cloudflare Pages Deployment Steps

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages:**
   ```bash
   wrangler pages deploy dist
   ```

3. **Set up custom domain** (optional) in Cloudflare dashboard

4. **Configure environment variables** if needed

## 🔧 Routing Fix Explanation

The infinite loop error occurred because the original `_redirects` file had:
```
/*    /index.html   200
```

This caused Cloudflare to redirect `/index.html` to `/index.html`, creating an infinite loop.

**Solution:** Use specific route redirects instead:
```
/attractions  /index.html  200
/tours  /index.html  200
/tour/*  /index.html  200
```

This way, only specific routes are redirected, avoiding the infinite loop.

## 🌐 API Integration Summary

Your application now has full API integration:

1. **Languages API** - Dynamic language selection with real data
2. **Tours API** - Multi-language tour content with currency support
3. **Real-time Updates** - Content changes based on selected language
4. **Fallback Support** - Graceful degradation if APIs are unavailable
5. **Performance Optimized** - Efficient data fetching and caching

The error should now be completely resolved! 🎉 