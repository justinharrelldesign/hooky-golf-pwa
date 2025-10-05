import { motion } from "motion/react";
import { useMemo } from "react";

interface ConfettiBurstProps {
  particleCount?: number;
}

export function ConfettiBurst({ particleCount = 12 }: ConfettiBurstProps) {
  // Generate particles for both bursts
  const firstBurstParticles = useMemo(() => {
    const greenColor = "#517b34";
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (360 / particleCount) * i;
      const distance = 60 + Math.random() * 30;
      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance;
      const rotation = Math.random() * 1080 - 540;
      const delay = Math.random() * 0.15;
      const size = 2 + Math.random() * 2; // Smaller particles: 2-4px instead of 5-10px
      
      return {
        id: `first-${i}`,
        x,
        y,
        rotation,
        delay,
        size,
        color: greenColor
      };
    });
  }, [particleCount]);

  const secondBurstParticles = useMemo(() => {
    const greenColor = "#517b34";
    return Array.from({ length: particleCount }, (_, i) => {
      const angle = (360 / particleCount) * i + 180 / particleCount; // Offset angle for variation
      const distance = 55 + Math.random() * 25;
      const x = Math.cos((angle * Math.PI) / 180) * distance;
      const y = Math.sin((angle * Math.PI) / 180) * distance;
      const rotation = Math.random() * 1080 - 540;
      const delay = 0.4 + Math.random() * 0.15; // Delayed start for second burst
      const size = 2 + Math.random() * 2; // Smaller particles: 2-4px instead of 5-10px
      
      return {
        id: `second-${i}`,
        x,
        y,
        rotation,
        delay,
        size,
        color: greenColor
      };
    });
  }, [particleCount]);

  const allParticles = [...firstBurstParticles, ...secondBurstParticles];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
      {allParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full z-0"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: "50%",
            top: "50%",
            marginLeft: -particle.size / 2,
            marginTop: -particle.size / 2,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: [0, 1.2, 1, 0],
            opacity: [1, 1, 0.9, 0],
            rotate: particle.rotation,
          }}
          transition={{
            duration: 1.4,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}