import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BubblesBackground() {
  const bubbles = [
    { size: 120, baseColor: "#60A5FA" }, 
    { size: 160, baseColor: "#A78BFA" }, 
    { size: 100, baseColor: "#F472B6" }, 
    { size: 140, baseColor: "#FFFFFF" }, 
    { size: 180, baseColor: "#60A5FA" },
    { size: 100, baseColor: "#A78BFA" }, 
    { size: 140, baseColor: "#F472B6" }, 
    { size: 180, baseColor: "#FFFFFF" }, 
    { size: 100, baseColor: "#A78BFA" }, 
    { size: 100, baseColor: "#F472B6" }, 
    { size: 140, baseColor: "#FFFFFF" }, 
    { size: 160, baseColor: "#A78BFA" }, 
  ];

  const [positions, setPositions] = useState(
    bubbles.map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      scale: 1,
    }))
  );

  useEffect(() => {
    const speed = 1.2;

    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((b, i) => {
          let newX = b.x + b.dx * speed;
          let newY = b.y + b.dy * speed;

          if (newX <= 0 || newX >= window.innerWidth - bubbles[i].size) {
            b.dx *= -1;
          }
          if (newY <= 0 || newY >= window.innerHeight - bubbles[i].size) {
            b.dy *= -1;
          }

          const newScale = 1 + Math.sin(Date.now() / 1000 + i) * 0.05;

          return { ...b, x: newX, y: newY, dx: b.dx, dy: b.dy, scale: newScale };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-800 to-pink-300 ">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            top: 0,
            left: 0,
            translateX: positions[i].x,
            translateY: positions[i].y,
            scale: positions[i].scale,
            background: `radial-gradient(circle at 30% 30%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.4) 38%,
              ${b.baseColor}30 60%,
              transparent 100%)`,
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: `
              inset 0 2px 10px rgba(255,255,255,0.3),
              inset 0 -2px 6px rgba(0,0,0,0.1),
              0 4px 10px rgba(255,255,255,0.3)
            `,
            backdropFilter: "blur(10px)",
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
