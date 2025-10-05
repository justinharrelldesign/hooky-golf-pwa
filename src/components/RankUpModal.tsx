import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion } from "motion/react";
import rookieBadgeImg from "figma:asset/1c0dad141c87b516c36d4b1fffa7a1fa6f2ce597.png";
import amateurBadgeImg from "figma:asset/81eacdab71ec68a0fb838be98711c108f95a6764.png";
import noviceBadgeImg from "figma:asset/08956f0cc4fccf953ff553805602c0eb12ddc831.png";
import prodigyBadgeImg from "figma:asset/f74f5f048e39641ac0888bd437f5f75a8045c920.png";
import expertBadgeImg from "figma:asset/061959b386d8a5784d01c2082709a07ed31c2099.png";
import legendBadgeImg from "figma:asset/b3b2b989c80a0df3822b4ed43eb2eed4fab0c612.png";
import heroBadgeImg from "figma:asset/a598caf9369222a527cea4a373bdfd89af4ba6a1.png";
import godBadgeImg from "figma:asset/fa33a8e840f031f26c729f60f907ea4f391f7c07.png";
import rankBadgeImg from "figma:asset/8c97451aa7eab202d33fde2be44dda8fa75f62a7.png";

interface RankUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  rankName: string;
}

export function RankUpModal({ isOpen, onClose, level, rankName }: RankUpModalProps) {
  const getBadgeImage = (level: number) => {
    switch (level) {
      case 1: return rookieBadgeImg;
      case 2: return amateurBadgeImg;
      case 3: return noviceBadgeImg;
      case 4: return prodigyBadgeImg;
      case 5: return expertBadgeImg;
      case 6: return legendBadgeImg;
      case 7: return heroBadgeImg;
      case 8: return godBadgeImg;
      default: return rankBadgeImg;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#cee7bd] border-2 border-[#517b34] max-w-[90vw] w-[380px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Rank Up!</DialogTitle>
        <DialogDescription className="sr-only">
          You've reached a new rank level and unlocked new achievements in Hooky Golf.
        </DialogDescription>
        
        <div className="relative p-8 flex flex-col items-center gap-6">
          {/* Celebration background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#517b34]/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center relative z-10"
          >
            <h2 className="luckiest-guy text-[#517b34] text-[32px] leading-[1.2] mb-2">
              Rank Up!
            </h2>
            <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Congratulations on your promotion!
            </p>
          </motion.div>

          {/* Badge with animation */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <div className="size-[160px] relative">
              <motion.div
                className="absolute inset-0 bg-[#517b34]/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <img 
                src={getBadgeImage(level)} 
                alt={`${rankName} badge`}
                className="size-full object-contain relative z-10"
              />
            </div>
          </motion.div>

          {/* Rank info */}
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="font-['Geologica:Bold',_sans-serif] text-[#282828] text-[18px] mb-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Level {level}
            </p>
            <p className="luckiest-guy text-[#517b34] text-[28px] leading-[1.2]">
              {rankName}
            </p>
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={onClose}
            className="btn-primary text-white px-8 py-3 rounded-full relative z-10 font-['Geologica:Bold',_sans-serif] text-[16px]"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
