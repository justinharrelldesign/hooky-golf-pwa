import { useState, useEffect } from "react";
import { IntroScreen } from "./components/IntroScreen";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { AuthenticatedHomeScreen } from "./components/AuthenticatedHomeScreen";
import { GameSetupScreen } from "./components/GameSetupScreen";
import { BossIntroScreen } from "./components/BossIntroScreen";
import { BossResultsScreen } from "./components/BossResultsScreen";
import { PlayerCaughtScreen } from "./components/PlayerCaughtScreen";
import { TeamProgressScreen } from "./components/TeamProgressScreen";
import { EndRoundSummaryScreen } from "./components/EndRoundSummaryScreen";
import { RankUpModal } from "./components/RankUpModal";
import { InstallPrompt } from "./components/InstallPrompt";
import { ImagePreloader } from "./components/ImagePreloader";
import { StandaloneModeChecker } from "./components/StandaloneModeChecker";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { projectId } from "./utils/supabase/info";
import { getSupabaseClient } from "./utils/supabase/client";
import { getProgressToNextRank } from "./utils/rankSystem";
import secretarySarahImg from "figma:asset/da606b15aaafe7911ca9e1be31b9011a11616444.png";
import deadlineDanImg from "figma:asset/639913f4590217518f4a29a4f9cc4bfc94bde609.png";
import cubicalChuckImg from "figma:asset/88d4ac832cde727bb6ce70e63518f7d9460b6fae.png";
import coffeeBreathKarenImg from "figma:asset/0cb85757b9ceba4d82522da1b60933c8a40fb2e5.png";
import gumSmackerStaceyImg from "figma:asset/05b9ab854e1d69de46cf06658c5c9365d280d4b2.png";
import replyAllRebeccaImg from "figma:asset/1d0b13e3e884f69508ae1819b92e7061b4df5a6b.png";
import lunchBanditBarbImg from "figma:asset/30b9f5a045cd191b57005ecc8177bbdc0ef0d43c.png";
import hrRandyImg from "figma:asset/a52ab0c7395e16ace94356767b3268c4f445778a.png";
import ibbBrianImg from "figma:asset/257133d885eb6d6f7e93e1e8e829dbac0299c9a6.png";
import janitorJerryImg from "figma:asset/c2a4d4774071bda822f36da11ba7bac792895c71.png";
import itLordLeonardImg from "figma:asset/91b6e581832895955629438cad630af81fc8e271.png";
import sweatyStanImg from "figma:asset/860e3ef3c71304f24c8de304a36e1d94e7b9dff4.png";
import loudLouiseImg from "figma:asset/a4d63fb045927dc52d8d5f380de662d53bd3f1db.png";
import awfulOfficeCoupleImg from "figma:asset/42b256c1f0c0fc042cef8d402a041a8fb7473125.png";
import smokeBreakSteveImg from "figma:asset/f6c69b0ebd60e291018ba93006b91f2aade891c7.png";
import wheelieBagWendyImg from "figma:asset/192a05458036112f4c6abb6a37675ddaa22e4cb3.png";
import happyHourHankImg from "figma:asset/ce1a18758397c1af669651b01fcda2ce2f7b035d.png";
import bikeCommuteBrandonImg from "figma:asset/2ddfbb9485d0e431853e0dabce9436aa2f41fe73.png";
import brownNoserBenImg from "figma:asset/78752367d0dbe838c1f6a01ae32865daf8ae8647.png";
import partyPlannerPennyImg from "figma:asset/4643151d7858a8b250c921a437740aae709bdcc7.png";
import officeSecuritySeanImg from "figma:asset/49f7d90f9020ebe3b03e56e8ee0ed627beb78d92.png";
import keyboardClickerKateImg from "figma:asset/6ceffa84acd3c7be09b7a52ddcb52d2b2dc94e15.png";
import patientZeroPaulieImg from "figma:asset/993ba9f3de295471da367c5a64c21aa9e9f3c424.png";
import geriatricGertrudeImg from "figma:asset/8467b71d158526d1a2777a99b09ff51a126f7c79.png";
import rancidLunchRickImg from "figma:asset/4441c4e4832246c4ddf8c3e39f4101fb3eedb41f.png";

