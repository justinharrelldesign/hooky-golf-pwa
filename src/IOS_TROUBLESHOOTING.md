# 🔧 iOS PWA Troubleshooting Guide

## 🚨 STILL SEEING URL BAR? Read This First

If you've followed all installation steps and **STILL see the Safari URL bar**, here's what to check:

---

## ✅ Pre-Flight Checklist

Before you panic, verify these basics:

### 1. Are you actually launching from the HOME SCREEN?
- ❌ **WRONG**: Opening Safari and typing the URL
- ❌ **WRONG**: Using a Safari bookmark
- ❌ **WRONG**: Tapping a link from another app
- ✅ **CORRECT**: Tapping the app icon on your iPhone home screen

### 2. Did you FULLY delete the old app?
- Not just removing from home screen
- Must tap "Delete App" to clear all cached data
- iOS caches the manifest - this is the #1 issue

### 3. Are you using SAFARI to install?
- Chrome on iOS **CANNOT** install PWAs
- Firefox on iOS **CANNOT** install PWAs
- Only Safari can install PWAs on iOS

---

## 🧪 Use the PWA Test Page

We've created a diagnostic page to check your installation:

1. **In Safari**, navigate to: `https://YOUR_NETLIFY_SITE.netlify.app/pwa-test.html`
2. **Add it to home screen**
3. **Launch from home screen**
4. Check the results:

### Expected Results (Standalone Mode Working):
```
✓ Standalone Mode: RUNNING IN STANDALONE
✓ Display Mode: standalone
✓ Navigator Standalone: YES
✓ Apple PWA Meta Tags: capable=yes, status-bar=black-translucent
```

### If You See Browser Mode:
```
✗ Standalone Mode: BROWSER MODE
✗ Display Mode: browser
✗ Navigator Standalone: NO or UNDEFINED
```

This means you're NOT in standalone mode. Continue troubleshooting below.

---

## 🔍 Common Issues & Solutions

### Issue 1: Orange Warning Banner Appears in App

**What it means:**
- App is running in browser mode, not standalone
- You're not launching from home screen icon
- OR the app wasn't installed correctly

**Solutions:**
1. Close Safari completely
2. Go to home screen
3. Tap the Hooky Golf icon (NOT Safari)
4. Banner should disappear

---

### Issue 2: URL Bar Still Visible After Reinstall

**Root Causes:**
1. **Old cache not cleared** → Clear Safari cache
2. **Not launched from home screen** → Use home screen icon
3. **Installed in wrong browser** → Must use Safari
4. **Manifest not loading** → Check network tab

**Step-by-Step Fix:**

**A. Nuclear Option - Fresh Start:**
```
1. Delete app from home screen (long press → Delete App)
2. Close Safari (swipe up to close)
3. Settings → Safari → Clear History and Website Data
4. Restart iPhone (power off, wait 10 sec, power on)
5. Open Safari
6. Visit your Netlify URL
7. Wait for full page load (30+ seconds)
8. Tap Share → Add to Home Screen → Add
9. Close Safari completely
10. Tap home screen icon
```

**B. Verify Manifest:**
```
1. In Safari, visit: YOUR_SITE/manifest.json
2. Should see JSON with "display": "standalone"
3. Check "id": "/?source=pwa"
4. Check "display_override": ["standalone", "fullscreen"]
```

**C. Check Meta Tags:**
```
1. In Safari, view page source
2. Look for: <meta name="apple-mobile-web-app-capable" content="yes">
3. Look for: <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
4. Both must be present
```

---

### Issue 3: Works in Simulator, Not on Real Device

**This is common and frustrating:**

- **iOS Simulator** often shows standalone mode even when real device doesn't
- **Always test on real hardware**
- Simulator is not reliable for PWA testing

**Solution:**
- Focus on real device testing only
- Don't trust simulator results

---

### Issue 4: Worked Once, Then Broke

**Possible causes:**
1. **App updated** → Must reinstall to get new manifest
2. **iOS updated** → Some iOS updates break PWAs
3. **Certificate changed** → HTTPS issues
4. **Redirected to different URL** → Breaks standalone scope

**Solution:**
1. Delete app
2. Clear Safari cache
3. Reinstall fresh
4. Check certificate is valid (lock icon in Safari)

---

### Issue 5: Inconsistent Behavior

**Sometimes works, sometimes doesn't:**

This usually means:
- **Cache issues** between old and new versions
- **Multiple apps installed** from different URLs
- **Offline cache** serving old manifest

**Solution:**
```bash
1. Delete ALL instances of app from home screen
2. Settings → Safari → Advanced → Website Data
3. Search for your domain
4. Delete ALL entries
5. Hard refresh: Safari → Visit site → Hold refresh button
6. Reinstall clean
```

---

## 🎯 The Definitive Test

**If you want to be 100% sure standalone mode is working:**

