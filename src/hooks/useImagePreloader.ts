import { useState, useEffect } from 'react';
import secretarySarahImg from "figma:asset/da606b15aaafe7911ca9e1be31b9011a11616444.png";
import deadlineDanImg from "figma:asset/639913f4590217518f4a29a4f9cc4bfc94bde609.png";
import cubicalChuckImg from "figma:asset/88d4ac832cde727bb6ce70e63518f7d9460b6fae.png";
import coffeeBreathKarenImg from "figma:asset/0cb85757b9ceba4d82522da1b60933c8a40fb2e5.png";
import gumSmackerStaceyImg from "figma:asset/05b9ab854e1d69de46cf06658c5c9365d280d4b2.png";
import replyAllRebeccaImg from "figma:asset/1d0b13e3e884f69508ae1819b92e7061b4df5a6b.png";
import lunchBanditBarbImg from "figma:asset/30b9f5a045cd191b57005ecc8177bbdc0ef0d43c.png";
import hrRandyImg from "figma:asset/36d54dcbf13c11a43b31ff102ad3d5610d314599.png";
import ibbBrianImg from "figma:asset/257133d885eb6d6f7e93e1e8e829dbac0299c9a6.png";
import janitorJerryImg from "figma:asset/c2a4d4774071bda822f36da11ba7bac792895c71.png";
import itLordLeonardImg from "figma:asset/91b6e581832895955629438cad630af81fc8e271.png";
import sweatyStanImg from "figma:asset/860e3ef3c71304f24c8de304a36e1d94e7b9dff4.png";
import loudLouiseImg from "figma:asset/a4d63fb045927dc52d8d5f380de662d53bd3f1db.png";
import awfulOfficeCoupleImg from "figma:asset/42b256c1f0c0fc042cef8d402a041a8fb7473125.png";
import smokeBreakSteveImg from "figma:asset/f6c69b0ebd60e291018ba93006b91f2aade891c7.png";
import wheelieBagWendyImg from "figma:asset/192a05458036112f4c6abb6a37675ddaa22e4cb3.png";
import happyHourHankImg from "figma:asset/ce1a18758397c1af669651b01fcda2ce2f7b035d.png";
import bikeCommuteBrandonImg from "figma:asset/57fce1270342241e056c8e48e2ed078e3b7e0dcb.png";
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

// List of all images to preload for smooth gameplay
const bossImages = [
  // Boss images
  secretarySarahImg,
  deadlineDanImg,
  cubicalChuckImg,
  coffeeBreathKarenImg,
  gumSmackerStaceyImg,
  replyAllRebeccaImg,
  lunchBanditBarbImg,
  hrRandyImg,
  ibbBrianImg,
  janitorJerryImg,
  itLordLeonardImg,
  sweatyStanImg,
  loudLouiseImg,
  awfulOfficeCoupleImg,
  smokeBreakSteveImg,
  wheelieBagWendyImg,
  happyHourHankImg,
  bikeCommuteBrandonImg,
  
  // UI images
  logoImg,
  homeLogoImg,
  bossesCaughtImg,
  defaultAvatarImg,
  beerMugImg,
  hatImg,
  golfCourseBackgroundImg,
  
  // Rank badges
  rookieBadgeImg,
  amateurBadgeImg,
  noviceBadgeImg,
  prodigyBadgeImg,
  expertBadgeImg,
  legendBadgeImg,
  heroBadgeImg,
  godBadgeImg,
  rankBadgeImg
];

export function useImagePreloader() {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = bossImages.length;

    const imagePromises = bossImages.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          // Still count as loaded even if error to prevent hanging
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesPreloaded(true);
    });
  }, []);

  return { imagesPreloaded, loadProgress };
}
