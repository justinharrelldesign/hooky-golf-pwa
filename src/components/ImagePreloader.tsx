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

/**
 * ImagePreloader - Preloads all boss images to ensure smooth gameplay
 * Uses hidden img tags to trigger browser preloading
 */
export function ImagePreloader() {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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
      <img src={logoImg} alt="" />
      <img src={bossesCaughtImg} alt="" />
    </div>
  );
}
