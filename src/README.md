# Hooky Golf ⛳🏌️

> **A mobile golf game that combines golf with playful corporate satire. Sneak past office bosses and complete challenges without getting caught!**

[![Deploy Status](https://img.shields.io/badge/deploy-ready-brightgreen)]()
[![PWA](https://img.shields.io/badge/PWA-enabled-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 🚀 Quick Start

**Want to deploy right now?**

```bash
# Option A: Deploy as PWA (10 minutes, $0)
# See QUICK_START.txt or DEPLOY_NOW.md

# Option B: Submit to App Stores (1-2 weeks, $134)
# See APP_STORE_GUIDE.md
```

📖 **[→ Start with DEPLOY_NOW.md for complete walkthrough](./DEPLOY_NOW.md)**

---

## ✨ Features

### 🎮 Gameplay
- **Dynamic Difficulty**: Easy, Medium, and Hard modes with strikes that scale based on 9 or 18 holes
- **Team Play**: Play solo or with friends - each player faces bosses individually in team-based rounds
- **18 Unique Bosses**: Quirky workplace characters with custom challenges (Secretary Sarah, Deadline Dan, Coffee Breath Karen, and more!)
- **Challenge Skips**: 3 skips per round with randomized alternative challenges
- **Victory Conditions**: Complete all holes OR get all players caught to end the round

### 👥 Social Features
- **User Authentication**: Secure signup/login with Supabase
- **Friend System**: Send/accept friend requests
- **Profile Photos**: Upload and manage profile pictures with cropping
- **Round History**: View all past rounds with detailed statistics

### 🏆 Progress System
- **8-Level Rank System**: Progress from "Office Intern" to "CEO of Hooky"
- **XP Multipliers**: Earn more XP based on difficulty and team size
- **Statistics Tracking**: Win/loss ratios, total strikes, rounds played
- **Dynamic Leaderboards**: See friend rankings and achievements

### 📱 Technical Features
- **Progressive Web App**: Install on any device like a native app
- **Offline Support**: Service worker caching for offline gameplay
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real Golf Courses**: Integration with Google Places API
- **Backend Sync**: All progress saved to Supabase

---

## 📚 Documentation

### For Deployment
- **[QUICK_START.txt](./QUICK_START.txt)** - One-page deployment reference
- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - Complete step-by-step deployment guide (Option A)
- **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** - Pre-launch checklist
- **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)** - Deployment overview and decision matrix

### For Users
- **[HOW_TO_INSTALL.md](./HOW_TO_INSTALL.md)** - User installation guide for iPhone and Android

### For Developers
- **[PWA_SETUP.md](./PWA_SETUP.md)** - PWA technical implementation details
- **[APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md)** - Future app store submission (Option B)
- **[Guidelines.md](./guidelines/Guidelines.md)** - Development guidelines

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

### Backend
- **Supabase** - Authentication, database, storage, edge functions
- **PostgreSQL** - Data persistence
- **Supabase Storage** - Profile photos

### PWA
- **Service Worker** - Offline support
- **Web Manifest** - Installation metadata
- **Workbox** - Caching strategies

### Integrations
- **Google Places API** - Golf course search and mapping

---

## 🎨 Design System

### Colors
- **Primary Green**: `#517b34` - Main brand color
- **Background**: `#cee7bd` - Light green
- **Secondary**: `#f97316` - Coral/orange for alerts
- **Corporate Accents**: Blue/gray for boss themes

### Typography
- **Headings**: Luckiest Guy (playful, cartoonish)
- **Body**: Geologica (clean, readable)

### Style
- Cartoonish but polished
- Mobile-first responsive
- Playful animations and transitions
- Corporate satire theme

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:

```bash
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=your-database-url
GOOGLE_PLACES_API_KEY=your-google-places-key
```

---

## 🎮 How to Play

1. **Sign Up / Login** - Create your account
2. **Start a Round** - Choose difficulty and add players
3. **Select Course** - Pick a real golf course near you
4. **Face Bosses** - Each hole presents a new boss with a unique challenge
5. **Track Progress** - View player strikes and progress
6. **Complete Round** - Win by finishing all holes or lose when all players are caught
7. **Rank Up** - Earn XP and progress through 8 ranks
8. **Play with Friends** - Add friends and compete together

---

## 📱 Progressive Web App

Hooky Golf is a fully-featured PWA:

### Installation
- **iPhone**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Install app prompt
- **Desktop**: Chrome → Install icon in address bar

### Capabilities
- ✅ Works offline
- ✅ Full-screen app experience
- ✅ Push notifications ready
- ✅ Background sync
- ✅ Fast loading with caching

---

## 🚀 Deployment Options

### Option A: PWA via Netlify (Recommended)
- ⏱️ **Time**: 10 minutes
- 💰 **Cost**: $0 (free tier)
- 📱 **Platforms**: All devices via browser
- 📖 **Guide**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)

### Option B: Native App Stores
- ⏱️ **Time**: 1-2 weeks
- 💰 **Cost**: $134/year (Apple $99 + Google $25)
- 📱 **Platforms**: iOS App Store + Google Play
- 📖 **Guide**: [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md)

**Recommended path**: Start with Option A (PWA), then add Option B if needed!

---

## 📊 Project Structure

```
hooky-golf/
├── App.tsx                    # Main app component
├── components/                # React components
│   ├── AuthenticatedHomeScreen.tsx
│   ├── GameSetupScreen.tsx
│   ├── BossIntroScreen.tsx
│   ├── BossResultsScreen.tsx
│   └── ...
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
│   ├── rankSystem.ts         # XP and rank logic
│   └── supabase/             # Supabase client config
├── supabase/functions/       # Edge functions (backend)
├── styles/                   # Global styles
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
└── docs/                     # Documentation (see above)
```

---

## 🎯 Game Mechanics

### Difficulty Levels
- **Easy**: 5 strikes for 9 holes, 8 strikes for 18 holes
- **Medium**: 3 strikes for 9 holes, 5 strikes for 18 holes
- **Hard**: 2 strikes for 9 holes, 3 strikes for 18 holes

### Boss System
- 18 unique bosses with custom challenges
- Bosses shuffle each round (priority bosses appear first)
- Each player faces bosses individually in team play
- Skip system allows 3 alternative challenges per round

### XP & Ranks
- XP earned based on: completion × difficulty × team size
- 8 rank levels from Intern to CEO
- Rank up modal celebrates achievements
- Friend leaderboards show relative progress

---

## 🔒 Security & Privacy

- All authentication via Supabase Auth
- Environment variables for sensitive keys
- HTTPS required (auto via Netlify)
- Row Level Security on database
- Service role key never exposed to frontend

---

## 🐛 Known Issues & Roadmap

### Current Issues
- [ ] App icons are placeholders (need custom 192x192 and 512x512)
- [ ] No push notifications yet
- [ ] Analytics not integrated

### Planned Features
- [ ] Tournament mode
- [ ] More boss characters
- [ ] Custom challenges
- [ ] Achievements system
- [ ] Social sharing of rounds
- [ ] Spectator mode

---

## 🤝 Contributing

Contributions welcome! Key areas:

1. **New Boss Characters** - Create new workplace bosses with unique challenges
2. **UI Improvements** - Enhance animations and transitions
3. **Bug Fixes** - Report and fix issues
4. **Documentation** - Improve guides and tutorials

---

## 📄 License

MIT License - feel free to use for your own projects!

---

## 🙏 Acknowledgments

- Built with [Figma Make](https://figma.com/make)
- Powered by [Supabase](https://supabase.com)
- Hosted on [Netlify](https://netlify.com)
- Icons from [Lucide](https://lucide.dev)
- Golf course data from [Google Places](https://developers.google.com/maps/documentation/places)

---

## 📞 Support & Contact

- 📖 **Documentation**: See links above
- 🐛 **Bug Reports**: Open a GitHub issue
- 💡 **Feature Requests**: Open a GitHub discussion
- 📧 **Email**: [your-email@example.com]

---

## ⚡ Quick Links

- **[Deploy Now →](./DEPLOY_NOW.md)**
- **[Launch Checklist →](./LAUNCH_CHECKLIST.md)**
- **[Installation Guide →](./HOW_TO_INSTALL.md)**
- **[App Store Guide →](./APP_STORE_GUIDE.md)**

---

<div align="center">

**🏌️ Ready to play hooky? Let's go! ⛳**

[Deploy Now](./DEPLOY_NOW.md) • [View Demo](#) • [Report Bug](#)

Built with ❤️ and ☕ by a developer who dreams of playing more golf

</div>