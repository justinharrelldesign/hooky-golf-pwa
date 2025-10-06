import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// ============================================
// DATA USAGE LIMITS (Cost Control)
// ============================================
const MAX_ROUNDS_PER_USER = 100;        // Keep last 100 rounds only
const MAX_FRIENDS_PER_USER = 50;        // Max 50 friends per user
const MAX_PROFILE_PHOTO_SIZE = 1048576; // 1MB max (reduced from 5MB)

// Rank System Constants
const RANKS = [
  { level: 1, name: "Hooky Rookie", xpRequired: 0, cumulativeXP: 0 },
  { level: 2, name: "Hooky Amateur", xpRequired: 300, cumulativeXP: 300 },
  { level: 3, name: "Hooky Novice", xpRequired: 600, cumulativeXP: 900 },
  { level: 4, name: "Hooky Prodigy", xpRequired: 1000, cumulativeXP: 1900 },
  { level: 5, name: "Hooky Expert", xpRequired: 1500, cumulativeXP: 3400 },
  { level: 6, name: "Hooky Legend", xpRequired: 2000, cumulativeXP: 5400 },
  { level: 7, name: "Hooky Hero", xpRequired: 2500, cumulativeXP: 7900 },
  { level: 8, name: "Hooky God", xpRequired: 3500, cumulativeXP: 11400 }
];

const XP_PER_WIN = 100;
const XP_PERFECT_ROUND = 50;

function getDifficultyMultiplier(difficultyName: string): number {
  const normalizedName = difficultyName.toLowerCase();
  
  if (normalizedName.includes('easy')) {
    return 1.0;
  } else if (normalizedName.includes('medium')) {
    return 1.25;
  } else if (normalizedName.includes('hard')) {
    return 1.5;
  }
  
  return 1.0; // Default to easy
}

function getHoleMultiplier(totalHoles: number): number {
  if (totalHoles === 18) {
    return 2.0;
  } else if (totalHoles === 9) {
    return 1.0;
  }
  
  return 1.0; // Default to 9 holes
}

function getRankFromXP(totalXP: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].cumulativeXP) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to create Supabase client for auth
const createAuthClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Initialize Supabase Storage bucket for profile photos
const initializeStorage = async () => {
  const supabase = createAuthClient();
  const bucketName = 'make-15cc1085-profile-photos';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_PROFILE_PHOTO_SIZE, // 1MB (cost control)
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      });
      console.log(`Storage bucket '${bucketName}' created successfully`);
    }
  } catch (error) {
    console.log(`Storage initialization error: ${error}`);
  }
};

// Initialize storage on startup
initializeStorage();

// Helper to verify user from access token
const getUserFromToken = async (authHeader: string | null) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const supabase = createAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
};

// Health check endpoint
app.get("/make-server-15cc1085/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-15cc1085/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, nickname } = body;

    if (!email || !password || !nickname) {
      return c.json({ error: "Email, password, and nickname are required" }, 400);
    }

    const supabase = createAuthClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: nickname },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user profile in KV store
    await kv.set(`user:${data.user.id}:profile`, {
      userId: data.user.id,
      name: nickname,
      email,
      level: 1,
      xp: 0,
      totalRounds: 0,
      roundsWon: 0,
      roundsLost: 0,
      totalStrikes: 0,
      createdAt: new Date().toISOString(),
      profilePhotoUrl: undefined // Will be set when user uploads a photo
    });

    // Initialize empty arrays
    await kv.set(`user:${data.user.id}:rounds`, []);
    await kv.set(`user:${data.user.id}:friends`, []);

    return c.json({ 
      user: data.user,
      message: "Account created successfully" 
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Start a new round (save as in-progress)
app.post("/make-server-15cc1085/start-round", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { difficulty, totalHoles, players, course } = body;

    // Create in-progress round entry
    const roundId = `round:${user.id}:${Date.now()}`;
    const inProgressRound = {
      id: roundId,
      userId: user.id,
      status: 'in-progress',
      difficulty,
      totalHoles,
      players,
      course: course || null,
      startedAt: new Date().toISOString(),
      currentHole: 1
    };

    // Save to user's active round
    await kv.set(`user:${user.id}:active-round`, inProgressRound);

    // Also save to each friend participant's active round
    const friendPlayers = players.filter((p: any) => p.friendId);
    
    for (const friendPlayer of friendPlayers) {
      try {
        const friendId = friendPlayer.friendId;
        await kv.set(`user:${friendId}:active-round`, inProgressRound);
        console.log(`Active round saved for friend: ${friendId}`);
      } catch (friendError) {
        console.log(`Failed to save active round for friend ${friendPlayer.friendId}: ${friendError}`);
      }
    }

    return c.json({ 
      success: true,
      round: inProgressRound,
      message: "Round started successfully"
    });
  } catch (error) {
    console.log(`Start round error: ${error}`);
    return c.json({ error: "Failed to start round" }, 500);
  }
});

