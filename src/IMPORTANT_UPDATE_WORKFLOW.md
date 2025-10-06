# ⚠️ IMPORTANT: Code Update Workflow

## Before Downloading Fresh Code from Figma Make

Your `/public` folder contains **5 manually added PNG files** that Figma Make cannot export:
- ✅ apple-touch-icon.png (180×180)
- ✅ icon-120.png (120×120)
- ✅ icon-152.png (152×152)
- ✅ icon-192.png (192×192)
- ✅ icon-512.png (512×512)

**These files MUST be preserved when updating code!**

---

## Safe Update Process

### Method 1: Selective File Copy (Recommended)
1. Download new Figma Make code to a **temporary location** (e.g., `~/Downloads/HookyGolf-TEMP`)
2. **DON'T** overwrite your entire project
3. Manually copy ONLY the files that changed:
   ```bash
   # Example - only copy specific updated files:
   cp ~/Downloads/HookyGolf-TEMP/App.tsx ./App.tsx
   cp ~/Downloads/HookyGolf-TEMP/components/NewComponent.tsx ./components/
   ```
4. Your `/public` folder stays untouched ✅
5. Commit and push as normal

### Method 2: Backup & Restore
```bash
# 1. Backup public folder FIRST
cp -r public/ public-backup/

# 2. Download and extract new code (can overwrite)

# 3. Restore the complete public folder
rm -rf public/
mv public-backup/ public/

# 4. Verify all 5 PNGs are present
ls -lh public/*.png

# 5. Commit and push
git add -A
git commit -m "Update from Figma Make (preserved PWA icons)"
git push
```

---

## 🔍 Verify After Every Update

Always check that all 5 PNG files are present:
```bash
ls -lh public/

# You should see:
# apple-touch-icon.png
# icon-120.png
# icon-152.png
# icon-192.png
# icon-512.png
# manifest.json
# sw.js
```

---

## 🚨 If You Accidentally Delete the PNGs

If you accidentally overwrite and push without the PNG files:

1. **Don't panic!** Git has history
2. Restore from previous commit:
   ```bash
   git checkout HEAD~1 -- public/
   git add public/
   git commit -m "Restore PWA icon files"
   git push
   ```

Or re-export the 3 missing PNG files from your Figma design and add them back to `/public/`.

---

## 📋 Quick Checklist

Before every code update from Figma Make:

- [ ] Know exactly which files changed
- [ ] Backup `/public` folder OR use selective file copy
- [ ] After update, verify all 5 PNG files exist
- [ ] Test PWA install still works
- [ ] Commit and push

**Remember: Figma Make exports CODE, not IMAGES. Your PNG files must be manually preserved!**