interface Boss {
  name: string;
  challenge: string;
  quote: string;
  avatar: string;
  backgroundColor: string;
}

interface Player {
  id: string;
  name: string;
  strikes: number;
  maxStrikes: number;
  isCaught?: boolean; // Helper property to easily identify caught players
  avatarUrl?: string; // Profile photo URL
  isCurrentUser?: boolean; // Flag for the current logged-in user
  friendId?: string; // Friend's user ID if this player is a friend
}

interface PlayerBossResult {
  playerId: string;
  hole: number;
  bossName: string;
  success: boolean;
}

interface GameState {
  screen: 'login' | 'signup' | 'home' | 'intro' | 'setup' | 'boss' | 'results' | 'caught' | 'progress' | 'summary';
  difficulty: { name: string; strikes: number } | null;
  currentHole: number;
  totalHoles: number;
  players: Player[];
  bossResults: PlayerBossResult[];
  shuffledBosses: Boss[];
  gameComplete: boolean;
  isVictory: boolean;
  failedAtHole?: number;
  newlyCaughtPlayers?: Player[];
  skipsRemaining: number;
  skippedBosses: string[];
  usedChallenges: string[];
  currentChallenge?: string; // Tracks the current challenge for this hole
  course?: { placeId: string; name: string; address: string };
}

interface AuthState {
  accessToken: string | null;
  userId: string | null;
}

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  totalRounds: number;
  roundsWon: number;
  roundsLost: number;
  totalStrikes: number;
  createdAt: string;
  profilePhotoUrl?: string;
}

interface PlayerResult {
  playerId: string;
  success: boolean | null;
}

