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
import logoImg from "figma:asset/1f93bfd3dadb5b5c5776c200078549369c5b84da.png";
import bossesCaughtImg from "figma:asset/99fe0dd55feba6e2153c6425f78487a2312d27f9.png";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import beerMugImg from "figma:asset/9781b2199d7f32c9bd03c0521544cad1dc8e0a6f.png";
import hatImg from "figma:asset/2aaac5198899e182e376567f848b1ec80c50d827.png";
import homeLogoImg from "figma:asset/ed23857f34d6f0a2a5b953c943f636d2775b57ff.png";
import golfCourseBackgroundImg from "figma:asset/86b080cdcf6fe77baed5e941eb1e5146b772ecec.png";
import rookieBadgeImg from "figma:asset/1c0dad141c87b516c36d4b1fffa7a1fa6f2ce597.png";
import amateurBadgeImg from "figma:asset/81eacdab71ec68a0fb838be98711c108f95a6764.png";
import noviceBadgeImg from "figma:asset/08956f0cc4fccf953ff553805602c0eb12ddc831.png";
import prodigyBadgeImg from "figma:asset/f74f5f048e39641ac0888bd437f5f75a8045c920.png";
import expertBadgeImg from "figma:asset/061959b386d8a5784d01c2082709a07ed31c2099.png";
import legendBadgeImg from "figma:asset/b3b2b989c80a0df3822b4ed43eb2eed4fab0c612.png";
import heroBadgeImg from "figma:asset/a598caf9369222a527cea4a373bdfd89af4ba6a1.png";
import godBadgeImg from "figma:asset/fa33a8e840f031f26c729f60f907ea4f391f7c07.png";
import rankBadgeImg from "figma:asset/8c97451aa7eab202d33fde2be44dda8fa75f62a7.png";

// PWA Icons
import icon120 from "figma:asset/8a64d62f859f6c0c8f7aeee1faf0fbefb5460f08.png";
import icon152 from "figma:asset/e54075820b77aabd7ca46d8900b4e990627c6641.png";
import icon180 from "figma:asset/9b2f7162fcb445faf67bee64bf97d8d5a6222bb9.png";
import icon192 from "figma:asset/83f3026cb6fc6961d7002cc9205423d2e14dedd4.png";
import icon512 from "figma:asset/794c0aa997366cb162d2a499bf728514939c0ac3.png";

/**
 * ImagePreloader - Preloads all boss images, UI assets, and PWA icons to ensure smooth gameplay
 * Uses hidden img tags to trigger browser preloading
 * Total assets: 49 (25 bosses + 7 UI + 8 badges + 5 PWA icons + 4 other)
 */
export function ImagePreloader() {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Boss images */}
      <img src={secretarySarahImg} alt="" />
      <img src={deadlineDanImg} alt="" />
      <img src={cubicalChuckImg} alt="" />
      <img src={coffeeBreathKarenImg} alt="" />
      <img src={gumSmackerStaceyImg} alt="" />
      <img src={replyAllRebeccaImg} alt="" />
      <img src={lunchBanditBarbImg} alt="" />
      <img src={hrRandyImg} alt="" />
      <img src={ibbBrianImg} alt="" />
      <img src={janitorJerryImg} alt="" />
      <img src={itLordLeonardImg} alt="" />
      <img src={sweatyStanImg} alt="" />
      <img src={loudLouiseImg} alt="" />
      <img src={awfulOfficeCoupleImg} alt="" />
      <img src={smokeBreakSteveImg} alt="" />
      <img src={wheelieBagWendyImg} alt="" />
      <img src={happyHourHankImg} alt="" />
      <img src={bikeCommuteBrandonImg} alt="" />
      <img src={brownNoserBenImg} alt="" />
      <img src={partyPlannerPennyImg} alt="" />
      <img src={officeSecuritySeanImg} alt="" />
      <img src={keyboardClickerKateImg} alt="" />
      <img src={patientZeroPaulieImg} alt="" />
      <img src={geriatricGertrudeImg} alt="" />
      <img src={rancidLunchRickImg} alt="" />
      
      {/* UI images */}
      <img src={logoImg} alt="" />
      <img src={homeLogoImg} alt="" />
      <img src={bossesCaughtImg} alt="" />
      <img src={defaultAvatarImg} alt="" />
      <img src={beerMugImg} alt="" />
      <img src={hatImg} alt="" />
      <img src={golfCourseBackgroundImg} alt="" />
      
      {/* Rank badges */}
      <img src={rookieBadgeImg} alt="" />
      <img src={amateurBadgeImg} alt="" />
      <img src={noviceBadgeImg} alt="" />
      <img src={prodigyBadgeImg} alt="" />
      <img src={expertBadgeImg} alt="" />
      <img src={legendBadgeImg} alt="" />
      <img src={heroBadgeImg} alt="" />
      <img src={godBadgeImg} alt="" />
      <img src={rankBadgeImg} alt="" />
      
      {/* PWA Icons - preload for instant appearance */}
      <img src={icon120} alt="" />
      <img src={icon152} alt="" />
      <img src={icon180} alt="" />
      <img src={icon192} alt="" />
      <img src={icon512} alt="" />
    </div>
  );
}