### Test A: Visual Check
Launch the app and look for:
- ✅ No address bar at top
- ✅ No navigation buttons (back/forward)
- ✅ No tab bar at bottom
- ✅ No "Done" button
- ✅ Status bar shows ONLY time/battery/signal
- ✅ App fills entire screen

### Test B: JavaScript Check
Open the test page and check:
```javascript
window.matchMedia('(display-mode: standalone)').matches === true
// AND
window.navigator.standalone === true
```

### Test C: Screenshot Test
Take a screenshot:
- Standalone mode: Screenshot has NO browser UI
- Browser mode: Screenshot shows Safari controls

---

## 📱 iOS Version-Specific Issues

### iOS 17+
- **Best PWA support**
- Should work perfectly with our config
- If not working, likely installation issue

### iOS 16
- **Good PWA support**
- `black-translucent` works well
- May need cache clear + reinstall

### iOS 15
- **Decent PWA support**
- Sometimes requires multiple reinstalls
- Try restarting device between attempts

### iOS 14 and below
- **Limited PWA support**
- May not fully support `display-mode: standalone`
- Consider upgrading iOS if possible

---

## 🔬 Advanced Debugging

### Enable Web Inspector

1. **On iPhone:**
   - Settings → Safari → Advanced
   - Enable "Web Inspector"

2. **On Mac:**
   - Connect iPhone via USB
   - Open Safari on Mac
   - Develop menu → [Your iPhone] → [Your Site]

3. **Check Console for:**
   - Service Worker registration errors
   - Manifest parsing errors
   - Network errors loading resources

### Common Console Errors:

```
❌ "Manifest: Line 1, column 1, Unexpected token"
→ Manifest JSON is malformed

❌ "Service worker registration failed"
→ HTTPS not configured properly

❌ "Manifest start_url not in scope"
→ start_url doesn't match scope

❌ "Icons must be at least 192x192"
→ Icon files missing or wrong size
```

---

## 🛑 When to Give Up on iOS PWA

Unfortunately, iOS PWA support has some known limitations:

### iOS Won't Support:
- ❌ Push notifications
- ❌ Background sync
- ❌ Advanced service worker features
- ❌ Some Web APIs that Android supports

### When Browser Mode is Actually OK:
- If you need features iOS PWAs don't support
- If users primarily use on desktop
- If the URL bar doesn't bother users

### Consider Native App If:
- Need push notifications (critical feature)
- Need background processing
- Need advanced device features
- Have budget for native development

---

## ✨ Confirmation of Success

**You've succeeded when:**

1. ✅ App launches from home screen with NO URL bar
2. ✅ Orange warning banner does NOT appear
3. ✅ PWA test page shows "RUNNING IN STANDALONE"
4. ✅ Screenshots show no browser UI
5. ✅ App behaves exactly like a native app
6. ✅ Navigation stays within the app
7. ✅ Status bar is translucent over app content
8. ✅ Safe area insets work (notch spacing)

---

## 📞 Still Stuck?

If you've tried EVERYTHING and it's still not working:

### Double-Check Your Code:

1. **manifest.json** at `/public/manifest.json`:
```json
{
  "display": "standalone",
  "display_override": ["standalone", "fullscreen"],
  "id": "/?source=pwa"
}
```

2. **index.html** meta tags:
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

3. **Service worker** registered in `/src/main.tsx`:
```javascript
navigator.serviceWorker.register('/sw.js')
```

4. **HTTPS enabled** on Netlify (automatic)

### Check Netlify:

1. Site settings → HTTPS → Force HTTPS enabled
2. Deploy log shows no errors
3. `manifest.json` accessible at your-site.netlify.app/manifest.json
4. Icons accessible at your-site.netlify.app/icon-192.png

### Environmental Issues:

1. **Corporate network** blocking PWA features?
2. **VPN** interfering with service worker?
3. **Parental controls** on device?
4. **MDM profile** restricting PWA installation?

---

## 🎓 Understanding the Technology

### Why `black-translucent` Works:

- `default`: iOS shows URL bar (legacy behavior)
- `black`: Hides URL bar, black status bar
- `black-translucent`: Hides URL bar, translucent status bar ✅

### Why Reinstall is Required:

- iOS caches manifest on first install
- No way to force refresh without reinstall
- This is an iOS limitation, not our fault

### Why Safari Only:

- Apple restricts PWA installation to Safari
- Chrome/Firefox on iOS are actually Safari WebView
- WebView can't install PWAs to home screen

---

## 📚 Resources

- [Apple PWA Documentation](https://developer.apple.com/documentation/webkit/safari_web_extensions/safari_web_extensions_support)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Can I Use - PWA](https://caniuse.com/web-app-manifest)

---

**Remember**: iOS PWAs are notoriously finicky. If you've followed all steps correctly and it's still not working after 3 attempts, the issue is likely iOS-specific and beyond our control. Consider filing a bug with Apple or waiting for the next iOS update.

Good luck! 🍀
