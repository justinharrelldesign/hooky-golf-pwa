# Hooky Golf - Progressive Web App Setup

Your Hooky Golf game is now configured as a **Progressive Web App (PWA)**! This means users can install it on their devices and use it like a native mobile app.

## ✅ What's Been Set Up

### PWA Configuration Files
- **`/public/manifest.json`** - App manifest with metadata, theme colors, and icon references
- **`/public/sw.js`** - Service Worker for offline functionality and caching
- **`/components/InstallPrompt.tsx`** - Custom install prompt component
- **Updated `/index.html`** - Added PWA meta tags and manifest link
- **Updated `/src/main.tsx`** - Registers the service worker on app load
- **Updated `/App.tsx`** - Added InstallPrompt component

### Features Enabled
✅ Installable on iOS and Android devices  
✅ Standalone app mode (no browser UI)  
✅ Custom theme colors (green #517b34)  
✅ Offline capability with service worker caching  
✅ Custom install prompt for users  
✅ Portrait orientation lock  
✅ Splash screen support  

---

## 🎨 IMPORTANT: Create Your App Icons

You need to create actual app icons to replace the placeholders:

### Required Icons
1. **icon-192.png** (192x192px) - For Android home screen
2. **icon-512.png** (512x512px) - For splash screens and app stores

### Design Recommendations
- Use your brand colors: Green (#517b34) and light green (#cee7bd)
- Golf-themed design (golf flag, golf ball, or club)
- Keep it simple and recognizable at small sizes
- Make sure it looks good on both light and dark backgrounds

### Tools to Create Icons
- [Figma](https://figma.com) - Design your icon
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Generate all sizes
- [PWA Builder](https://www.pwabuilder.com/imageGenerator) - PWA icon generator
- [Canva](https://canva.com) - Quick icon design

### How to Add Icons
1. Create/export your icons as PNG files (192x192 and 512x512)
2. Replace `/public/icon-192.png` and `/public/icon-512.png`
3. Optionally, create additional sizes for better iOS support

---

## 📱 Testing Your PWA

### On Desktop (Chrome/Edge)
1. Run `npm run dev` or `npm run build && npm run preview`
2. Open in Chrome/Edge
3. Look for install icon in address bar (⊕ or computer icon)
4. Click to install

### On Android
1. Deploy to a hosting service (Netlify, Vercel, etc.)
2. Open the URL in Chrome on Android
3. Tap the "Add to Home Screen" prompt or:
   - Tap menu (⋮) → "Install app" or "Add to Home Screen"
4. App icon will appear on home screen

### On iOS (iPhone/iPad)
1. Deploy to a hosting service
2. Open the URL in Safari (must be Safari, not Chrome)
3. Tap the Share button (square with arrow)
4. Scroll down and tap "Add to Home Screen"
5. Customize name if desired, tap "Add"
6. App icon will appear on home screen

---

## 🚀 Deployment

Your PWA needs to be served over HTTPS to work properly. Here are easy deployment options:

### Option 1: Netlify (Recommended - Already Configured)
```bash
# Your netlify.toml is already set up
# Just connect your repo to Netlify and deploy
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel
```

### Option 3: GitHub Pages
```bash
# Add to package.json scripts:
"deploy": "npm run build && npx gh-pages -d dist"

# Then run:
npm run deploy
```

---

## 🔧 Customization

### Update App Colors
Edit `/public/manifest.json`:
```json
{
  "theme_color": "#517b34",  // Status bar color
  "background_color": "#cee7bd"  // Splash screen background
}
```

### Update App Name
Edit `/public/manifest.json`:
```json
{
  "name": "Hooky Golf",  // Full name
  "short_name": "Hooky Golf"  // Name on home screen
}
```

### Customize Service Worker Caching
Edit `/public/sw.js` to add/remove cached assets or change caching strategy.

---

## 📊 PWA Checklist

Before launching, verify your PWA with these tools:

### Lighthouse Audit
1. Open your deployed app in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "Progressive Web App" category
5. Click "Analyze page load"
6. Aim for 90+ score

### PWA Testing Tools
- [PWA Builder](https://www.pwabuilder.com/) - Test and package your PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool
- Chrome DevTools → Application tab → Manifest & Service Workers

---

## 🐛 Troubleshooting

### Service Worker Not Updating
```javascript
// Force update by incrementing cache version in sw.js
const CACHE_NAME = 'hooky-golf-v2'; // Increment v1 → v2
```

### Install Prompt Not Showing
- Must be served over HTTPS (or localhost)
- User must visit site at least once
- Chrome requires 30-second engagement before showing prompt
- Some browsers (Safari) don't support custom install prompts

### App Not Working Offline
- Check that service worker is registered (DevTools → Application → Service Workers)
- Verify important assets are cached in sw.js
- Test by going offline in DevTools (Network tab → Offline checkbox)

---

## 🎉 What Users Will Experience

1. **First Visit**: User sees your web app with optional install prompt
2. **Installation**: User clicks install → app added to home screen
3. **App Launch**: Opens in standalone mode (no browser chrome)
4. **Offline**: Can still use core features even without internet
5. **Updates**: Automatic updates when you deploy new versions

---

## 📱 Next Steps for Native App Stores

If you want to publish to iOS App Store or Google Play Store:

### Option 1: Capacitor (Recommended)
Wrap your PWA as a native app:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

### Option 2: PWA Builder
1. Go to [PWABuilder.com](https://www.pwabuilder.com/)
2. Enter your deployed PWA URL
3. Download app packages for iOS and Android
4. Submit to app stores

---

## 🔒 Important Notes

- **HTTPS Required**: PWAs require HTTPS (except localhost for testing)
- **Icons Matter**: Good icons make your app look professional
- **Test on Real Devices**: Always test on actual iOS and Android devices
- **Service Worker Updates**: Users may need to close and reopen app to get updates

---

## 📚 Learn More

- [Google PWA Documentation](https://web.dev/progressive-web-apps/)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Apple iOS PWA Support](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

**Your Hooky Golf PWA is ready! 🎉⛳**

Just create your app icons and deploy to start getting users!