// Get active (in-progress) round
app.get("/make-server-15cc1085/active-round", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const activeRound = await kv.get(`user:${user.id}:active-round`);
    
    return c.json({ round: activeRound || null });
  } catch (error) {
    console.log(`Get active round error: ${error}`);
    return c.json({ error: "Failed to get active round" }, 500);
  }
});

// Clear active round (when user exits mid-round)
app.delete("/make-server-15cc1085/active-round", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the active round to find friend participants
    const activeRound = await kv.get(`user:${user.id}:active-round`);
    
    // Delete user's active round
    await kv.del(`user:${user.id}:active-round`);
    
    // Also delete active round for any friend participants
    if (activeRound && activeRound.players) {
      const friendPlayers = activeRound.players.filter((p: any) => p.friendId);
      
      for (const friendPlayer of friendPlayers) {
        try {
          await kv.del(`user:${friendPlayer.friendId}:active-round`);
          console.log(`Cleared active round for friend: ${friendPlayer.friendId}`);
        } catch (friendError) {
          console.log(`Failed to clear active round for friend ${friendPlayer.friendId}: ${friendError}`);
        }
      }
    }
    
    return c.json({ success: true, message: "Active round cleared for all participants" });
  } catch (error) {
    console.log(`Clear active round error: ${error}`);
    return c.json({ error: "Failed to clear active round" }, 500);
  }
});