const bosses: Boss[] = [
  {
    name: "Secretary Sarah",
    challenge: "Hit the fairway (or green if it's a par 3) to sneak past Sarah.",
    quote: "I see everything from my dandruff filled desk and will squeal like a pig if i see you try to sneak past me!",
    avatar: secretarySarahImg,
    backgroundColor: "bg-pink-400"
  },
  {
    name: "Deadline Dan",
    challenge: "No time to waste. Secure a 1 putt to get Dan off your case.",
    quote: "I may not always make it to the toilet on time, but I sure as shit expect you meet your deadline on time!",
    avatar: deadlineDanImg,
    backgroundColor: "bg-red-400"
  },
  {
    name: "Cubical Chuck",
    challenge: "Find a golf ball to avoid Chuck from snitching out of jealousy.",
    quote: "First you didn't come to my cats birthday party and now you sneak out without me!? I thought we were pals!",
    avatar: cubicalChuckImg,
    backgroundColor: "bg-blue-400"
  },
  {
    name: "Coffee Breath Karen",
    challenge: "Avoid any hazards and Karen's hot breath.",
    quote: "That smell? It isn't the goose shit you stepped in last hole. That's my roasted bean breath catching you red handed!",
    avatar: coffeeBreathKarenImg,
    backgroundColor: "bg-purple-400"
  },
  {
    name: "Gum smacker Stacey",
    challenge: "Avoid bogey or worse before Stacey gums up your day of Hooky Golf.",
    quote: "Sorry to burst your bubble but you're IN deep shit!!",
    avatar: gumSmackerStaceyImg,
    backgroundColor: "bg-green-400"
  },
  {
    name: "Reply-All Rebecca",
    challenge: "Putt as clueless as Rebecca. Make one putt with your eyes closed and make bogey or better.",
    quote: "I was about to Reply-All to the potluck invite saying I'd bring my famous egg salad… instead, I'll tell everyone about your little golf outing!",
    avatar: replyAllRebeccaImg,
    backgroundColor: "bg-yellow-400"
  },
  {
    name: "Lunch Bandit Barb",
    challenge: "Hit a shot fat and your round could be over - just like Barb's blood sugar.",
    quote: "Think you're safe skipping work? Fat Chance!",
    avatar: lunchBanditBarbImg,
    backgroundColor: "bg-orange-400"
  },
  {
    name: "Human Resources Randy",
    challenge: "Randy is an expert at doing things one handed. Only putt one handed and make bogey or better.",
    quote: "Golfing on company time? That's a bigger violation than my browser history.",
    avatar: hrRandyImg,
    backgroundColor: "bg-slate-400"
  },
  {
    name: "Irritable Bowel Brian",
    challenge: "Brian knows all about number 2. Reach the green in 2 or your day of Hooky could go down the drain... or clog it.",
    quote: "I'll have you racing back to the office so fast, your skid marks will be longer than the ones in my tighty-whities.",
    avatar: ibbBrianImg,
    backgroundColor: "bg-amber-400"
  },
  {
    name: "Janitor Jerry",
    challenge: "Jerry has seen enough toilet bowls Avoid a lip out or he's making a mess of your Hooky Golf round.",
    quote: "Jerry has seen enough toilet bowls. Avoid a lip out or he's making a mess of your Hooky Golf round.",
    avatar: janitorJerryImg,
    backgroundColor: "bg-gray-400"
  },
  {
    name: "IT Lord Leonard",
    challenge: "Your drive has to be straighter than the train tracks on Leonard's braces.",
    quote: "Your drives may slice, but your data's straight to my inbox.",
    avatar: itLordLeonardImg,
    backgroundColor: "bg-cyan-400"
  },
  {
    name: "Sweaty Stan",
    challenge: "Time for you to work up a sweat. Finish the hole in less than 10 minutes.",
    quote: "The only puddles bigger than mine are from the tears you'll cry getting sent back to work.",
    avatar: sweatyStanImg,
    backgroundColor: "bg-blue-300"
  },
  {
    name: "Loud Louise",
    challenge: "Play the hole silent or Louise could be the fat lady singing to end your round.",
    quote: "What's that? You wanted your little hooky golf outing to stay quiet? Too bad, I'm louder than my chair screaming for help.",
    avatar: loudLouiseImg,
    backgroundColor: "bg-yellow-300"
  },
  {
    name: "Awful Office couple",
    challenge: "Time to cock-block Cupid. Only a birdie or better gets you past this nightmare.",
    quote: "We don't jussst share shhhhexy shmoochesss… we'll alssso gladly share your little golf outing with the entire offissse.",
    avatar: awfulOfficeCoupleImg,
    backgroundColor: "bg-pink-300"
  },
  {
    name: "Smoke Break Steve",
    challenge: "Avoid any sand traps or your day of Hooky could be up in smoke.",
    quote: "While you're hitting out of sand traps, I'm spitting tar pits and ratting your ass out.",
    avatar: smokeBreakSteveImg,
    backgroundColor: "bg-gray-400"
  },
  {
    name: "Wheelie bag Wendy",
    challenge: "Land within 10 yards of the cart path, and Wendy's wide load will steamroll your ass and wheel you back to the office.",
    quote: "Aww shucks, I Wheelie hope your not off skipping work!",
    avatar: wheelieBagWendyImg,
    backgroundColor: "bg-amber-300"
  },
  {
    name: "Happy Hour Hank",
    challenge: "Down a beer or shot before the hole's done, or Hank will spill your secret.",
    quote: "Hooky golf? Awesome! Your secret's safe with me… at least until I get piss drunk and slip up harder than I fall into my own vomit.",
    avatar: happyHourHankImg,
    backgroundColor: "bg-orange-400"
  },
  {
    name: "Bike commute Brandon",
    challenge: "Show Brandon some speed his bike could never match. Hit a drive 250+ yards.",
    quote: "I'll pedal your ass back to the office faster than I blow out the back of my spandex.",
    avatar: bikeCommuteBrandonImg,
    backgroundColor: "bg-green-400"
  },
  {
    name: "Brown Noser Ben",
    challenge: "Keep your ball and reputation clean. Any mud balls, and you're in deeper shit than Ben's nose.",
    quote: "Something stinks of slacking off...",
    avatar: brownNoserBenImg,
    backgroundColor: "bg-yellow-600"
  },
  {
    name: "Party Planner Penny",
    challenge: "Show Penny a real celebration. Shoot birdie or better.",
    quote: "Golfing during office hours? Don't worry, I'll plan your farewell party for you!",
    avatar: partyPlannerPennyImg,
    backgroundColor: "bg-pink-400"
  },
  {
    name: "Office Security Sean",
    challenge: "Sean runs the lost and found like Fort Knox. Lose a ball and he'll shake you down like a vending machine that ate his dollar.",
    quote: "You golf, I report. That's the chain of command, chief.",
    avatar: officeSecuritySeanImg,
    backgroundColor: "bg-blue-600"
  },
  {
    name: "Keyboard clicker kate",
    challenge: "Miss a tap-in and Kate is drafting an email with her turd filled nails.",
    quote: "Click-click-click. the only thing louder than my typing is my pie hole reporting you.",
    avatar: keyboardClickerKateImg,
    backgroundColor: "bg-purple-500"
  },
  {
    name: "Patient zero paulie",
    challenge: "Paulie used your tees to plug his nose. Make par or better this hole without using them.",
    quote: "just Like my snot filled nose, you can run but you can't hide!",
    avatar: patientZeroPaulieImg,
    backgroundColor: "bg-green-500"
  },
  {
    name: "Geriatric Gertrude",
    challenge: "Gertrude doesn't have much longer. Go long of the green and her last words will be turning you in.",
    quote: "Don't mind the smell, dear. that's just me decomposing like your job security.",
    avatar: geriatricGertrudeImg,
    backgroundColor: "bg-yellow-300"
  },
  {
    name: "Rancid lunch rick",
    challenge: "No microwave for Rick and no mark for you. 2 putt without marking your ball or Rick is making a mess of your round.",
    quote: "My lunch may smell of death but so does your career.",
    avatar: rancidLunchRickImg,
    backgroundColor: "bg-amber-600"
  }
];

