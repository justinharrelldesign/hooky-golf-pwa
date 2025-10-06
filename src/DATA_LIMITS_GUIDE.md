# 🛡️ Hooky Golf: Data Usage Limits (Cost Control)

## 🎯 Why Data Limits?

As a **paid app** ($4.99 one-time), you need to prevent runaway backend costs over time. Without limits, heavy users could drive your Supabase costs through the roof.

**These limits keep you on Supabase's FREE tier indefinitely** (or at least until 10,000+ users).

---

## 📊 Current Limits

### 1. **Round History: 100 Rounds Per User**

**Limit:** Each user can store a maximum of 100 completed rounds.

**What happens:** When a user completes their 101st round, the oldest round is automatically deleted.

**Why:** 
- 100 rounds = ~50KB per user (assuming 500 bytes per round)
- 1,000 users = 50MB total (well under Supabase free tier)
- Most users never play 100+ rounds anyway

**Code location:** `/supabase/functions/server/index.tsx` line ~320

```typescript
// COST CONTROL: Keep only last MAX_ROUNDS_PER_USER rounds
if (rounds.length > MAX_ROUNDS_PER_USER) {
  rounds.splice(0, rounds.length - MAX_ROUNDS_PER_USER);
}
```

---

### 2. **Friend Limit: 50 Friends Per User**

**Limit:** Each user can have a maximum of 50 friends.

**What happens:** Users cannot add more friends once they reach 50. They'll see an error message: _"Friend limit reached. Maximum 50 friends allowed."_

**Why:**
- 50 friends is more than enough for most users
- Prevents abuse (e.g., someone friending 1,000 people)
- Keeps friend list queries fast

**Code location:** `/supabase/functions/server/index.tsx` line ~760

```typescript
// COST CONTROL: Check friend limit before adding
if (friends.length >= MAX_FRIENDS_PER_USER) {
  return c.json({ 
    error: `Friend limit reached. Maximum ${MAX_FRIENDS_PER_USER} friends allowed.` 
  }, 400);
}
```

---

### 3. **Profile Photo: 1MB Maximum**

**Limit:** Profile photos must be under 1MB in size.

**What happens:** 
- Photos are automatically resized to max 512×512 pixels
- JPEG compression is applied (starting at 85% quality)
- If still over 1MB, quality is reduced further (down to 50%)
- If user's original photo is > 1MB after compression, upload is rejected

**Why:**
- 1MB per photo × 1,000 users = 1GB storage (within free tier)
- Profile photos don't need to be huge
- Smaller files = faster page loads

**Code locations:**
- Backend: `/supabase/functions/server/index.tsx` line ~1250
- Frontend compression: `/components/ImageCropModal.tsx` line ~44

```typescript
// Backend
if (file.size > MAX_PROFILE_PHOTO_SIZE) {
  return c.json({ error: "File too large. Maximum size is 1MB." }, 400);
}

// Frontend (automatic compression)
const maxSize = 512;
// ... resize logic ...
canvas.toBlob((blob) => {
  // Compress until under 1MB
}, "image/jpeg", 0.85);
```

---

## 📈 Supabase Free Tier Limits

Here's what Supabase gives you for FREE:

| Resource | Free Tier Limit | Your Usage (est. 1,000 users) |
|----------|-----------------|-------------------------------|
| Database | 500 MB | ~50-100 MB ✅ |
| Storage | 1 GB | ~1 GB (with photo limits) ✅ |
| Bandwidth | 2 GB/month | ~500 MB/month ✅ |
| Edge Functions | 500K invocations/month | ~100K-200K/month ✅ |

**With these limits, you should stay on the FREE tier until 5,000-10,000 users.**

---

## 🚀 Scaling Strategy

### When to Upgrade to Supabase Pro ($25/month)

Upgrade when you hit any of these:
- ✅ **3,000+ active users** (likely to exceed free tier)
- ✅ **Database > 450 MB** (approaching 500 MB limit)
- ✅ **Storage > 900 MB** (approaching 1 GB limit)
- ✅ **Bandwidth consistently > 1.8 GB/month**

**Break-even at Pro tier:**
- Need 71 new downloads/year ($4.24 × 71 = $301) to cover $300/year backend cost
- If you have 3,000 users, you've already made $12,720 revenue - easily covers $25/month

---

## 🔧 How to Adjust Limits

All limits are defined as constants at the top of `/supabase/functions/server/index.tsx`:

```typescript
// ============================================
// DATA USAGE LIMITS (Cost Control)
// ============================================
const MAX_ROUNDS_PER_USER = 100;        // Increase if needed
const MAX_FRIENDS_PER_USER = 50;        // Increase if needed
const MAX_PROFILE_PHOTO_SIZE = 1048576; // 1MB (increase carefully)
```

**To change:**
1. Edit the constants in the backend file
2. Deploy the updated backend
3. Changes apply immediately to all new operations

**Recommendations:**
- ✅ **Increase round limit** if users complain - 200 rounds still only 100MB for 1,000 users
- ⚠️ **Think twice before increasing photo limit** - storage costs grow fast
- ⚠️ **Don't increase friend limit beyond 100** - social features can get expensive

---

## 💡 Alternative: Remove Limits with Paid Tier

If you want to monetize power users, you could add an optional "Pro" tier later:

```
PAID APP: $4.99 (current features)
- 100 rounds max
- 50 friends max
- 1MB photos

OPTIONAL PRO UPGRADE: $9.99/year
- Unlimited rounds
- 100 friends
- 5MB photos
- Cloud backup
```

This way:
- Casual users (90%) stay within limits
- Power users (10%) pay ongoing revenue
- You can afford Supabase Pro tier

---

## ❓ FAQ

### Q: What if a user wants to see rounds older than 100?

**A:** You could add an "export history" feature that sends them a CSV/JSON file of all their rounds before they're deleted. This doesn't require storing them permanently.

### Q: Will users notice the 100-round limit?

**A:** Probably not. Most casual players will play 10-30 rounds over the app's lifetime. Only your top 1% power users will hit 100 rounds.

### Q: Can I increase limits later without breaking things?

**A:** Yes! Increasing limits is always safe. Just change the constants and redeploy. Existing users won't lose data.

### Q: What if someone complains about limits?

**A:** 
1. Explain it's to keep the app sustainable
2. Offer to manually increase their limit (if they're a super fan)
3. Consider adding a "Pro" tier for power users

### Q: How do I monitor my Supabase usage?

**A:**
1. Go to Supabase Dashboard → Your Project
2. Click "Database" to see storage usage
3. Click "Storage" to see file storage
4. Click "Reports" for bandwidth/API calls

Set up email alerts when you hit 80% of free tier limits.

---

## 📊 Current Implementation Status

✅ **Round limit** - Implemented and active  
✅ **Friend limit** - Implemented and active  
✅ **Photo compression** - Implemented client-side  
✅ **Photo size limit** - Implemented server-side  
✅ **User-facing error messages** - All limits show friendly messages  

**You're all set! No action needed.**

---

## 🎯 Summary

Your app now has **smart cost controls** that will:
- ✅ Keep you on Supabase FREE tier for 1,000+ users
- ✅ Prevent abuse from power users
- ✅ Give you time to grow revenue before backend costs kick in
- ✅ Allow you to scale limits as needed

**Estimated cost runway:**
- **Year 1:** FREE (< 1,000 users)
- **Year 2:** $0-300 (1,000-3,000 users, might need Pro tier)
- **Year 3:** $300-600 (3,000-10,000 users, definitely need Pro tier)

**But by Year 3, you'll have earned $12,000-42,000 in revenue, so $300-600/year backend costs are nothing!** 🎉