// Save round result
app.post("/make-server-15cc1085/save-round", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { isVictory, difficulty, totalHoles, players, bossResults, completedAt, course, skippedBosses = [] } = body;

    // Get user's existing rounds
    const rounds = await kv.get(`user:${user.id}:rounds`) || [];
    
    // Create new round entry
    const roundId = `round:${user.id}:${Date.now()}`;
    const newRound = {
      id: roundId,
      userId: user.id,
      isVictory,
      difficulty,
      totalHoles,
      players,
      bossResults,
      completedAt: completedAt || new Date().toISOString(),
      course: course || null,
      skippedBosses
    };

    // Add to rounds array
    rounds.push(newRound);
    
    // COST CONTROL: Keep only last MAX_ROUNDS_PER_USER rounds
    if (rounds.length > MAX_ROUNDS_PER_USER) {
      // Keep most recent rounds (last MAX_ROUNDS_PER_USER entries)
      rounds.splice(0, rounds.length - MAX_ROUNDS_PER_USER);
      console.log(`User ${user.id}: Trimmed round history to ${MAX_ROUNDS_PER_USER} rounds`);
    }
    
    await kv.set(`user:${user.id}:rounds`, rounds);

    // Update user stats with INDIVIDUAL XP calculation
    const profile = await kv.get(`user:${user.id}:profile`);
    let oldLevel = 1;
    let newLevel = 1;
    let newRankName = "Hooky Rookie";
    let rankUp = false;
    
    if (profile) {
      const userPlayer = players.find((p: any) => p.name === profile.name);
      const strikes = userPlayer ? userPlayer.strikes : 0;
      const playerWasCaught = userPlayer ? (userPlayer.isCaught || strikes >= (userPlayer.maxStrikes || 3)) : false;
      
      // Store old level before updating
      oldLevel = profile.level;
      
      // Calculate XP based on INDIVIDUAL performance with difficulty and hole multipliers
      let xpGain = 0;
      
      // Player only gets XP if they personally won (didn't get caught)
      const playerWon = isVictory && !playerWasCaught;
      
      if (playerWon) {
        const difficultyMultiplier = getDifficultyMultiplier(difficulty.name);
        const holeMultiplier = getHoleMultiplier(totalHoles);
        
        // Apply both difficulty and hole multipliers
        xpGain = XP_PER_WIN * difficultyMultiplier * holeMultiplier;
        
        // Perfect INDIVIDUAL performance bonus (player had zero strikes)
        if (strikes === 0) {
          xpGain += XP_PERFECT_ROUND * difficultyMultiplier * holeMultiplier;
        }
        
        xpGain = Math.round(xpGain); // Round to nearest whole number
      }
      // If player was caught or round was lost = 0 XP
      
      const newXp = profile.xp + xpGain;
      const newRank = getRankFromXP(newXp);
      newLevel = newRank.level;
      newRankName = newRank.name;
      
      // Check if player ranked up
      rankUp = newLevel > oldLevel;

      profile.totalRounds += 1;
      // Individual win/loss tracking
      if (playerWon) {
        profile.roundsWon += 1;
      } else {
        profile.roundsLost += 1;
      }
      profile.totalStrikes += strikes;
      profile.xp = newXp;
      profile.level = newRank.level;

      await kv.set(`user:${user.id}:profile`, profile);
    }

    // Save round to friends' histories if they participated
    const friendPlayers = players.filter((p: any) => p.friendId);
    
    for (const friendPlayer of friendPlayers) {
      try {
        const friendId = friendPlayer.friendId;
        
        // Get friend's existing rounds
        const friendRounds = await kv.get(`user:${friendId}:rounds`) || [];
        
        // Create round entry for friend (with same roundId to link them)
        const friendRound = {
          id: roundId, // Same roundId to link rounds together
          userId: friendId,
          isVictory,
          difficulty,
          totalHoles,
          players,
          bossResults,
          completedAt: completedAt || new Date().toISOString(),
          course: course || null
        };
        
        // Add to friend's rounds array
        friendRounds.push(friendRound);
        
        // COST CONTROL: Keep only last MAX_ROUNDS_PER_USER rounds for friend too
        if (friendRounds.length > MAX_ROUNDS_PER_USER) {
          friendRounds.splice(0, friendRounds.length - MAX_ROUNDS_PER_USER);
          console.log(`Friend ${friendId}: Trimmed round history to ${MAX_ROUNDS_PER_USER} rounds`);
        }
        
        await kv.set(`user:${friendId}:rounds`, friendRounds);
        
        // Update friend's stats with INDIVIDUAL XP calculation
        const friendProfile = await kv.get(`user:${friendId}:profile`);
        if (friendProfile) {
          const strikes = friendPlayer.strikes || 0;
          const friendWasCaught = friendPlayer.isCaught || strikes >= (friendPlayer.maxStrikes || 3);
          
          // Calculate XP based on INDIVIDUAL friend performance with difficulty and hole multipliers
          let xpGain = 0;
          
          // Friend only gets XP if they personally won (didn't get caught)
          const friendWon = isVictory && !friendWasCaught;
          
          if (friendWon) {
            const difficultyMultiplier = getDifficultyMultiplier(difficulty.name);
            const holeMultiplier = getHoleMultiplier(totalHoles);
            
            // Apply both difficulty and hole multipliers
            xpGain = XP_PER_WIN * difficultyMultiplier * holeMultiplier;
            
            // Perfect INDIVIDUAL performance bonus (friend had zero strikes)
            if (strikes === 0) {
              xpGain += XP_PERFECT_ROUND * difficultyMultiplier * holeMultiplier;
            }
            
            xpGain = Math.round(xpGain); // Round to nearest whole number
          }
          // If friend was caught or round was lost = 0 XP
          
          const newXp = friendProfile.xp + xpGain;
          const newRank = getRankFromXP(newXp);
          
          friendProfile.totalRounds += 1;
          // Individual win/loss tracking
          if (friendWon) {
            friendProfile.roundsWon += 1;
          } else {
            friendProfile.roundsLost += 1;
          }
          friendProfile.totalStrikes += strikes;
          friendProfile.xp = newXp;
          friendProfile.level = newRank.level;
          
          await kv.set(`user:${friendId}:profile`, friendProfile);
        }
        
        console.log(`Round saved to friend's history: ${friendId}`);
        
        // Clear friend's active round since round is now complete
        await kv.del(`user:${friendId}:active-round`);
      } catch (friendError) {
        console.log(`Failed to save round for friend ${friendPlayer.friendId}: ${friendError}`);
        // Continue processing other friends even if one fails
      }
    }

    // Clear the user's active round since the round is now complete
    await kv.del(`user:${user.id}:active-round`);

    return c.json({ 
      success: true,
      round: newRound,
      message: "Round saved successfully",
      rankUp,
      newLevel,
      newRankName
    });
  } catch (error) {
    console.log(`Save round error: ${error}`);
    return c.json({ error: "Failed to save round" }, 500);
  }
});

