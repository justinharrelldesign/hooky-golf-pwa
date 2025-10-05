# Hooky Golf - App Store Submission Guide

## Current Status ✅

Your app is currently a **Progressive Web App (PWA)** that can be:
- Installed directly from browsers (no app store needed)
- Shared via URL
- Works offline

## To Submit to App Stores 📱

You need to wrap your PWA in a native container using **Capacitor**.

---

## Step 1: Install Capacitor Dependencies

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar
```

---

## Step 2: Initialize Capacitor

The `capacitor.config.ts` file has already been created for you. Review and customize:

```typescript
{
  appId: 'com.hookygolf.app',  // Change if you own a domain
  appName: 'Hooky Golf'
}
```

---

## Step 3: Build and Add Platforms

```bash
# Build your web app
npm run build

# Initialize Capacitor with existing config
npx cap init

# Add iOS and Android platforms
npx cap add ios
npx cap add android

# Sync your web code to native projects
npx cap sync
```

This creates:
- `/ios` folder with Xcode project
- `/android` folder with Android Studio project

---

## Step 4: Create App Icons 🎨

### Required Icon Sizes

**iOS (in `/ios/App/App/Assets.xcassets/AppIcon.appiconset/`):**
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone)
- 80x80 (iPad)
- 76x76 (iPad)
- 60x60 (iPhone)
- 58x58 (iPhone/iPad)
- 40x40 (iPhone/iPad)
- 29x29 (iPhone/iPad)
- 20x20 (iPhone/iPad)

**Android (in `/android/app/src/main/res/`):**
- mipmap-xxxhdpi: 192x192
- mipmap-xxhdpi: 144x144
- mipmap-xhdpi: 96x96
- mipmap-hdpi: 72x72
- mipmap-mdpi: 48x48

### Icon Design Tips
- Use your brand green (#517b34) and light green (#cee7bd)
- Golf theme (flag, ball, or club)
- Simple, recognizable at small sizes
- No text (especially for iOS)

### Tools to Generate Icons
- [AppIcon.co](https://www.appicon.co/) - Upload one image, get all sizes
- [MakeAppIcon](https://makeappicon.com/) - Free icon generator
- Figma + export at different scales

---

## Step 5: Configure iOS (Mac Required)

```bash
# Open Xcode
npx cap open ios
```

**In Xcode:**

1. **Select your project** in the left sidebar
2. **General tab:**
   - Display Name: "Hooky Golf"
   - Bundle Identifier: com.hookygolf.app
   - Version: 1.0.0
   - Build: 1
   - Deployment Target: iOS 13.0 or higher

3. **Signing & Capabilities:**
   - Team: Select your Apple Developer account
   - Automatically manage signing: ✓

4. **Info tab:**
   - Add key: `NSPhotoLibraryUsageDescription`
   - Value: "Hooky Golf needs access to your photos to set your profile picture"

5. **Build on device:**
   - Connect iPhone via USB
   - Select your device in top toolbar
   - Click "Run" (▶️)

---

## Step 6: Configure Android

```bash
# Open Android Studio
npx cap open android
```

**In Android Studio:**

1. **Update app name** in `/android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Hooky Golf</string>
```

2. **Update package name** in `/android/app/build.gradle`:
```gradle
applicationId "com.hookygolf.app"
versionCode 1
versionName "1.0.0"
```

3. **Add permissions** in `/android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

4. **Build on device:**
   - Connect Android phone via USB
   - Enable Developer Mode and USB Debugging on phone
   - Click "Run" (▶️) in Android Studio

---

## Step 7: Create Store Assets

### iOS App Store Requirements

**Screenshots** (required for all supported devices):
- iPhone 6.7" (iPhone 14 Pro Max): 1290 x 2796
- iPhone 6.5" (iPhone 11 Pro Max): 1242 x 2688
- iPhone 5.5" (iPhone 8 Plus): 1242 x 2208
- iPad Pro 12.9": 2048 x 2732

**App Preview Video** (optional but recommended):
- 15-30 seconds showing gameplay
- 1920x1080 or device-specific resolution

### Google Play Requirements

**Screenshots** (2-8 required):
- Phone: 1080 x 1920 minimum
- Tablet: 1200 x 1920 minimum

**Feature Graphic** (required):
- 1024 x 500 pixels
- Displayed at top of Play Store listing

---

## Step 8: Create Required Documents

### Privacy Policy (Required)

Create at: `/public/privacy-policy.html`

Must disclose:
- ✅ User authentication (email/password, Google OAuth)
- ✅ Profile data (name, photo, stats)
- ✅ Game data (rounds, friends, XP)
- ✅ Use of Supabase for backend
- ✅ No third-party tracking/analytics

