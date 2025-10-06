# 🎯 PWA Icon Mapping - Hooky Golf

## Figma Assets to Icon Sizes

You've provided **6 Figma icon assets**. Here's the complete mapping:

### 📦 Asset Inventory

| Figma Asset ID | Recommended Size | Purpose |
|----------------|------------------|---------|
| `63b8f19bf350a73191104baad981fcbdf439cbda.png` | 120×120 or 152×152 | Small iOS icons |
| `83f3026cb6fc6961d7002cc9205423d2e14dedd4.png` | 192×192 | Android standard |
| `fb3f244cd19c0832438b5ccdbec8ca1fed14eb45.png` | 512×512 | Large/maskable |
| `794c0aa997366cb162d2a499bf728514939c0ac3.png` | 512×512 | Large/maskable (alternate) |
| `8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png` | 120×120 or 152×152 | Small iOS icons |
| `9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png` | 180×180 | Apple Touch Icon |

---

## 🚀 Deployment Instructions

### Step 1: Export Icons from Figma

Export each asset at the **exact pixel dimensions** listed below:

#### Required Exports:

1. **icon-120.png** (120×120px)
   - Use asset: `8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png`
   - Purpose: Older iPhone models

2. **icon-152.png** (152×152px)
   - Use asset: `8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png`
   - Purpose: iPad

3. **apple-touch-icon.png** (180×180px)
   - Use asset: `9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png`
   - Purpose: **PRIMARY iOS icon** (most important!)

4. **icon-192.png** (192×192px)
   - Use asset: `83f3026cb6fc6961d7002cc9205423d2e14dedd4.png`
   - Purpose: Android standard icon

5. **icon-512.png** (512×512px)
   - Use asset: `794c0aa997366cb162d2a499bf728514939c0ac3.png`
   - Purpose: Android maskable & splash screens

---

### Step 2: Save to `/public` Directory

Place all 5 exported PNG files in:
```
/public/
  ├── icon-120.png       ✅
  ├── icon-152.png       ✅
  ├── apple-touch-icon.png  ✅ (MOST IMPORTANT for iOS)
  ├── icon-192.png       ✅
  └── icon-512.png       ✅
```

---

### Step 3: Verify Export Quality

Before deploying, check each file:
- ✅ Correct pixel dimensions (use image preview to verify)
- ✅ PNG format
- ✅ Light green background (`#cee7bd`)
- ✅ Character clearly visible
- ✅ "HOOKY GOLF" text readable
- ✅ Adequate padding (especially for 192px and 512px)

---

### Step 4: Deploy

```bash
git add public/icon-*.png public/apple-touch-icon.png
git commit -m "Add PWA icons for all platforms"
git push
```

Netlify will automatically deploy the icons to your site root.

---

## 🧪 Testing Checklist

After deployment, test on actual devices:

### iOS (Safari)
1. ✅ Visit site in Safari
2. ✅ Tap Share → Add to Home Screen
3. ✅ Check icon appears correctly
4. ✅ Open app from home screen (standalone mode)
5. ✅ Verify icon looks sharp, not pixelated

### Android (Chrome)
1. ✅ Visit site in Chrome
2. ✅ Tap menu → Install app
3. ✅ Check icon appears correctly
4. ✅ Check icon shape (circle/squircle/rounded)
5. ✅ Open app from launcher

### Desktop (Chrome/Edge)
1. ✅ Visit site
2. ✅ Look for install icon in address bar
3. ✅ Click to install
4. ✅ Check app icon in taskbar/dock

---

## 🎨 Design Specs Summary

All icons should follow these specs:

- **Background**: `#cee7bd` (Hooky Golf light green)
- **Character**: Person with briefcase + golf club
- **Text**: "HOOKY GOLF" curved at top
- **Format**: PNG with transparency support
- **Padding**: 10-15% on all sides (for 192px and 512px maskable)
- **Safe Zone**: Keep important content in center 80% (for Android adaptive icons)

---

## ⚙️ Current Configuration Status

✅ **Code Configuration**: Complete
- `/public/manifest.json` - Updated with all icon sizes
- `/index.html` - Apple touch icon meta tags added
- `/components/AppIcons.tsx` - Figma assets imported

🔲 **Icon Files**: Pending export to `/public`

**Next Action**: Export the 5 PNG files and place in `/public` directory

---

## 🔍 Quick Asset Reference

Need to quickly identify which asset to use?

| Need | Use This Asset |
|------|---------------|
| Small iOS icons | `8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png` |
| Primary iOS icon | `9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png` ⭐ |
| Android standard | `83f3026cb6fc6961d7002cc9205423d2e14dedd4.png` |
| Android large/maskable | `794c0aa997366cb162d2a499bf728514939c0ac3.png` |

---

## 📱 Platform Priority

If you can only test on one platform first:

**Priority Order:**
1. 🥇 **iOS Safari** (most users) - Check `apple-touch-icon.png` (180×180)
2. 🥈 **Android Chrome** - Check `icon-192.png` and `icon-512.png`
3. 🥉 **Desktop** - Check `icon-192.png`

---

## 💡 Pro Tips

1. **iOS is Strict**: The `apple-touch-icon.png` (180×180) is critical. iOS won't fall back gracefully if it's missing.

2. **Android is Flexible**: Android will scale icons if needed, but native sizes look best.

3. **Test on Real Devices**: Simulators don't always show the true install experience.

4. **Cache Busting**: If icons don't update, test in Incognito/Private mode or clear cache.

5. **PWA Takes Time**: After deployment, wait 5 minutes for CDN propagation before testing.

---

## 🎉 Success Metrics

You'll know it's working when:
- ✅ Icon appears on home screen after install
- ✅ Icon is sharp and clear (not blurry)
- ✅ App opens in standalone mode (no browser UI)
- ✅ Icon matches your brand (light green background)
- ✅ Character and text are clearly visible

Your PWA will look professional and native on all platforms! 🏌️‍♂️