// Search golf courses using Google Places API
app.get("/make-server-15cc1085/search-courses", async (c) => {
  try {
    const query = c.req.query("query");
    
    if (!query) {
      console.log("Course search: No query provided");
      return c.json({ courses: [], apiAvailable: false });
    }

    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!apiKey) {
      console.log("Course search: GOOGLE_PLACES_API_KEY not configured");
      return c.json({ courses: [], apiAvailable: false });
    }

    console.log(`Course search: Searching for "${query}"`);

    try {
      // Try the new Places API (Text Search) first
      const newApiUrl = "https://places.googleapis.com/v1/places:searchText";
      const newApiResponse = await fetch(newApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress"
        },
        body: JSON.stringify({
          textQuery: `${query} golf course`,
          maxResultCount: 10
        })
      });

      if (newApiResponse.ok) {
        const newData = await newApiResponse.json();
        console.log(`Course search: New API returned ${newData.places?.length || 0} results`);
        
        if (newData.places && newData.places.length > 0) {
          const courses = newData.places.map((place: any) => ({
            placeId: place.id,
            name: place.displayName?.text || place.displayName || "Unknown",
            address: place.formattedAddress || "",
          }));
          
          console.log(`Course search: Found ${courses.length} courses using new API`);
          return c.json({ courses, apiAvailable: true });
        }
      } else {
        console.log(`Course search: New API failed with status ${newApiResponse.status}, trying legacy API`);
      }
    } catch (newApiError) {
      console.log(`Course search: New API error, trying legacy API: ${newApiError}`);
    }

    // Fallback to legacy Text Search API
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + " golf course")}&key=${apiKey}`;
    
    const legacyResponse = await fetch(legacyUrl);
    const legacyData = await legacyResponse.json();

    console.log(`Course search: Legacy API returned status: ${legacyData.status}`);

    // Handle API errors gracefully
    if (legacyData.status === "REQUEST_DENIED" || legacyData.status === "INVALID_REQUEST") {
      console.log(`Course search error: ${legacyData.status} - ${legacyData.error_message || 'No error message'}`);
      return c.json({ 
        courses: [], 
        apiAvailable: false, 
        error: legacyData.error_message || `API Error: ${legacyData.status}`
      });
    }

    if (legacyData.status !== "OK" && legacyData.status !== "ZERO_RESULTS") {
      console.log(`Course search: Unexpected status ${legacyData.status}`);
      return c.json({ courses: [], apiAvailable: false });
    }

    const courses = (legacyData.results || []).slice(0, 10).map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address || "",
    }));

    console.log(`Course search: Found ${courses.length} courses using legacy API`);
    return c.json({ courses, apiAvailable: true });
  } catch (error) {
    console.log(`Course search error: ${error}`);
    return c.json({ courses: [], apiAvailable: false, error: String(error) });
  }
});

// Get user's round history
app.get("/make-server-15cc1085/rounds", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const rounds = await kv.get(`user:${user.id}:rounds`) || [];
    
    // Return most recent rounds first
    const sortedRounds = rounds.sort((a: any, b: any) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return c.json({ rounds: sortedRounds });
  } catch (error) {
    console.log(`Get rounds error: ${error}`);
    return c.json({ error: "Failed to get rounds" }, 500);
  }
});

// Get user profile and stats
app.get("/make-server-15cc1085/profile", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}:profile`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Upload profile photo
app.post("/make-server-15cc1085/upload-profile-photo", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const photo = formData.get('photo') as File;

    if (!photo) {
      return c.json({ error: "No photo provided" }, 400);
    }

    // Validate file size (max 5MB)
    if (photo.size > 5242880) {
      return c.json({ error: "File too large. Maximum size is 5MB" }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) {
      return c.json({ error: "Invalid file type" }, 400);
    }

    const supabase = createAuthClient();
    const bucketName = 'make-15cc1085-profile-photos';
    const fileName = `${user.id}/${Date.now()}-${photo.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, photo, {
        contentType: photo.type,
        upsert: true
      });

    if (uploadError) {
      console.log(`Upload error: ${uploadError.message}`);
      return c.json({ error: "Failed to upload photo" }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const photoUrl = urlData.publicUrl;

    // Update user profile with photo URL
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile) {
      profile.profilePhotoUrl = photoUrl;
      await kv.set(`user:${user.id}:profile`, profile);
    }

    return c.json({ 
      success: true,
      photoUrl: photoUrl
    });
  } catch (error) {
    console.log(`Upload profile photo error: ${error}`);
    return c.json({ error: "Failed to upload photo" }, 500);
  }
});

// Get friends list
app.get("/make-server-15cc1085/friends", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const friendIds = await kv.get(`user:${user.id}:friends`) || [];
    
    // Get profile data for each friend
    const friends = await Promise.all(
      friendIds.map(async (friendId: string) => {
        const profile = await kv.get(`user:${friendId}:profile`);
        return profile;
      })
    );

    return c.json({ friends: friends.filter(f => f !== null) });
  } catch (error) {
    console.log(`Get friends error: ${error}`);
    return c.json({ error: "Failed to get friends" }, 500);
  }
});

// Send friend request
app.post("/make-server-15cc1085/add-friend", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { friendEmail } = body;

    if (!friendEmail) {
      return c.json({ error: "Friend email is required" }, 400);
    }

    // Find user by email (search through all profiles)
    const allProfiles = await kv.getByPrefix('user:');
    let friendProfile = null;
    
    for (const profile of allProfiles) {
      if (profile && profile.userId && profile.email === friendEmail) {
        friendProfile = profile;
        break;
      }
    }

    if (!friendProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    if (friendProfile.userId === user.id) {
      return c.json({ error: "Cannot add yourself as a friend" }, 400);
    }

    // Check if already friends
    const friends = await kv.get(`user:${user.id}:friends`) || [];
    if (friends.includes(friendProfile.userId)) {
      return c.json({ error: "Already friends" }, 400);
    }
    
    // COST CONTROL: Check friend limit before adding
    if (friends.length >= MAX_FRIENDS_PER_USER) {
      return c.json({ 
        error: `Friend limit reached. Maximum ${MAX_FRIENDS_PER_USER} friends allowed.` 
      }, 400);
    }

    // Check if there's already a pending request from this user to friend
    const sentRequests = await kv.get(`user:${user.id}:friend-requests:sent`) || [];
    const pendingRequest = sentRequests.find((req: any) => req.toUserId === friendProfile.userId);
    if (pendingRequest) {
      return c.json({ error: "Friend request already sent" }, 400);
    }

    // Check if the friend has already sent a request to this user (if so, auto-accept both ways)
    const receivedRequests = await kv.get(`user:${user.id}:friend-requests:received`) || [];
    const existingRequest = receivedRequests.find((req: any) => req.fromUserId === friendProfile.userId);
    
    if (existingRequest) {
      // Auto-accept both ways
      // Remove the received request
      const updatedReceivedRequests = receivedRequests.filter((req: any) => req.fromUserId !== friendProfile.userId);
      await kv.set(`user:${user.id}:friend-requests:received`, updatedReceivedRequests);
      
      // Remove from friend's sent requests
      const friendSentRequests = await kv.get(`user:${friendProfile.userId}:friend-requests:sent`) || [];
      const updatedFriendSentRequests = friendSentRequests.filter((req: any) => req.toUserId !== user.id);
      await kv.set(`user:${friendProfile.userId}:friend-requests:sent`, updatedFriendSentRequests);
      
      // Add to both friends lists
      friends.push(friendProfile.userId);
      await kv.set(`user:${user.id}:friends`, friends);
      
      const friendFriends = await kv.get(`user:${friendProfile.userId}:friends`) || [];
      friendFriends.push(user.id);
      await kv.set(`user:${friendProfile.userId}:friends`, friendFriends);
      
      return c.json({ 
        success: true,
        autoAccepted: true,
        message: "Friend request accepted (mutual)" 
      });
    }

    // Get current user's profile for the request
    const senderProfile = await kv.get(`user:${user.id}:profile`);

    // Create friend request for received requests (from sender's perspective)
    const receivedRequest = {
      fromUserId: user.id,
      fromName: senderProfile?.name || 'Unknown',
      fromEmail: senderProfile?.email || '',
      fromProfilePhotoUrl: senderProfile?.profilePhotoUrl || null,
      toUserId: friendProfile.userId,
      createdAt: new Date().toISOString()
    };

    // Create friend request for sent requests (showing recipient's info)
    const sentRequest = {
      fromUserId: user.id,
      fromName: senderProfile?.name || 'Unknown',
      fromEmail: senderProfile?.email || '',
      fromProfilePhotoUrl: senderProfile?.profilePhotoUrl || null,
      toUserId: friendProfile.userId,
      toName: friendProfile.name,
      toEmail: friendProfile.email,
      toProfilePhotoUrl: friendProfile.profilePhotoUrl || null,
      createdAt: new Date().toISOString()
    };

    // Add to sender's sent requests
    sentRequests.push(sentRequest);
    await kv.set(`user:${user.id}:friend-requests:sent`, sentRequests);

    // Add to recipient's received requests
    const friendReceivedRequests = await kv.get(`user:${friendProfile.userId}:friend-requests:received`) || [];
    friendReceivedRequests.push(receivedRequest);
    await kv.set(`user:${friendProfile.userId}:friend-requests:received`, friendReceivedRequests);

    return c.json({ 
      success: true,
      message: "Friend request sent" 
    });
  } catch (error) {
    console.log(`Add friend error: ${error}`);
    return c.json({ error: "Failed to send friend request" }, 500);
  }
});

// Get pending friend requests
app.get("/make-server-15cc1085/friend-requests", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const receivedRequests = await kv.get(`user:${user.id}:friend-requests:received`) || [];
    const sentRequests = await kv.get(`user:${user.id}:friend-requests:sent`) || [];
    
    // Enrich sent requests with current recipient data if missing
    const enrichedSentRequests = await Promise.all(
      sentRequests.map(async (req: any) => {
        // If request already has recipient info, return as-is
        if (req.toName && req.toEmail) {
          return req;
        }
        
        // Otherwise, fetch recipient's current profile
        try {
          const recipientProfile = await kv.get(`user:${req.toUserId}:profile`);
          if (recipientProfile) {
            return {
              ...req,
              toName: recipientProfile.name,
              toEmail: recipientProfile.email,
              toProfilePhotoUrl: recipientProfile.profilePhotoUrl || null
            };
          }
        } catch (error) {
          console.log(`Error enriching sent request for user ${req.toUserId}: ${error}`);
        }
        
        // If we can't fetch the profile, return the request as-is
        return req;
      })
    );
    
    return c.json({ 
      incomingRequests: receivedRequests,
      outgoingRequests: enrichedSentRequests
    });
  } catch (error) {
    console.log(`Get friend requests error: ${error}`);
    return c.json({ error: "Failed to get friend requests" }, 500);
  }
});

// Accept friend request
app.post("/make-server-15cc1085/accept-friend-request", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { fromUserId } = body;

    if (!fromUserId) {
      return c.json({ error: "fromUserId is required" }, 400);
    }

    // Get received requests
    const receivedRequests = await kv.get(`user:${user.id}:friend-requests:received`) || [];
    const request = receivedRequests.find((req: any) => req.fromUserId === fromUserId);

    if (!request) {
      return c.json({ error: "Friend request not found" }, 404);
    }

    // Check friend limits before accepting
    const userFriends = await kv.get(`user:${user.id}:friends`) || [];
    const senderFriends = await kv.get(`user:${fromUserId}:friends`) || [];
    
    // COST CONTROL: Check both users' friend limits
    if (userFriends.length >= MAX_FRIENDS_PER_USER) {
      return c.json({ 
        error: `You have reached the friend limit of ${MAX_FRIENDS_PER_USER} friends.` 
      }, 400);
    }
    
    if (senderFriends.length >= MAX_FRIENDS_PER_USER) {
      return c.json({ 
        error: `That user has reached their friend limit of ${MAX_FRIENDS_PER_USER} friends.` 
      }, 400);
    }
    
    // Remove from received requests
    const updatedReceivedRequests = receivedRequests.filter((req: any) => req.fromUserId !== fromUserId);
    await kv.set(`user:${user.id}:friend-requests:received`, updatedReceivedRequests);

    // Remove from sender's sent requests
    const senderSentRequests = await kv.get(`user:${fromUserId}:friend-requests:sent`) || [];
    const updatedSenderSentRequests = senderSentRequests.filter((req: any) => req.toUserId !== user.id);
    await kv.set(`user:${fromUserId}:friend-requests:sent`, updatedSenderSentRequests);

    // Add to both friends lists
    if (!userFriends.includes(fromUserId)) {
      userFriends.push(fromUserId);
      await kv.set(`user:${user.id}:friends`, userFriends);
    }

    if (!senderFriends.includes(user.id)) {
      senderFriends.push(user.id);
      await kv.set(`user:${fromUserId}:friends`, senderFriends);
    }

    return c.json({ 
      success: true,
      message: "Friend request accepted" 
    });
  } catch (error) {
    console.log(`Accept friend request error: ${error}`);
    return c.json({ error: "Failed to accept friend request" }, 500);
  }
});

// Deny friend request
app.post("/make-server-15cc1085/deny-friend-request", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { fromUserId } = body;

    if (!fromUserId) {
      return c.json({ error: "fromUserId is required" }, 400);
    }

    // Get received requests
    const receivedRequests = await kv.get(`user:${user.id}:friend-requests:received`) || [];
    const request = receivedRequests.find((req: any) => req.fromUserId === fromUserId);

    if (!request) {
      return c.json({ error: "Friend request not found" }, 404);
    }

    // Remove from received requests
    const updatedReceivedRequests = receivedRequests.filter((req: any) => req.fromUserId !== fromUserId);
    await kv.set(`user:${user.id}:friend-requests:received`, updatedReceivedRequests);

    // Remove from sender's sent requests
    const senderSentRequests = await kv.get(`user:${fromUserId}:friend-requests:sent`) || [];
    const updatedSenderSentRequests = senderSentRequests.filter((req: any) => req.toUserId !== user.id);
    await kv.set(`user:${fromUserId}:friend-requests:sent`, updatedSenderSentRequests);

    return c.json({ 
      success: true,
      message: "Friend request denied" 
    });
  } catch (error) {
    console.log(`Deny friend request error: ${error}`);
    return c.json({ error: "Failed to deny friend request" }, 500);
  }
});

// Remove friend
app.post("/make-server-15cc1085/remove-friend", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { friendUserId } = body;

    if (!friendUserId) {
      return c.json({ error: "friendUserId is required" }, 400);
    }

    // Remove from current user's friends list
    const userFriends = await kv.get(`user:${user.id}:friends`) || [];
    const updatedUserFriends = userFriends.filter((id: string) => id !== friendUserId);
    await kv.set(`user:${user.id}:friends`, updatedUserFriends);

    // Remove from other user's friends list
    const friendFriends = await kv.get(`user:${friendUserId}:friends`) || [];
    const updatedFriendFriends = friendFriends.filter((id: string) => id !== user.id);
    await kv.set(`user:${friendUserId}:friends`, updatedFriendFriends);

    return c.json({ 
      success: true,
      message: "Friend removed" 
    });
  } catch (error) {
    console.log(`Remove friend error: ${error}`);
    return c.json({ error: "Failed to remove friend" }, 500);
  }
});

// Get friend stats
app.get("/make-server-15cc1085/friend-stats/:friendId", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const friendId = c.req.param('friendId');
    
    if (!friendId) {
      return c.json({ error: "Friend ID is required" }, 400);
    }

    // Verify they are friends
    const friends = await kv.get(`user:${user.id}:friends`) || [];
    if (!friends.includes(friendId)) {
      return c.json({ error: "Not friends with this user" }, 403);
    }

    // Get friend's profile
    const friendProfile = await kv.get(`user:${friendId}:profile`);
    
    if (!friendProfile) {
      return c.json({ error: "Friend profile not found" }, 404);
    }

    return c.json({ 
      stats: {
        totalRounds: friendProfile.totalRounds || 0,
        roundsWon: friendProfile.roundsWon || 0,
        roundsLost: friendProfile.roundsLost || 0,
        xp: friendProfile.xp || 0,
        level: friendProfile.level || 1
      }
    });
  } catch (error) {
    console.log(`Get friend stats error: ${error}`);
    return c.json({ error: "Failed to get friend stats" }, 500);
  }
});

// Generate map URL with markers
app.post("/make-server-15cc1085/generate-map-url", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { locations } = await c.req.json();
    
    if (!locations || locations.length === 0) {
      return c.json({ error: "No locations provided" }, 400);
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.log("Generate map URL: GOOGLE_PLACES_API_KEY not configured");
      return c.json({ error: "API key not configured" }, 500);
    }

    // Calculate center and zoom level
    const lats = locations.map((l: any) => l.lat);
    const lngs = locations.map((l: any) => l.lng);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    // Determine zoom level based on span with padding for visibility
    const latSpan = Math.max(...lats) - Math.min(...lats);
    const lngSpan = Math.max(...lngs) - Math.min(...lngs);
    
    // Add 40% padding to ensure markers are well within view
    const paddedLatSpan = latSpan * 1.4;
    const paddedLngSpan = lngSpan * 1.4;
    
    // Account for map aspect ratio (600x300 = 2:1)
    // Adjust lng span for the wider map
    const adjustedLatSpan = paddedLatSpan;
    const adjustedLngSpan = paddedLngSpan / 2;
    
    const maxSpan = Math.max(adjustedLatSpan, adjustedLngSpan);
    
    let zoom = 10;
    if (maxSpan < 0.005) zoom = 14;
    else if (maxSpan < 0.01) zoom = 13;
    else if (maxSpan < 0.02) zoom = 12;
    else if (maxSpan < 0.05) zoom = 11;
    else if (maxSpan < 0.1) zoom = 10;
    else if (maxSpan < 0.2) zoom = 9;
    else if (maxSpan < 0.5) zoom = 8;
    else if (maxSpan < 1) zoom = 7;
    else zoom = 6;

    // Build markers string for Static Maps API
    const markers = locations.map((loc: any) => {
      const color = loc.victories > 0 ? 'green' : 'orange';
      return `color:${color}|${loc.lat},${loc.lng}`;
    }).join('&markers=');

    // Generate Static Map URL (without markers since we'll overlay custom ones)
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoom}&size=600x300&scale=2&maptype=roadmap&key=${apiKey}&style=feature:poi|visibility:off`;

    return c.json({ 
      mapUrl,
      mapConfig: {
        centerLat,
        centerLng,
        zoom,
        width: 600,
        height: 300
      }
    });
  } catch (error) {
    console.log(`Generate map URL error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get course location details from Google Places API
app.get("/make-server-15cc1085/get-course-location", async (c) => {
  try {
    const placeId = c.req.query('placeId');
    
    if (!placeId) {
      console.log("Get course location: No placeId provided");
      return c.json({ error: "placeId is required" }, 400);
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.log("Get course location: GOOGLE_PLACES_API_KEY not configured");
      return c.json({ error: "API key not configured" }, 500);
    }

    console.log(`Get course location: Fetching details for placeId "${placeId}"`);

    // Try the legacy Place Details API (more reliable for existing place IDs)
    try {
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=geometry&key=${apiKey}`;
      
      console.log(`Get course location: Calling legacy API for placeId ${placeId}`);
      const legacyResponse = await fetch(legacyUrl);
      
      if (!legacyResponse.ok) {
        console.log(`Get course location: Legacy API HTTP error ${legacyResponse.status}`);
        return c.json({ error: `HTTP Error: ${legacyResponse.status}` }, legacyResponse.status);
      }

      const legacyData = await legacyResponse.json();
      console.log(`Get course location: Legacy API returned status: ${legacyData.status}`);

      if (legacyData.status === "OK" && legacyData.result?.geometry?.location) {
        return c.json({ 
          location: {
            lat: legacyData.result.geometry.location.lat,
            lng: legacyData.result.geometry.location.lng
          }
        });
      }

      // If legacy API fails, log the error but continue
      console.log(`Get course location: Legacy API failed with status ${legacyData.status}, error: ${legacyData.error_message || 'none'}`);
    } catch (legacyError) {
      console.log(`Get course location: Legacy API error: ${legacyError}`);
    }

    // Try the new Places API as fallback
    try {
      const newApiUrl = `https://places.googleapis.com/v1/${placeId}`;
      console.log(`Get course location: Trying new API for placeId ${placeId}`);
      
      const newApiResponse = await fetch(newApiUrl, {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "location"
        }
      });

      if (newApiResponse.ok) {
        const newData = await newApiResponse.json();
        console.log(`Get course location: New API success`);
        
        if (newData.location) {
          return c.json({ 
            location: {
              lat: newData.location.latitude,
              lng: newData.location.longitude
            }
          });
        }
      } else {
        console.log(`Get course location: New API failed with status ${newApiResponse.status}`);
      }
    } catch (newApiError) {
      console.log(`Get course location: New API error: ${newApiError}`);
    }

    // Both APIs failed
    console.log(`Get course location: Both APIs failed for placeId ${placeId}`);
    return c.json({ error: "Could not retrieve location from Google Places API" }, 500);
  } catch (error) {
    console.log(`Get course location unexpected error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get Google Maps API key for frontend use
app.get("/make-server-15cc1085/get-maps-api-key", async (c) => {
  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      return c.json({ error: "API key not configured" }, 500);
    }

    return c.json({ apiKey });
  } catch (error) {
    console.log(`Get Maps API key error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Upload profile photo
app.post("/make-server-15cc1085/upload-profile-photo", async (c) => {
  try {
    const user = await getUserFromToken(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('photo') as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // COST CONTROL: Validate file size (max 1MB to save storage)
    if (file.size > MAX_PROFILE_PHOTO_SIZE) {
      return c.json({ error: "File too large. Maximum size is 1MB. Please crop and compress your photo." }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Invalid file type. Only PNG, JPG, and WebP are allowed" }, 400);
    }

    const supabase = createAuthClient();
    const bucketName = 'make-15cc1085-profile-photos';
    
    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.log(`Profile photo upload error: ${uploadError.message}`);
      return c.json({ error: "Failed to upload photo" }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const photoUrl = urlData.publicUrl;

    // Update user profile with photo URL
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile) {
      profile.profilePhotoUrl = photoUrl;
      await kv.set(`user:${user.id}:profile`, profile);
    }

    return c.json({ 
      success: true,
      photoUrl,
      message: "Profile photo uploaded successfully" 
    });
  } catch (error) {
    console.log(`Upload profile photo error: ${error}`);
    return c.json({ error: "Failed to upload profile photo" }, 500);
  }
});

Deno.serve(app.fetch);