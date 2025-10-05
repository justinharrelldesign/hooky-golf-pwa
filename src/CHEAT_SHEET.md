# 🚀 Hooky Golf Deployment Cheat Sheet

> **Print this out or keep it open while deploying!**

---

## ⚡ The 5-Minute Command List

```bash
# 1. PUSH TO GITHUB (2 min)
git init
git add .
git commit -m "Launch Hooky Golf v1.0"
# Create repo at github.com/new, then:
git remote add origin https://github.com/YOUR-USERNAME/hooky-golf.git
git branch -M main
git push -u origin main

# 2. DEPLOY TO NETLIFY (3 min)
# Go to netlify.com → Sign in → Import repo → Deploy

# 3. ADD ENV VARS (2 min)
# Netlify → Site settings → Environment variables → Add all 5

# 4. TEST (3 min)
# Open on phone → Install → Test

# DONE! ✅
```

---

## 📋 Environment Variables (Copy-Paste Ready)

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=
GOOGLE_PLACES_API_KEY=
```

---

## 📱 User Installation Instructions

### iPhone
1. Open Safari
2. Go to your URL
3. Tap Share (box with arrow)
4. Tap "Add to Home Screen"
5. Tap "Add"

### Android
1. Open Chrome
2. Go to your URL
3. Tap "Install" prompt
4. Or: Menu → "Install app"

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| Netlify | https://app.netlify.com |
| GitHub | https://github.com |
| Supabase | https://supabase.com/dashboard |
| Your Site | https://your-site.netlify.app |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `package.json`, try `npm run build` locally |
| App won't load | Verify env vars in Netlify |
| Can't install | iPhone: use Safari. Android: use Chrome |
| Backend errors | Check Supabase credentials |
| Service worker issues | Clear cache, reopen app |

---

## ✅ Pre-Launch Checklist

- [ ] Tested locally (`npm run dev`)
- [ ] Built successfully (`npm run build`)
- [ ] GitHub account ready
- [ ] Netlify account ready
- [ ] Supabase credentials copied
- [ ] Read DEPLOY_NOW.md

---

## 📖 Documentation Quick Links

| Need to... | Read... |
|-----------|---------|
| Deploy step-by-step | [DEPLOY_NOW.md](./DEPLOY_NOW.md) |
| Check all tasks | [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) |
| See visual flow | [DEPLOYMENT_FLOWCHART.txt](./DEPLOYMENT_FLOWCHART.txt) |
| Share with users | [HOW_TO_INSTALL.md](./HOW_TO_INSTALL.md) |
| Submit to stores | [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) |
| Understand PWA | [PWA_SETUP.md](./PWA_SETUP.md) |

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Push to GitHub | 2 min |
| Connect Netlify | 3 min |
| Add env vars | 2 min |
| Test on mobile | 3 min |
| **TOTAL** | **10 min** |

---

## 💰 Costs

| Service | Free Tier | Cost |
|---------|-----------|------|
| Netlify | 100GB/mo | $0 |
| Supabase | 500MB DB | $0 |
| **TOTAL** | | **$0** |

---

## 📱 Test Coverage

### Must Test Before Launch
- [ ] Signup works
- [ ] Login works
- [ ] Start round works
- [ ] Complete hole works
- [ ] Friend requests work
- [ ] Profile photos work
- [ ] Installs on iPhone
- [ ] Installs on Android

---

## 🔄 Update Process

```bash
# Make changes
git add .
git commit -m "Your change description"
git push

# Netlify auto-deploys in 2-3 minutes
# Users get update next time they open app
```

---

## 🎯 Success Metrics

Check after 1 week:
- [ ] Number of signups
- [ ] Rounds played
- [ ] Friend connections
- [ ] User feedback

View in Supabase Dashboard

---

## 📞 Help Resources

- **Netlify Docs**: docs.netlify.com
- **Supabase Docs**: supabase.com/docs
- **PWA Docs**: web.dev/progressive-web-apps

---

## 🎉 Share Message Template

```
🏌️ Check out Hooky Golf!

Play golf while sneaking past annoying office bosses!

[YOUR-URL-HERE]

Install it on your phone like a real app:
• iPhone: Safari → Share → Add to Home Screen
• Android: Chrome → Install

Let's play! ⛳
```

---

## 🔐 Security Checklist

- [ ] Env vars in Netlify, NOT in code
- [ ] `.gitignore` excludes `.env` files
- [ ] Service role key never exposed to frontend
- [ ] HTTPS enabled (auto via Netlify)

---

## 🚨 Emergency Rollback

If something breaks:

1. Go to Netlify → Deploys
2. Find previous working deploy
3. Click "Publish deploy"
4. Done in 30 seconds

---

## 🎊 Post-Launch To-Do

### Today
- [ ] Test with 3-5 friends
- [ ] Gather feedback
- [ ] Fix critical bugs

### This Week
- [ ] Create real app icons
- [ ] Share more widely
- [ ] Monitor metrics

### This Month
- [ ] Add requested features
- [ ] Consider app stores
- [ ] Grow user base

---

## ⚙️ Netlify Build Settings

```
Build command: npm run build
Publish directory: dist
```

(These are auto-detected from `netlify.toml`)

---

## 🏆 You're Ready!

**Next step:** Open [DEPLOY_NOW.md](./DEPLOY_NOW.md) and start deploying!

**Time to launch:** 10 minutes  
**Difficulty:** ⭐ Easy  
**You got this:** 💪

---

<div align="center">

**🚀 Let's launch Hooky Golf! ⛳**

</div>