# 📁 Public Folder Backup Documentation

## ⚠️ IMPORTANT: DO NOT OVERWRITE THIS FOLDER

The `/public` folder contains your PWA (Progressive Web App) assets that are **manually created** and **deployed directly to Netlify**. These files should NOT be committed to Git or overwritten.

---

## 📂 Current Public Folder Contents

```
public/
├── icon-192.png          # PWA icon (192x192)
├── icon-512.png          # PWA icon (512x512)
├── manifest.json         # PWA manifest file
├── pwa-test.html         # Testing page for PWA
└── sw.js                 # Service Worker
```

---

## 🔒 Why This Folder is Protected

1. **Icons are manually created** from your Figma design
2. **Service worker is custom configured** for offline support
3. **Manifest is tuned** for iOS/Android PWA installation
4. **These files live on Netlify**, not in your codebase

---

## 📋 File Details

### icon-192.png
- **Size:** 192×192 pixels
- **Format:** PNG with transparency
- **Purpose:** PWA install icon, Android home screen
- **Created from:** Your Hooky Golf logo design

### icon-512.png
- **Size:** 512×512 pixels
- **Format:** PNG with transparency
- **Purpose:** High-res PWA icon, iOS splash screen
- **Created from:** Your Hooky Golf logo design

### manifest.json
```json
{
  "name": "Hooky Golf",
  "short_name": "Hooky Golf",
  "description": "Corporate satire golf game - sneak past bosses!",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#cee7bd",
  "theme_color": "#517b34",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### sw.js (Service Worker)
- **Purpose:** Offline support, caching, PWA functionality
- **Custom configured** for your app's asset paths
- **Critical for iOS standalone mode**

### pwa-test.html
- **Purpose:** Testing PWA installation locally
- **Not needed in production** but helpful for debugging

---

## 🚀 Deployment Workflow

### When Pushing Code Updates:

1. ✅ **Git ignores `/public` folder** (already in `.gitignore`)
2. ✅ **Push all other code changes** normally
3. ✅ **Netlify preserves `/public` folder** from previous deploy
4. ✅ **Your PWA icons stay intact!**

### If You Need to Update Icons:

1. Create new icons (512×512 and 192×192)
2. Upload directly to Netlify via Dashboard:
   - Go to Netlify Dashboard
   - Click "Deploys" → "Deploy Settings" → "Asset Optimization"
   - Or use Netlify CLI: `netlify deploy --dir=public --prod`
3. **OR** temporarily remove `/public` from `.gitignore`, commit, then re-add

---

## 🔧 Recovery Instructions

### If You Accidentally Delete Public Folder:

**You'll need to recreate these files:**

1. **Icons:** Export from Figma at 192×192 and 512×512
2. **Manifest:** Copy the JSON above
3. **Service Worker:** Copy from `/PWA_SETUP.md` guide
4. **Upload to Netlify** using one of these methods:
   - Netlify Dashboard → Deploys → Drag & Drop
   - Netlify CLI: `netlify deploy`
   - Temporarily commit to Git

---

## 📝 Quick Commands

### Check if public folder is ignored:
```bash
git check-ignore public/
# Should output: public/
```

### View what files Git will commit:
```bash
git status
# Should NOT show public/ folder
```

### Force add public folder (if you need to update icons):
```bash
# Temporarily remove from .gitignore
git add public/icon-192.png public/icon-512.png
git commit -m "Update PWA icons"
# Re-add to .gitignore after
```

---

## ✅ Verification Checklist

Before pushing code, verify:

- [ ] `/public` is in `.gitignore`
- [ ] `git status` doesn't show `public/` folder
- [ ] PWA icons exist on Netlify at:
  - `https://your-site.netlify.app/icon-192.png`
  - `https://your-site.netlify.app/icon-512.png`
- [ ] Manifest exists at: `https://your-site.netlify.app/manifest.json`

---

## 🆘 Emergency Contact Info

**If icons are missing after deploy:**

1. Check Netlify deploy log for errors
2. Manually upload icons via Netlify Dashboard
3. Or use this one-liner to redeploy public folder:
   ```bash
   netlify deploy --dir=public --prod
   ```

---

## 📚 Related Documentation

- `/PWA_SETUP.md` - Full PWA setup guide
- `/DEPLOY_WITH_ICONS.md` - Icon deployment instructions
- `/COMPLETE_ICON_GUIDE.md` - Comprehensive icon guide
- `/.gitignore` - Git ignore configuration

---

**Last Updated:** January 2025  
**Status:** ✅ Public folder protected and backed up