Tools: [TermsFeed](https://www.termsfeed.com/privacy-policy-generator/)

Host at: `https://yourdomain.com/privacy-policy.html`

### Terms of Service (Optional but Recommended)

Standard terms for gaming apps.

---

## Step 9: iOS App Store Submission

**Requirements:**
- ✅ Apple Developer Account ($99/year)
- ✅ Mac with Xcode
- ✅ App icons
- ✅ Screenshots
- ✅ Privacy Policy URL

**Steps:**

1. **Archive your app in Xcode:**
   - Product → Archive
   - Wait for build to complete
   - Click "Distribute App"
   - Choose "App Store Connect"

2. **Log into App Store Connect:**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - My Apps → + → New App

3. **Fill in app information:**
   - Name: Hooky Golf
   - Primary Language: English
   - Bundle ID: com.hookygolf.app
   - SKU: hookygolf001
   - Category: Games > Sports

4. **Provide metadata:**
   - Description (4000 chars max)
   - Keywords (100 chars)
   - Screenshots
   - Privacy Policy URL
   - Support URL

5. **Submit for review**
   - Age rating
   - Export compliance (No encryption if using standard HTTPS)
   - Submit

**Review time:** 1-3 days typically

---

## Step 10: Google Play Submission

**Requirements:**
- ✅ Google Play Developer Account ($25 one-time)
- ✅ App icons + feature graphic
- ✅ Screenshots
- ✅ Privacy Policy URL

**Steps:**

1. **Create signed APK/AAB in Android Studio:**
   - Build → Generate Signed Bundle / APK
   - Choose "Android App Bundle" (recommended)
   - Create new keystore or use existing
   - Save keystore safely (you'll need it for updates!)

2. **Log into Google Play Console:**
   - Go to [play.google.com/console](https://play.google.com/console)
   - All apps → Create app

3. **Fill in app information:**
   - App name: Hooky Golf
   - Default language: English
   - App or game: Game
   - Free or paid: Free

4. **Complete all sections:**
   - Store listing (description, graphics, screenshots)
   - Content rating (PEGI/ESRB questionnaire)
   - Target audience (age range)
   - Privacy Policy URL
   - App content (ads, in-app purchases)

5. **Upload AAB:**
   - Production → Create release
   - Upload your .aab file
   - Add release notes

6. **Submit for review**

**Review time:** Can be several hours to days

---

## Step 11: Testing Checklist Before Submission

### Functionality
- ✅ Authentication (signup, login, logout)
- ✅ Game flow (all screens work)
- ✅ Friend system
- ✅ Profile photos upload
- ✅ Offline functionality
- ✅ No crashes

### iOS Specific
- ✅ Looks good on iPhone SE, iPhone 14, iPhone 14 Pro Max
- ✅ Looks good on iPad
- ✅ No web browser chrome visible
- ✅ Status bar color matches theme
- ✅ Safe area insets respected (notch areas)

### Android Specific
- ✅ Works on Android 8.0+
- ✅ Looks good on different screen sizes
- ✅ Back button works correctly
- ✅ Permissions requested properly

### Backend
- ✅ API calls work on device (not just localhost)
- ✅ Images load correctly
- ✅ Supabase authentication works
- ✅ Data persistence works

---

## Step 12: Post-Launch

### Updates
Every time you want to update:

```bash
# Make your code changes
npm run build

# Sync to native projects
npx cap sync

# Update version numbers
# iOS: Xcode → General → Version & Build
# Android: build.gradle → versionCode & versionName

# Rebuild and resubmit to stores
```

### Analytics (Optional)
Consider adding:
- Google Analytics for Firebase
- Mixpanel
- Amplitude

---

## Quick Command Reference

```bash
# Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Build web app
npm run build

# Sync to native
npx cap sync

# Open native IDEs
npx cap open ios
npx cap open android

# Update native code when you change web code
npm run build && npx cap sync

# Live reload during development (optional)
npx cap run ios -l --external
npx cap run android -l --external
```

---

## Costs Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Account | $99 | Annual |
| Google Play Developer Account | $25 | One-time |
| Domain (for privacy policy) | $10-15 | Annual |
| **Total First Year** | **~$134** | |
| **Annual After** | **~$109** | |

---

## Common Rejection Reasons

**iOS:**
- ❌ Missing privacy policy
- ❌ App crashes during review
- ❌ Misleading screenshots
- ❌ Copyright issues (boss character names?)
- ❌ Requiring personal info without clear privacy disclosure

**Android:**
- ❌ Missing content rating
- ❌ Incomplete store listing
- ❌ Inappropriate content
- ❌ Security vulnerabilities

---

## Alternative: PWA Only (No App Stores)

If you don't want to deal with app stores:

**Advantages:**
- ✅ No $99-$134 cost
- ✅ No review process
- ✅ Instant updates
- ✅ One codebase
- ✅ Works today (just deploy to Netlify)

**Disadvantages:**
- ❌ Not discoverable in app stores
- ❌ Users must find your website
- ❌ Less "official" feeling
- ❌ Some features limited (push notifications on iOS)

**How users install PWA:**
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Install App

---

## Recommended Path Forward

### For Quick Launch (This Week):
1. ✅ Deploy PWA to Netlify (already configured)
2. ✅ Share URL, let users install from browser
3. ✅ Gather feedback
4. ✅ Create real app icons

### For App Store Launch (2-4 Weeks):
1. Create proper app icons
2. Write privacy policy
3. Set up Capacitor
4. Test on real devices
5. Sign up for developer accounts
6. Create screenshots
7. Submit to stores

---

## Need Help?

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Ionic Community](https://forum.ionicframework.com/)

---

**Bottom Line:** You're 80% there! The PWA works great. To get in app stores, you need:
1. Real app icons (1-2 hours)
2. Privacy policy (1 hour with template)
3. Capacitor setup (2-3 hours)
4. Screenshots (2 hours)
5. Developer accounts ($134)
6. Testing and submission (4-8 hours)

**Total estimated time to app stores: 1-2 weeks**