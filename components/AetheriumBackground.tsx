import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const AetheriumBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  // Initialize mouse values at center of viewport
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth fluid trailing
  const springPrimary = { damping: 35, stiffness: 100, mass: 0.6 };
  const springFluid = { damping: 55, stiffness: 60, mass: 1.2 };
  const springGrid = { damping: 80, stiffness: 30 };

  const xPrimary = useSpring(mouseX, springPrimary);
  const yPrimary = useSpring(mouseY, springPrimary);

  const xFluid = useSpring(mouseX, springFluid);
  const yFluid = useSpring(mouseY, springFluid);

  const xGrid = useSpring(mouseX, springGrid);
  const yGrid = useSpring(mouseY, springGrid);

  // Warp effects for grid skew and subtle parallax translations
  const gridSkewX = useTransform(xGrid, [0, 1920], [-4, 4]);
  const gridSkewY = useTransform(yGrid, [0, 1080], [-3, 3]);
  const parallaxX = useTransform(xGrid, [0, 1920], [-15, 15]);
  const parallaxY = useTransform(yGrid, [0, 1080], [-10, 10]);

  // Transform values for organic geo-orbs and grid offset
  const orbTransformX = useTransform(xGrid, [0, 1920], [10, -10]);
  const orbTransformY = useTransform(yGrid, [0, 1080], [15, -15]);
  const bgTransformX = useTransform(xGrid, [0, 1920], [-10, 10]);
  const bgTransformY = useTransform(yGrid, [0, 1080], [-8, 8]);

  useEffect(() => {
    setMounted(true);
    // Set initial position to browser center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* Dynamic Ambient Spotlights Layout (Vaporized energy glow) */}
      <div className="absolute inset-0 mix-blend-screen opacity-40">
        
        {/* Prime Node Tracking - Emerald/Green Glow */}
        <motion.div
          className="absolute rounded-full w-[45vw] h-[45vw] bg-emerald-500/5 blur-[120px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: xPrimary,
            top: yPrimary,
          }}
        />

        {/* Trail Node Tracking - Cyan / Ocean Flow */}
        <motion.div
          className="absolute rounded-full w-[35vw] h-[35vw] bg-cyan-500/5 blur-[100px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: xFluid,
            top: yFluid,
          }}
        />

        {/* Outer Halo Tracking - Violet Aura */}
        <motion.div
          className="absolute rounded-full w-[60vw] h-[60vw] bg-violet-600/[0.03] blur-[150px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: xFluid,
            top: yFluid,
          }}
        />
      </div>

      {/* Floating Organic Geo-Orbs */}
      <div className="absolute inset-0 opacity-15">
        <motion.div
          className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full border border-emerald-500/10"
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute right-1/4 top-1/3 w-48 h-48 rounded-full border border-cyan-500/5 flex items-center justify-center"
          style={{
            x: orbTransformX,
            y: orbTransformY,
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-40 h-40 rounded-full border border-dashed border-violet-500/5" />
        </motion.div>
      </div>

      {/* Warping Cyber-Mesh Pattern Overlay */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{
          skewX: gridSkewX,
          skewY: gridSkewY,
          x: bgTransformX,
          y: bgTransformY,
        }}
      >
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle, rgba(16,185,129,0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
      </motion.div>

      {/* Interactive horizontal scanner laser trace (very subtle ambient lines) */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden opacity-[0.04]">
        <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{
            y: ['0vh', '100vh']
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent"
          animate={{
            y: ['100vh', '0vh']
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

    </div>
  );
};

export default AetheriumBackground;
