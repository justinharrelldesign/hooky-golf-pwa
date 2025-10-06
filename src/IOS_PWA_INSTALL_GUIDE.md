# 📱 iOS PWA Installation Guide - Hooky Golf

## ⚠️ CRITICAL: Complete Reinstallation Required

If you previously installed Hooky Golf and still see the Safari URL bar, you **MUST** follow these steps exactly:

---

## 🗑️ Step 1: Delete Old App (REQUIRED)

1. **Long press** the Hooky Golf icon on your home screen
2. Tap **"Remove App"**
3. Tap **"Delete App"**
4. Confirm deletion

> ⚠️ This is critical - iOS caches the old manifest and won't update without deletion

---

## 🧹 Step 2: Clear Safari Cache (RECOMMENDED)

### Option A: Clear Website Data Only
1. Open **Settings** app
2. Scroll to **Safari**
3. Scroll down to **Advanced**
4. Tap **Website Data**
5. Search for your Netlify domain
6. Swipe left → **Delete**

### Option B: Clear All Safari Data (Nuclear Option)
1. Open **Settings** app
2. Scroll to **Safari**
3. Scroll down to **"Clear History and Website Data"**
4. Tap and confirm

> ⚠️ Option B will log you out of all websites in Safari

---

## 🚀 Step 3: Deploy Latest Changes

```bash
git add .
git commit -m "iOS PWA standalone mode fixes - v7"
git push origin main
```

**Wait 2-5 minutes** for Netlify to deploy.

Check deployment status at: https://app.netlify.com/sites/YOUR_SITE/deploys

---

## 📲 Step 4: Reinstall the App

1. **Open Safari** (must use Safari, not Chrome!)
2. Navigate to your Netlify URL
3. Wait for page to fully load
4. Tap the **Share button** (square with arrow pointing up)
5. Scroll down and tap **"Add to Home Screen"**
6. Tap **"Add"** (top right)

---

## ✅ Step 5: Launch and Verify

1. **Close Safari completely** (swipe up from bottom)
2. Go to your home screen
3. Tap the **Hooky Golf icon**

### Expected Behavior:
✅ **NO Safari URL bar**  
✅ **NO browser controls**  
✅ **Fullscreen app experience**  
✅ **Status bar shows time/battery only**  

### If You Still See URL Bar:
❌ You're still in Safari browser mode

---

## 🔍 Troubleshooting

### Problem: Still seeing URL bar after reinstall

**Solution 1: Hard Refresh in Safari**
1. Before installing, open the site in Safari
2. Tap and hold the **Refresh button** (🔄)
3. Select **"Request Desktop Website"**
4. Wait 2 seconds
5. Tap refresh again and select **"Request Mobile Website"**
6. Now try installing again

**Solution 2: Check you're launching from home screen**
- Make sure you're tapping the app icon on home screen
- NOT opening Safari and navigating to the site
- NOT using a bookmark

**Solution 3: Restart your iPhone**
1. Power off iPhone completely
2. Wait 10 seconds
3. Power back on
4. Try launching the app again

**Solution 4: Verify manifest is loading**
1. In Safari, visit your Netlify URL
2. Open Developer Console (if enabled)
3. Check Network tab for `manifest.json`
4. Should return 200 status

---

## 🧪 Testing Standalone Mode

When the app launches, you should see an **orange banner at the top** that says:
> ⚠️ Not in Standalone Mode

**If you see this banner:**
- You're NOT in standalone mode
- The app is running in Safari browser
- Follow the reinstall steps above

**If you DON'T see this banner:**
- ✅ You're in standalone mode!
- The app is working correctly
- No URL bar should be visible

---

## 📋 Quick Checklist

Before installing:
- [ ] Deleted old app from home screen
- [ ] Cleared Safari cache (optional but recommended)
- [ ] Latest code deployed to Netlify (v7)
- [ ] Using Safari browser (NOT Chrome)
- [ ] Page fully loaded before installing

After installing:
- [ ] Closed Safari completely
- [ ] Launched from home screen icon (NOT Safari)
- [ ] No orange warning banner visible
- [ ] No URL bar visible
- [ ] Fullscreen experience

---

## 🛠️ Technical Details

### What Changed in v7:

**manifest.json:**
- Changed `id` to `"/?source=pwa"` for better iOS detection
- Added `display_override: ["standalone", "fullscreen"]`
- Merged icon purposes to `"any maskable"`
- Added `dir` and `lang` attributes

**index.html:**
- Added `minimal-ui` to viewport meta tag
- Added `msapplication-TileColor` meta tag
- Added `application-name` meta tag
- Status bar style: `black-translucent` (hides URL bar)

**Service Worker:**
- Updated cache version to `v7-ios-standalone-final`

### Why iOS is Difficult:

1. **Aggressive Caching**: iOS caches manifest.json and meta tags
2. **No Auto-Update**: Must delete and reinstall to get new config
3. **Safari Only**: Only Safari can install PWAs on iOS
4. **Status Bar Tricks**: `black-translucent` is the magic value
5. **Scope Issues**: Any navigation outside scope shows URL bar

---

## 📱 iOS Version Compatibility

| iOS Version | Standalone Support | Notes |
|-------------|-------------------|-------|
| iOS 11.3+ | ✅ Yes | First PWA support |
| iOS 12+ | ✅ Yes | Improved support |
| iOS 13+ | ✅ Yes | Better icons |
| iOS 14+ | ✅ Yes | Enhanced features |
| iOS 15+ | ✅ Yes | Recommended |
| iOS 16+ | ✅ Yes | Best experience |
| iOS 17+ | ✅ Yes | Current |

---

## 🎯 Success Criteria

Your PWA is installed correctly when:

1. ✅ No Safari URL bar visible
2. ✅ No browser navigation controls
3. ✅ App fills entire screen
4. ✅ Status bar only shows time/battery/signal
5. ✅ No orange warning banner
6. ✅ App behaves like a native app
7. ✅ Tapping links stays in the app
8. ✅ No external browser opens

---

## 💡 Pro Tips

1. **Keep Safari closed** when launching the app
2. **Always launch from home screen icon** (not bookmarks)
3. **Don't use "Open in Safari"** links within the app
4. **Test on WiFi first** (faster loading)
5. **Update iOS** to latest version for best support

---

## 🆘 Still Having Issues?

If you've followed all steps and still see the URL bar:

1. **Check iOS version**: Settings → General → About → Software Version
   - Should be iOS 13+ for best support

2. **Check Safari settings**: Settings → Safari
   - Ensure JavaScript is enabled
   - Ensure "Fraudulent Website Warning" is not blocking

3. **Try a different network**:
   - Switch from WiFi to cellular or vice versa
   - Some networks block PWA features

4. **Factory reset (last resort)**:
   - Backup your iPhone
   - Reset all settings (keeps data)
   - Try installing again

---

## 📞 Contact

If none of these solutions work, the issue may be:
- iOS bug (rare but happens)
- Netlify configuration issue
- DNS/HTTPS problem
- iOS version incompatibility

Check the browser console for errors and share them for debugging.

---

## ✨ Expected User Experience

Once properly installed, users should:
- Launch app from home screen → instant fullscreen
- Never see Safari browser UI
- Get native app-like experience
- See smooth animations and transitions
- Have offline support (service worker)
- Get install prompt on first visit (if not installed)

---

**Last Updated**: iOS PWA Fix v7 - Final Standalone Mode Implementation

**Cache Version**: `hooky-golf-v7-ios-standalone-final`

**Manifest ID**: `/?source=pwa`
