# PWA Icon Setup Instructions

## Your Hooky Golf Icons

You've provided 3 icon assets:
1. `figma:asset/63b8f19bf350a73191104baad981fcbdf439cbda.png` - Small icon
2. `figma:asset/83f3026cb6fc6961d7002cc9205423d2e14dedd4.png` - Medium icon (192x192)
3. `figma:asset/fb3f244cd19c0832438b5ccdbec8ca1fed14eb45.png` - Large icon (512x512)

## Setup Steps for Netlify/Production

### Option 1: Automatic (Recommended)
The icons are already set up to work with your build system. The Figma assets will automatically be processed during build.

### Option 2: Manual (For local testing)
If you need to test locally or want to manually place icons:

1. **Export your icons from Figma** in these sizes:
   - 192x192 pixels (for Android)
   - 512x512 pixels (for Android/maskable)
   - 180x180 pixels (for iOS Apple Touch Icon)
   - 152x152 pixels (for iPad)
   - 120x120 pixels (for iPhone)

2. **Save them to `/public` directory** as:
   - `/public/icon-192.png`
   - `/public/icon-512.png`
   - `/public/apple-touch-icon.png` (180x180)
   - `/public/icon-152.png`
   - `/public/icon-120.png`

3. **Ensure all icons**:
   - Are PNG format
   - Have the Hooky Golf logo centered
   - Have the light green (#cee7bd) background
   - Have adequate padding (10-15% on all sides for maskable icons)

## Current Configuration

Your `manifest.json` and `index.html` are already configured to use:
- Android: `/icon-192.png` and `/icon-512.png`
- iOS: `/apple-touch-icon.png`

## Testing
After deployment, test on:
- ✅ Android Chrome - "Add to Home Screen"
- ✅ iOS Safari - "Add to Home Screen"
- ✅ Check that icons appear correctly on home screen

## Icon Design Tips
Your icons should:
- ✅ Have good contrast on both light and dark backgrounds
- ✅ Be recognizable at small sizes
- ✅ Have the character clearly visible
- ✅ Include "HOOKY GOLF" text if space allows

## Maskable Icon Info
The `"purpose": "any maskable"` in the manifest means:
- Android can apply different shapes (circle, squircle, rounded square)
- Important content should be in the center "safe zone" (80% of the icon)
- Your current design works well for this!
