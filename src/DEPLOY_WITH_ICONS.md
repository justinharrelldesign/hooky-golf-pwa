# 🚀 Hooky Golf Deployment Guide with PWA Icons

## One-Time Icon Setup (Do This Once)

### Step 1: Export Icons from Figma

Export these 5 PNG files from your Figma assets:

| Filename | Size | Source Asset (last 6 chars) |
|----------|------|----------------------------|
| `icon-120.png` | 120×120 | `...460f08.png` |
| `icon-152.png` | 152×152 | `...c6641.png` |
| `apple-touch-icon.png` | 180×180 | `...a6222b9.png` |
| `icon-192.png` | 192×192 | `...dedd4.png` |
| `icon-512.png` | 512×512 | `...939c0ac3.png` |

**Full asset IDs** (for reference):
- 120px: `8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png`
- 152px: `e54075820b77aabd7ca46d8900b4e990627c6641.png`
- 180px: `9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png`
- 192px: `83f3026cb6fc6961d7002cc9205423d2e14dedd4.png`
- 512px: `794c0aa997366cb162d2a499bf728514939c0ac3.png`

### Step 2: Add to Your Git Repository

```bash
# In your local Hooky Golf repository:

# 1. Place all 5 PNG files in the /public folder
cp /path/to/exports/icon-120.png ./public/
cp /path/to/exports/icon-152.png ./public/
cp /path/to/exports/apple-touch-icon.png ./public/
cp /path/to/exports/icon-192.png ./public/
cp /path/to/exports/icon-512.png ./public/

# 2. Verify files are in place
ls -lh public/*.png

# 3. Add to git (ONE-TIME ONLY)
git add public/icon-*.png public/apple-touch-icon.png
git commit -m "Add PWA icons for iOS and Android installation"
git push origin main
```

### Step 3: Verify on Netlify

After deployment, test the icons:
- Visit your Netlify URL
- Try installing as PWA on iOS (Safari → Share → Add to Home Screen)
- Try installing as PWA on Android (Chrome → Menu → Install app)

---

## ✅ Icons Are Now Permanent!

**Important:** Once you've committed the PNG files to git, they are **permanent** in your repository.

### Future Workflow (No Re-Export Needed)

When you make changes in Figma Make:

```bash
# 1. Download updated code from Figma Make
# 2. Copy/merge new code into your git repo
#    (Icons in /public stay untouched)
# 3. Commit and push
git add .
git commit -m "Update game features"
git push origin main
```

**The PNG files persist automatically because they're in git!**

---

## 🔄 When to Re-Export Icons

Only re-export the PNG files if:
- ❌ You redesign the app icon in Figma
- ❌ You change the logo/branding
- ❌ Icons appear blurry or incorrect

Otherwise:
- ✅ Icons stay in your git repository forever
- ✅ No need to re-export with each code update
- ✅ One-time setup is complete

---

## 📁 Current /public Folder Structure

After setup, your `/public` folder should contain:

```
/public/
  ├── icon-120.png              ✅ (120×120) - iPhone
  ├── icon-152.png              ✅ (152×152) - iPad  
  ├── apple-touch-icon.png      ✅ (180×180) - iOS Primary ⭐
  ├── icon-192.png              ✅ (192×192) - Android
  ├── icon-512.png              ✅ (512×512) - Android Maskable
  ├── manifest.json             ✅ (already exists)
  └── sw.js                     ✅ (already exists)
```

---

## 🎯 Verification Checklist

Before deploying, verify:

- [ ] All 5 PNG files are in `/public` folder
- [ ] File sizes are correct (check with `ls -lh public/*.png`)
- [ ] Files are committed to git (`git status` shows nothing)
- [ ] `manifest.json` references all icons (already configured ✅)
- [ ] `index.html` has apple-touch-icon meta tag (already configured ✅)

---

## 🆘 Troubleshooting

### "Icons missing after code download"
- **Cause:** You downloaded code but didn't merge it properly
- **Fix:** Never delete your entire repository - always merge/copy new files
- **Best practice:** Use git to track changes

### "Icons not showing on iOS/Android"
- **Cause:** Files not in `/public` or wrong filenames
- **Fix:** Verify filenames match exactly (case-sensitive)
- **Check:** `ls public/apple-touch-icon.png` should show the file

### "Do I need to re-export every time?"
- **Answer:** No! Only once. Git keeps them forever.

---

## 🎉 You're Done!

Once you complete the one-time setup:
- ✅ Icons are permanent in your git repository
- ✅ Users can install your PWA on iOS and Android
- ✅ Beautiful branded icons appear on home screens
- ✅ No need to re-export unless you redesign the icon

**Deploy command:**
```bash
git push origin main
```

That's it! Netlify handles the rest automatically. 🚀
