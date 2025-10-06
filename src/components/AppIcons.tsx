/**
 * App Icons Component
 * Exports all PWA icons imported from Figma assets
 * 
 * Icon Size Guide:
 * - icon120: Small size for older iPhones (120x120)
 * - icon152: iPad size (152x152)  
 * - icon180: Apple Touch Icon primary (180x180)
 * - icon192: Android standard (192x192)
 * - icon512: Android maskable & largest (512x512)
 * 
 * Total Figma Assets: 7
 */

// PWA Icon imports from Figma
import icon120 from "figma:asset/8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png"; // Small - 120x120
import icon152 from "figma:asset/e54075820b77aabd7ca46d8900b4e990627c6641.png"; // Medium - 152x152 (NEW!)
import icon180 from "figma:asset/9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png"; // Apple Touch Icon - 180x180
import icon192 from "figma:asset/83f3026cb6fc6961d7002cc9205423d2e14dedd4.png"; // Android - 192x192
import icon512 from "figma:asset/794c0aa997366cb162d2a499bf728514939c0ac3.png"; // Large - 512x512

export const APP_ICONS = {
  icon120,
  icon152,
  icon180,
  icon192,
  icon512,
  // Aliases for easy reference
  iconApple: icon180,
  iconAndroid: icon192,
  iconLarge: icon512
};
