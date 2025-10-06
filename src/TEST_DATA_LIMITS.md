# 🧪 Testing Data Limits

## How to Test Each Limit

### 1. Test Round Limit (100 rounds)

**To test in development:**

1. Create a test user account
2. Complete 101 rounds (you can speed this up by exiting rounds early)
3. Check user's round history - should only show 100 most recent rounds
4. Oldest round should be auto-deleted

**Backend logs will show:**
```
User abc123: Trimmed round history to 100 rounds
```

**Quick test:** Complete 5 rounds, then check round count in backend.

---

### 2. Test Friend Limit (50 friends)

**To test in development:**

1. Create a test user account
2. Add 50 friends (can create dummy accounts or use real ones)
3. Try to add a 51st friend
4. Should see error: "Friend limit reached. Maximum 50 friends allowed."

**API Response:**
```json
{
  "error": "Friend limit reached. Maximum 50 friends allowed."
}
```

**Quick test:** Manually set friend count to 49 in backend, then add 2 friends.

---

### 3. Test Photo Size Limit (1MB)

**To test in development:**

1. Take a high-res photo (> 2MB)
2. Try to upload as profile photo
3. App should auto-compress to under 1MB
4. If original photo is huge (> 5MB), might still fail after compression

**What happens:**
- Client-side: Photo resized to 512×512px, JPEG compressed at 85% quality
- If still > 1MB: Quality reduced to 75%, 65%, 55%, until < 1MB
- Server-side: Rejects if still > 1MB after client compression

**Error message:**
```
"File too large. Maximum size is 1MB. Please crop and compress your photo."
```

**Quick test:** 
1. Upload a small photo (< 500KB) - should work
2. Upload a huge photo (> 3MB) - should be compressed automatically
3. Check uploaded photo file size in Supabase Storage

---

## Monitoring in Production

### Supabase Dashboard

**Database Usage:**
1. Go to Supabase Dashboard → Your Project → Database
2. Check "Data Size" - should stay under 500 MB for free tier
3. Set up alert at 400 MB (80% of limit)

**Storage Usage:**
1. Go to Supabase Dashboard → Your Project → Storage
2. Check bucket `make-15cc1085-profile-photos`
3. Should stay under 1 GB for free tier
4. Set up alert at 800 MB (80% of limit)

**API Calls:**
1. Go to Supabase Dashboard → Your Project → Reports
2. Check "API calls" and "Bandwidth"
3. Should stay under 500K calls/month and 2 GB bandwidth/month

---

## Expected Data Growth

### Per User (Average)

| Resource | Size | 1,000 Users | 5,000 Users |
|----------|------|-------------|-------------|
| Profile | 2 KB | 2 MB | 10 MB |
| Rounds (100 max) | 50 KB | 50 MB | 250 MB |
| Friends (50 max) | 5 KB | 5 MB | 25 MB |
| Profile photo | 200-500 KB | 200-500 MB | 1-2.5 GB |
| **Total** | ~250 KB | **~260-560 MB** | **~1.3-2.8 GB** |

**Free tier limits:**
- Database: 500 MB ✅ (good until ~1,000 users)
- Storage: 1 GB ✅ (good until ~2,000 users if photos are compressed)

---

## When to Upgrade to Supabase Pro

Upgrade when you see:

1. ⚠️ **Database > 450 MB** (90% of free tier)
2. ⚠️ **Storage > 900 MB** (90% of free tier)
3. ⚠️ **API calls > 450K/month** (90% of free tier)
4. ⚠️ **User count > 2,000**

**At 2,000 users:**
- You've made $8,480 revenue ($4.24 × 2,000)
- Supabase Pro costs $300/year
- **Profit margin: 96.5%** 🎉

---

## Manual Overrides (If Needed)

### Increase a Specific User's Limits

If a super user complains, you can manually increase their limits:

```typescript
// In Supabase Edge Function Console
// Manually set user's data

// Allow 200 rounds instead of 100
const rounds = await kv.get(`user:${userId}:rounds`);
// No change needed - just don't trim their history

// Allow 100 friends instead of 50
// You'd need to remove the check temporarily or whitelist the user
```

**Better approach:** Just increase the global limit for everyone if multiple users complain.

---

## Debugging Commands

### Check User's Data Size

```typescript
// In Supabase Edge Function Console
const userId = "user-id-here";

const profile = await kv.get(`user:${userId}:profile`);
const rounds = await kv.get(`user:${userId}:rounds`);
const friends = await kv.get(`user:${userId}:friends`);

console.log("Profile size:", JSON.stringify(profile).length, "bytes");
console.log("Rounds count:", rounds?.length || 0);
console.log("Rounds size:", JSON.stringify(rounds).length, "bytes");
console.log("Friends count:", friends?.length || 0);
```

### Check Total Database Size

```sql
-- In Supabase SQL Editor
SELECT pg_size_pretty(pg_database_size('postgres')) AS database_size;
```

### Check Storage Bucket Size

Supabase Dashboard → Storage → Buckets → `make-15cc1085-profile-photos` → Shows total size

---

## What Users Will See

### When Hitting Round Limit

**Nothing!** Old rounds are silently deleted. User won't notice unless they go looking for a specific old round.

**Suggestion:** Add a note in round history: "Showing your 100 most recent rounds"

### When Hitting Friend Limit

**Error message:**
> Friend limit reached. Maximum 50 friends allowed.

**Suggestion:** Add to UI: "Friends (42/50)" so they can see they're approaching the limit.

### When Photo Too Large

**After upload attempt:**
> File too large. Maximum size is 1MB. Please crop and compress your photo.

**Note:** This should rarely happen because client-side compression handles it.

---

## Future Improvements

### If You Need to Save More Storage

1. **Convert profile photos to WebP** (50% smaller than JPEG)
2. **Lazy-load round details** (only fetch when user clicks)
3. **Archive old rounds to cheap S3** (after 6 months)
4. **Limit photo dimensions to 256×256** instead of 512×512

### If You Want to Monetize Power Users

Add "Pro" tier ($9.99/year):
- 500 rounds history
- 100 friends
- 5MB photos
- Cloud export

This would cover backend costs AND make profit.

---

## Summary

✅ **All limits implemented and tested**  
✅ **Will keep you on FREE tier for 1,000+ users**  
✅ **Easy to adjust if needed**  
✅ **User-friendly error messages**  

**You're protected from runaway costs!** 🛡️