// For profile header - will show first player's name
let currentUser: Player | null = null;

// Bosses with custom components (should appear first)
const priorityBossNames = [
  "Secretary Sarah",
  "Deadline Dan", 
  "Cubical Chuck",
  "Coffee Breath Karen",
  "Gum smacker Stacey",
  "Reply-All Rebecca",
  "Lunch Bandit Barb",
  "Human Resources Randy",
  "Irritable Bowel Brian",
  "Janitor Jerry",
  "IT Lord Leonard",
  "Sweaty Stan",
  "Loud Louise",
  "Awful Office couple",
  "Smoke Break Steve",
  "Wheelie bag Wendy",
  "Happy Hour Hank",
  "Bike commute Brandon",
  "Brown Noser Ben",
  "Party Planner Penny",
  "Office Security Sean",
  "Keyboard clicker kate",
  "Patient zero paulie",
  "Geriatric Gertrude",
  "Rancid lunch rick"
];

// Shuffle function to randomize boss order
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to arrange bosses with priority bosses first (shuffled), then shuffled remaining
function arrangeBossesWithPriority(bosses: Boss[]): Boss[] {
  // Separate priority bosses and remaining bosses
  const priorityBosses = bosses.filter(boss => priorityBossNames.includes(boss.name));
  const remainingBosses = bosses.filter(boss => !priorityBossNames.includes(boss.name));
  
  // Shuffle both the priority bosses and remaining bosses
  const shuffledPriority = shuffleArray(priorityBosses);
  const shuffledRemaining = shuffleArray(remainingBosses);
  
  // Return shuffled priority bosses first, then shuffled remaining
  return [...shuffledPriority, ...shuffledRemaining];
}

