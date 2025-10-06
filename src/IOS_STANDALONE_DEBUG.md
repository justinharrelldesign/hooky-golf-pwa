# 🔍 iOS Standalone Mode Debugging

## You're Seeing the Orange Banner? Here's Why:

The orange banner appears when iOS detects you're **NOT** in standalone mode. This means you're running in Safari browser instead of as a PWA app.

---

## ✅ Step-by-Step Verification

### 1. Have You Deployed to Netlify?

**CRITICAL**: The PWA fixes only work on your **deployed Netlify site**, NOT on localhost!

```bash
# Check if you've committed and pushed:
git status

# If you have uncommitted changes:
git add .
git commit -m "iOS PWA standalone mode fixes"
git push origin main

# Wait 2-5 minutes for Netlify to deploy
# Check: https://app.netlify.com/sites/YOUR_SITE/deploys
```

**If you're testing on localhost (`localhost:5173`), PWA features won't work!**

---

### 2. Are You Using the Netlify URL?

✅ **CORRECT**: `https://your-site.netlify.app`  
❌ **WRONG**: `http://localhost:5173`  
❌ **WRONG**: `http://192.168.x.x:5173`  

**iOS PWA features ONLY work on HTTPS production URLs!**

---

### 3. Installation Checklist

Once deployed to Netlify, follow these steps ON YOUR IPHONE:

#### A. Delete Old App
- [ ] Long press Hooky Golf icon on home screen
- [ ] Tap "Remove App" → "Delete App"
- [ ] Confirm deletion

#### B. Clear Safari Cache
- [ ] Settings → Safari
- [ ] "Clear History and Website Data"
- [ ] Confirm

#### C. Restart iPhone (Important!)
- [ ] Power off completely
- [ ] Wait 10 seconds
- [ ] Power back on

#### D. Install Fresh
- [ ] Open **Safari** (not Chrome!)
- [ ] Go to `https://your-site.netlify.app`
- [ ] Wait for page to fully load (30+ seconds)
- [ ] Tap Share button (square with arrow)
- [ ] "Add to Home Screen" → "Add"

#### E. Launch Correctly
- [ ] **Close Safari completely** (swipe up to close)
- [ ] Go to home screen
- [ ] **Tap the Hooky Golf icon** (NOT Safari!)

---

## 🔍 Using the Debug Info

When you see the orange banner, **tap "Debug Info"** to expand it. Here's what to check:

### Good Signs (Standalone Mode Working):
```
Display Mode: standalone
Nav Standalone: true
```

### Bad Signs (Browser Mode):
```
Display Mode: browser
Nav Standalone: false or undefined
```

### Common Issues:

**1. Display Mode shows "browser"**
→ You're launching from Safari, not the home screen icon
→ Solution: Close Safari, tap home screen icon

**2. Warning says "Running locally"**
→ You're on localhost, not Netlify
→ Solution: Deploy to Netlify first!

**3. Nav Standalone shows "undefined"**
→ Manifest not loaded or iOS version too old
→ Solution: Check iOS version (need 13+), reinstall app

---

## 🚨 Most Common Mistake

**Opening the app the WRONG way:**

❌ **WRONG**: 
- Opening Safari
- Typing the URL
- Using a bookmark
- Tapping a link from another app

✅ **CORRECT**: 
- Tapping the app icon on your home screen
- The icon you added via "Add to Home Screen"

**You MUST launch from the home screen icon for standalone mode!**

---

## 📱 Quick Test

After installing, do this test:

1. Launch the app from home screen icon
2. Look at the orange banner
3. Tap "Debug Info"

**If you see:**
- `Display Mode: browser` → You're in Safari (wrong!)
- `Display Mode: standalone` → You're in PWA mode (correct!)

**If still showing "browser" after launching from home screen:**
1. The manifest didn't load correctly
2. You need to reinstall from Netlify URL
3. Or your iOS version doesn't support PWA

---

## 🛠️ Still Not Working?

### Check These:

**1. Are you on Netlify deployment?**
```
Open Safari → Visit your-site.netlify.app
NOT localhost!
```

**2. Is HTTPS working?**
```
URL should start with https:// (lock icon)
If not, check Netlify settings
```

**3. Does manifest.json load?**
```
Visit: https://your-site.netlify.app/manifest.json
Should show JSON with "display": "standalone"
```

**4. Are meta tags present?**
```
In Safari, view page source
Look for: apple-mobile-web-app-capable
Look for: apple-mobile-web-app-status-bar-style
```

**5. iOS version check:**
```
Settings → General → About → Software Version
Need iOS 13+ (iOS 15+ recommended)
```

---

## 🎯 Expected Behavior

### When Working Correctly:

**Launch from home screen:**
1. ✅ App opens instantly
2. ✅ NO Safari URL bar
3. ✅ NO browser controls
4. ✅ NO orange banner
5. ✅ Full screen experience

**Debug info should show:**
```
Display Mode: standalone
Nav Standalone: true
Viewport: 430x932 (or your screen size)
```

---

## 💡 Pro Tips

1. **Always test on deployed site**, never localhost
2. **Always close Safari** before launching from home screen
3. **Always delete old app** before reinstalling
4. **Restart iPhone** if still having issues
5. **Wait 30+ seconds** for full page load before installing

---

## 🆘 Emergency Checklist

If nothing works, try this nuclear option:

```
1. ✓ Verify code is deployed to Netlify
2. ✓ Delete app from iPhone completely
3. ✓ Settings → Safari → Clear All
4. ✓ Restart iPhone (power off/on)
5. ✓ Open Safari (not Chrome!)
6. ✓ Visit https://your-site.netlify.app
7. ✓ Wait 60 seconds for full load
8. ✓ Hard refresh: tap address bar, then tap refresh
9. ✓ Wait another 30 seconds
10. ✓ Share → Add to Home Screen → Add
11. ✓ Close Safari completely
12. ✓ Wait 10 seconds
13. ✓ Tap home screen icon
14. ✓ Check if orange banner is gone
```

---

## 📊 Understanding the Banner

The orange banner is a **diagnostic tool** to help you:

- **Banner visible** = Running in Safari browser (wrong)
- **Banner hidden** = Running in standalone PWA mode (correct)

**The banner itself isn't the problem** - it's telling you that you're not in standalone mode yet!

---

## 🎓 Technical Explanation

iOS has two ways to detect standalone mode:

1. **CSS Media Query**: `(display-mode: standalone)`
   - Modern method
   - Works on iOS 11.3+

2. **Navigator API**: `window.navigator.standalone`
   - Legacy iOS method
   - More reliable on older iOS versions

The app checks BOTH methods. If either returns true, standalone mode is active.

**The banner only appears when BOTH return false**, meaning iOS is 100% certain you're in browser mode.

---

## 📞 Still Stuck?

1. Check the debug info panel in the banner
2. Screenshot the debug info
3. Check if you're on localhost or Netlify
4. Verify iOS version is 13+
5. Try the nuclear checklist above

**Most issues are solved by:**
- Deploying to Netlify (not localhost)
- Launching from home screen icon (not Safari)
- Deleting old app before reinstalling

---

**Last Updated**: iOS PWA Standalone Mode Debugging v2  
**Cache Version**: v7-ios-standalone-final