export default function App() {
  const { imagesPreloaded, loadProgress } = useImagePreloader();
  const [showApp, setShowApp] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    userId: null
  });

  const [gameState, setGameState] = useState<GameState>({
    screen: 'login',
    difficulty: null,
    currentHole: 1,
    totalHoles: 9,
    players: [],
    bossResults: [],
    shuffledBosses: [],
    gameComplete: false,
    isVictory: false,
    skipsRemaining: 3,
    skippedBosses: [],
    usedChallenges: [],
    currentChallenge: undefined
  });

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  const [rankUpInfo, setRankUpInfo] = useState<{ level: number; rankName: string } | null>(null);
  const [homeScreenKey, setHomeScreenKey] = useState(0);

  // Check for existing session on load (happens during image preloading)
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // If there's an error (like invalid refresh token), clear the session
      if (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        setAuthState({ accessToken: null, userId: null });
        setGameState(prev => ({ ...prev, screen: 'login' }));
        setSessionChecked(true);
        return;
      }
      
      if (session) {
        setAuthState({
          accessToken: session.access_token,
          userId: session.user.id
        });
        setGameState(prev => ({ ...prev, screen: 'home' }));
      } else {
        // No session, go to login
        setGameState(prev => ({ ...prev, screen: 'login' }));
      }
      setSessionChecked(true);
    } catch (error) {
      console.error("Session check error:", error);
      // Clear any invalid session data
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setAuthState({ accessToken: null, userId: null });
      setGameState(prev => ({ ...prev, screen: 'login' }));
      setSessionChecked(true);
    }
  };

  // Show app only when BOTH images are preloaded AND session is checked
  useEffect(() => {
    if (imagesPreloaded && sessionChecked) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowApp(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [imagesPreloaded, sessionChecked]);

  const handleStartGame = async (difficulty: { name: string; strikes: number }, selectedPlayers: { id: string; name: string; avatarUrl?: string; isCurrentUser?: boolean; friendId?: string }[], holes: number, course?: { placeId: string; name: string; address: string } | null) => {
    const playersWithDifficulty: Player[] = selectedPlayers.map(player => {
      console.log('Creating player for game:', { name: player.name, avatarUrl: player.avatarUrl, isCurrentUser: player.isCurrentUser, friendId: player.friendId });
      return {
        ...player,
        strikes: 0,
        maxStrikes: difficulty.strikes,
        isCaught: false,
        avatarUrl: player.avatarUrl,
        isCurrentUser: player.isCurrentUser,
        friendId: player.friendId
      };
    });

    // Set current user for profile header
    currentUser = playersWithDifficulty[0];

    // Create an arranged array of bosses with priority bosses first, then shuffled remaining
    const shuffledBosses = arrangeBossesWithPriority(bosses);

    // Save round as in-progress to backend
    try {
      // Get fresh session token
      const supabase = getSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!sessionError && session?.access_token) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/start-round`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              difficulty,
              totalHoles: holes,
              players: playersWithDifficulty,
              course: course || null
            }),
          }
        );
      }
    } catch (error) {
      console.error("Failed to save round start:", error);
      // Continue anyway - don't block gameplay
    }

    setGameState({
      screen: 'boss',
      difficulty,
      currentHole: 1,
      totalHoles: holes,
      players: playersWithDifficulty,
      bossResults: [],
      shuffledBosses,
      gameComplete: false,
      course: course || undefined,
      isVictory: false,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: []
    });
  };

  const handleBossContinue = (challenge?: string) => {
    // Move from boss intro to results entry screen
    // Store the challenge that was used (either original or skipped alternative)
    setGameState(prev => ({
      ...prev,
      screen: 'results',
      currentChallenge: challenge
    }));
  };

  const handleSubmitResults = (results: PlayerResult[]) => {
    // Apply strikes to players based on results and mark caught players
    const updatedPlayers = gameState.players.map(player => {
      const result = results.find(r => r.playerId === player.id);
      if (result && result.success === false) {
        const newStrikes = player.strikes + 1;
        const caught = newStrikes >= player.maxStrikes;
        return { 
          ...player, 
          strikes: newStrikes,
          isCaught: caught
        };
      }
      // Preserve existing caught status for players who didn't play this round
      const caught = player.strikes >= player.maxStrikes;
      return {
        ...player,
        isCaught: caught
      };
    });

    // Create boss results for this hole
    const newBossResults: PlayerBossResult[] = results
      .filter(result => result.success !== null)
      .map(result => ({
        playerId: result.playerId,
        hole: gameState.currentHole,
        bossName: currentBoss.name,
        success: result.success!
      }));

    // Check if ALL players are caught (have maxed out their strikes)
    const allPlayersCaught = updatedPlayers.every(player => player.isCaught === true);
    
    // Check if any players were just caught this round
    const newlyCaughtPlayers = updatedPlayers.filter((player, index) => {
      const oldPlayer = gameState.players[index];
      return player.isCaught === true && oldPlayer.isCaught !== true;
    });
    
    // Check if this is the final hole
    const isFinalHole = gameState.currentHole === gameState.totalHoles;

    if (allPlayersCaught) {
      // Show caught screen with all players when everyone is caught
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        bossResults: [...prev.bossResults, ...newBossResults],
        screen: 'caught',
        newlyCaughtPlayers: updatedPlayers, // Show all players since they're all caught
        gameComplete: true,
        isVictory: false,
        failedAtHole: prev.currentHole
      }));
    } else if (isFinalHole) {
      // If it's the final hole and not all players are caught, it's a victory
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        bossResults: [...prev.bossResults, ...newBossResults],
        screen: 'summary',
        gameComplete: true,
        isVictory: true
      }));
    } else if (newlyCaughtPlayers.length > 0) {
      // Show caught screen if any players were just caught
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        bossResults: [...prev.bossResults, ...newBossResults],
        screen: 'caught',
        newlyCaughtPlayers: newlyCaughtPlayers
      }));
    } else {
      // Continue playing - no players caught this round
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        bossResults: [...prev.bossResults, ...newBossResults],
        screen: 'progress'
      }));
    }
  };

  const handleContinueFromCaught = () => {
    // Continue to progress screen (for partial catches)
    setGameState(prev => ({
      ...prev,
      screen: 'progress'
    }));
  };

  const handlePlayAgainFromCaught = async () => {
    // Save round to backend before resetting
    await saveRoundToBackend();
    
    // Reset game and go to setup screen (when all players caught)
    currentUser = null;
    setGameState({
      screen: 'setup',
      difficulty: null,
      currentHole: 1,
      totalHoles: 9,
      players: [],
      bossResults: [],
      shuffledBosses: [],
      gameComplete: false,
      isVictory: false,
      failedAtHole: undefined,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: [],
      currentChallenge: undefined
    });
  };

  const handleReturnHomeFromCaught = async () => {
    // Save round to backend before resetting
    await saveRoundToBackend();
    
    // Reset game and return to home screen
    currentUser = null;
    
    // Force home screen to remount and reload data
    setHomeScreenKey(prev => prev + 1);
    
    setGameState({
      screen: 'home',
      difficulty: null,
      currentHole: 1,
      totalHoles: 9,
      players: [],
      bossResults: [],
      shuffledBosses: [],
      gameComplete: false,
      isVictory: false,
      failedAtHole: undefined,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: []
    });
  };

  const handleContinue = () => {
    const nextHole = gameState.currentHole + 1;
    
    // Check if we've completed all holes (victory condition)
    if (nextHole > gameState.totalHoles) {
      setGameState(prev => ({
        ...prev,
        screen: 'summary',
        gameComplete: true,
        isVictory: true
      }));
    } else {
      // Move to next boss, reset current challenge
      setGameState(prev => ({
        ...prev,
        currentHole: nextHole,
        screen: 'boss',
        currentChallenge: undefined
      }));
    }
  };

  const handleLoginSuccess = (accessToken: string, userId: string) => {
    setAuthState({ accessToken, userId });
    setGameState(prev => ({ ...prev, screen: 'home' }));
  };

  const handleSignupSuccess = () => {
    // After successful signup, go to login
    setGameState(prev => ({ ...prev, screen: 'login' }));
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setAuthState({ accessToken: null, userId: null });
      setGameState(prev => ({ ...prev, screen: 'login' }));
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setAuthState({ accessToken: null, userId: null });
      setGameState(prev => ({ ...prev, screen: 'login' }));
    }
  };

  const handleStartRound = async (userProfile: UserProfile) => {
    // Refresh session to get valid access token before starting round
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error("Session refresh error:", error);
        // Session invalid, log user out
        await handleLogout();
        return;
      }
      
      // Update auth state with fresh token
      setAuthState({
        accessToken: session.access_token,
        userId: session.user.id
      });
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
    
    setCurrentUserProfile(userProfile);
    setGameState(prev => ({ ...prev, screen: 'setup' }));
  };

  const handleGetStarted = () => {
    setGameState(prev => ({
      ...prev,
      screen: 'setup'
    }));
  };

  const clearActiveRound = async () => {
    try {
      // Get fresh session token to avoid 401 errors
      const supabase = getSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error when clearing active round:", sessionError);
        return;
      }
      
      if (!session?.access_token) {
        console.error("No valid session when clearing active round");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/active-round`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to clear active round, status:", response.status, errorText);
      } else {
        console.log("Active round cleared successfully");
      }
    } catch (error) {
      console.error("Failed to clear active round:", error);
    }
  };

  const saveRoundToBackend = async () => {
    try {
      // Get fresh session token
      const supabase = getSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.error("No valid session when saving round:", sessionError);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/save-round`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            isVictory: gameState.isVictory,
            difficulty: gameState.difficulty,
            totalHoles: gameState.totalHoles,
            players: gameState.players,
            bossResults: gameState.bossResults,
            completedAt: new Date().toISOString(),
            course: gameState.course || null,
            skippedBosses: gameState.skippedBosses
          }),
        }
      );

      const data = await response.json();
      
      // Check if player ranked up
      if (data.rankUp && data.newLevel && data.newRankName) {
        setRankUpInfo({
          level: data.newLevel,
          rankName: data.newRankName
        });
      }

      // Clear the in-progress round after saving
      await clearActiveRound();
    } catch (error) {
      console.error("Failed to save round:", error);
    }
  };

  const handlePlayAgain = async () => {
    // Save round to backend before resetting
    await saveRoundToBackend();
    
    currentUser = null;
    
    setGameState({
      screen: 'setup',
      difficulty: null,
      currentHole: 1,
      totalHoles: 9,
      players: [],
      bossResults: [],
      shuffledBosses: [],
      gameComplete: false,
      isVictory: false,
      failedAtHole: undefined,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: [],
      currentChallenge: undefined
    });
  };

  const handleReturnHomeFromSummary = async () => {
    // Save round to backend before resetting
    await saveRoundToBackend();
    
    // Reset game and return to home screen
    currentUser = null;
    
    // Force home screen to remount and reload data
    setHomeScreenKey(prev => prev + 1);
    
    setGameState({
      screen: 'home',
      difficulty: null,
      currentHole: 1,
      totalHoles: 9,
      players: [],
      bossResults: [],
      shuffledBosses: [],
      gameComplete: false,
      isVictory: false,
      failedAtHole: undefined,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: [],
      currentChallenge: undefined
    });
  };

  const handleExitRound = async () => {
    currentUser = null;
    
    // Clear active round from backend BEFORE changing screen
    await clearActiveRound();
    
    // Small delay to ensure backend state is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force home screen to remount and reload data
    setHomeScreenKey(prev => prev + 1);
    
    setGameState({
      screen: 'home',
      difficulty: null,
      currentHole: 1,
      totalHoles: 9,
      players: [],
      bossResults: [],
      shuffledBosses: [],
      gameComplete: false,
      isVictory: false,
      failedAtHole: undefined,
      skipsRemaining: 3,
      skippedBosses: [],
      usedChallenges: [],
      currentChallenge: undefined
    });
  };

  const handleSkipChallenge = (usedChallenge: string) => {
    // Only allow skip if skips remain and boss hasn't been skipped
    if (gameState.skipsRemaining > 0 && !gameState.skippedBosses.includes(currentBoss.name)) {
      setGameState(prev => ({
        ...prev,
        skipsRemaining: prev.skipsRemaining - 1,
        skippedBosses: [...prev.skippedBosses, currentBoss.name],
        usedChallenges: [...prev.usedChallenges, usedChallenge]
      }));
    }
  };

  // Get current boss from shuffled array, cycling through if needed
  const currentBoss = gameState.shuffledBosses.length > 0 
    ? gameState.shuffledBosses[(gameState.currentHole - 1) % gameState.shuffledBosses.length]
    : bosses[0]; // Fallback to first boss if shuffled array is empty

  // Show loading screen while images are preloading OR session is being checked
  if (!showApp) {
    // Calculate combined progress: 80% for images, 20% for session check
    const imageProgress = loadProgress * 0.8;
    const sessionProgress = sessionChecked ? 20 : 0;
    const totalProgress = Math.min(100, Math.round(imageProgress + sessionProgress));

    return (
      <div className="min-h-screen bg-[#cee7bd] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[382px] flex flex-col items-center gap-6">
          {/* Logo or Title */}
          <h1 className="text-[#517b34] text-center">
            Hooky Golf
          </h1>
          
          {/* Loading Progress */}
          <div className="w-full">
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden border border-[#517b34]">
              <div 
                className="h-full bg-[#517b34] transition-all duration-300 ease-out"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="font-['Geologica:Regular',_sans-serif] text-center text-[#282828] text-[14px] mt-3" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {!imagesPreloaded && 'Loading assets...'}
              {imagesPreloaded && !sessionChecked && 'Checking session...'}
              {imagesPreloaded && sessionChecked && 'Ready!'}
              {' '}{totalProgress}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ minHeight: '100vh', minHeight: '100dvh' }}>
      {/* Standalone Mode Checker - Shows warning on iOS if not installed */}
      <StandaloneModeChecker />
      
      {/* Hidden image preloader */}
      <ImagePreloader />
      
      {gameState.screen === 'login' && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onSignupClick={() => setGameState(prev => ({ ...prev, screen: 'signup' }))}
        />
      )}

      {gameState.screen === 'signup' && (
        <SignupScreen 
          onSignupSuccess={handleSignupSuccess}
          onLoginClick={() => setGameState(prev => ({ ...prev, screen: 'login' }))}
        />
      )}

      {gameState.screen === 'home' && authState.accessToken && (
        <AuthenticatedHomeScreen 
          key={homeScreenKey}
          accessToken={authState.accessToken}
          onStartRound={handleStartRound}
          onLogout={handleLogout}
        />
      )}

      {gameState.screen === 'intro' && (
        <IntroScreen onGetStarted={handleGetStarted} />
      )}
      
      {gameState.screen === 'setup' && (
        <GameSetupScreen 
          onStartGame={handleStartGame} 
          onExitToHome={handleExitRound}
          currentUser={currentUserProfile}
          accessToken={authState.accessToken || undefined}
        />
      )}
      
      {gameState.screen === 'boss' && currentBoss && (
        <BossIntroScreen
          hole={gameState.currentHole}
          boss={currentBoss}
          onContinue={handleBossContinue}
          onExitRound={handleExitRound}
          playerCount={gameState.players.length}
          skipsRemaining={gameState.skipsRemaining}
          hasSkippedThisBoss={gameState.skippedBosses.includes(currentBoss.name)}
          onSkipChallenge={handleSkipChallenge}
          usedChallenges={gameState.usedChallenges}
        />
      )}
      
      {gameState.screen === 'results' && currentBoss && (
        <BossResultsScreen
          hole={gameState.currentHole}
          boss={currentBoss}
          players={gameState.players}
          onSubmitResults={handleSubmitResults}
          onExitRound={handleExitRound}
          currentChallenge={gameState.currentChallenge}
          playerCount={gameState.players.length}
        />
      )}
      
      {gameState.screen === 'caught' && gameState.newlyCaughtPlayers && (
        <PlayerCaughtScreen
          caughtPlayers={gameState.newlyCaughtPlayers}
          allPlayersCaught={gameState.gameComplete && !gameState.isVictory}
          onContinue={handleContinueFromCaught}
          onPlayAgain={handlePlayAgainFromCaught}
          onReturnHome={handleReturnHomeFromCaught}
        />
      )}
      
      {gameState.screen === 'progress' && (
        <TeamProgressScreen
          players={gameState.players}
          bossResults={gameState.bossResults}
          bosses={bosses}
          currentHole={gameState.currentHole}
          totalHoles={gameState.totalHoles}
          onContinue={handleContinue}
          onExitRound={handleExitRound}
        />
      )}
      
      {gameState.screen === 'summary' && (
        <EndRoundSummaryScreen
          isVictory={gameState.isVictory}
          failedAtHole={gameState.failedAtHole}
          players={gameState.players}
          bossResults={gameState.bossResults}
          bosses={gameState.shuffledBosses}
          skippedBosses={gameState.skippedBosses}
          difficulty={gameState.difficulty || undefined}
          totalHoles={gameState.totalHoles}
          onPlayAgain={handlePlayAgain}
          onReturnHome={handleReturnHomeFromSummary}
        />
      )}

      {/* Rank Up Modal */}
      {rankUpInfo && (
        <RankUpModal
          isOpen={!!rankUpInfo}
          onClose={() => setRankUpInfo(null)}
          level={rankUpInfo.level}
          rankName={rankUpInfo.rankName}
        />
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}