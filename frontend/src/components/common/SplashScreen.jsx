import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// SVG Food Icons (extremely subtle backdrop details)
const PizzaIcon = () => (
  <svg className="w-10 h-10 text-yellow-500/60 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 22c2-2 18-2 20 0" />
    <circle cx="12" cy="11" r="1.5" className="fill-current" />
    <circle cx="9" cy="16" r="1" className="fill-current" />
    <circle cx="15" cy="15" r="1" className="fill-current" />
  </svg>
);

const BurgerIcon = () => (
  <svg className="w-10 h-10 text-amber-600/60 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0-4 4-7 9-7s9 3 9 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 14c2-1 4 1 6-1s4 1 6-1 4 1 6-1" />
    <rect x="3" y="15" width="18" height="2" rx="0.5" className="fill-current" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const DrinkIcon = () => (
  <svg className="w-10 h-10 text-rose-500/60 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l1.5 12A2 2 0 009.5 22h5a2 2 0 002-1.8L18 8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M9 5h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l2-3h2" />
  </svg>
);

const DonutIcon = () => (
  <svg className="w-10 h-10 text-pink-500/60 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 5v1M7 10l1 .5M17 10l-1 .5M10 16.5l.5 1M14 16.5l-.5 1" strokeLinecap="round" />
  </svg>
);

const ChefHatIcon = () => (
  <svg className="w-10 h-10 text-emerald-500/60 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 18a4 4 0 01-1-7.87 5 5 0 019.8-1.5 5 5 0 013.2 9.37" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18v2a1 1 0 001 1h8a1 1 0 001-1v-2" />
  </svg>
);

// Scooter SVG
const ScooterSVG = ({ isVibrating = true, isSpinning = true }) => (
  <div className={`w-[90px] h-[72px] ${isVibrating ? 'animate-scooter-vibe' : ''}`}>
    <svg width="100%" height="100%" viewBox="0 0 140 110" className="w-full h-full">
      {/* Steam rising from thermal box */}
      {isVibrating && (
        <g>
          <path d="M 20 25 Q 17 15 22 8" className="stroke-rose-400/40 stroke-2 fill-none animate-steam-1" strokeLinecap="round" />
          <path d="M 28 27 Q 26 18 30 10" className="stroke-rose-400/20 stroke-2 fill-none animate-steam-2" strokeLinecap="round" />
        </g>
      )}

      {/* Wheels */}
      {/* Rear Wheel */}
      <g className={isSpinning ? 'animate-wheel-spin' : ''} style={{ transformOrigin: '35px 85px' }}>
        <circle cx="35" cy="85" r="16" className="stroke-gray-600 stroke-[5] fill-none" />
        <circle cx="35" cy="85" r="10" className="stroke-gray-400 stroke-2 stroke-dasharray-[2_4] fill-none" />
        <line x1="35" y1="69" x2="35" y2="101" className="stroke-gray-500 stroke-2" />
        <line x1="19" y1="85" x2="51" y2="85" className="stroke-gray-500 stroke-2" />
        <circle cx="35" cy="85" r="4" className="fill-gray-600" />
      </g>

      {/* Front Wheel */}
      <g className={isSpinning ? 'animate-wheel-spin' : ''} style={{ transformOrigin: '105px 85px' }}>
        <circle cx="105" cy="85" r="16" className="stroke-gray-600 stroke-[5] fill-none" />
        <circle cx="105" cy="85" r="10" className="stroke-gray-400 stroke-2 stroke-dasharray-[2_4] fill-none" />
        <line x1="105" y1="69" x2="105" y2="101" className="stroke-gray-500 stroke-2" />
        <line x1="89" y1="85" x2="121" y2="85" className="stroke-gray-500 stroke-2" />
        <circle cx="105" cy="85" r="4" className="fill-gray-600" />
      </g>

      {/* Mudguards */}
      <path d="M 20 80 Q 20 65 35 65 Q 50 65 50 80" className="fill-rose-500" />
      <path d="M 90 80 Q 95 65 110 65 Q 120 70 120 80" className="fill-rose-500" />
      
      {/* Main Frame connection */}
      <path d="M 35 85 L 75 85 L 95 55 L 105 85" className="stroke-gray-800 stroke-[5] fill-none" strokeLinecap="round" />

      {/* Scooter Deck & Front Shield */}
      <path d="M 45 80 L 80 80 L 98 45 L 95 38" className="stroke-rose-500 stroke-[7] fill-none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Headlight */}
      <circle cx="99" cy="42" r="5" className="fill-yellow-300" />
      {isSpinning && <polygon points="99,39 135,32 135,52 99,45" className="fill-yellow-200/10" />}

      {/* Handle bar */}
      <line x1="95" y1="38" x2="88" y2="28" className="stroke-gray-600 stroke-4" strokeLinecap="round" />
      <circle cx="88" cy="28" r="3" className="fill-gray-800" />

      {/* Delivery Thermal Box */}
      <rect x="12" y="32" width="34" height="34" rx="4" className="fill-gray-800 stroke-rose-500 stroke-[1.5]" />
      <circle cx="29" cy="49" r="8" className="fill-rose-500/10 stroke-rose-400 stroke-[1.5]" />
      <path d="M 27 45 L 27 53 M 31 45 L 31 53 M 29 45 L 29 53" className="stroke-rose-400 stroke-[1.5]" />

      {/* Rider Torso */}
      <path d="M 48 70 L 68 45 L 85 45" className="stroke-rose-500 stroke-[10] fill-none" strokeLinecap="round" />
      {/* Arm */}
      <path d="M 68 45 L 84 34 L 88 28" className="stroke-rose-500 stroke-3 fill-none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Head */}
      <circle cx="75" cy="30" r="8" className="fill-rose-200" />
      {/* Helmet */}
      <path d="M 66 28 C 66 18, 84 18, 84 28 Z" className="fill-orange-500" />
      {/* Visor */}
      <path d="M 76 24 L 83 24 L 81 29 Z" className="fill-gray-800" />
    </svg>
  </div>
);

// Moving Dashed Road SVG
const RoadSVG = ({ isMoving = true }) => (
  <svg width="100%" height="16" className="w-full overflow-visible">
    <line x1="0" y1="8" x2="100%" y2="8" className="stroke-gray-800 stroke-[2.5]" strokeLinecap="round" />
    <line
      x1="0"
      y1="8"
      x2="100%"
      y2="8"
      className={`stroke-gray-600 stroke-[1.5] stroke-dasharray-[10_25] ${isMoving ? 'animate-road-move' : ''}`}
      strokeLinecap="round"
    />
  </svg>
);

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(1);
  const [stage, setStage] = useState('logo'); // 'logo' (0-0.5s) | 'delivery' (0.5s-2.0s) | 'complete' (2.0s-2.5s)

  useEffect(() => {
    // Stage 1: Initial state duration (0-0.5s)
    const logoTimer = setTimeout(() => {
      setStage('delivery');
    }, 500);

    // Stage 3: Complete delivery (2.0s onwards)
    const completeTimer = setTimeout(() => {
      setStage('complete');
    }, 2000);

    // Fade out completely after 2.5s
    const endTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Handle the count animation from 1 to 100 over 1.5 seconds (0.5s - 2.0s)
  useEffect(() => {
    if (stage !== 'delivery') return;

    const start = performance.now();
    const duration = 1500; // 1.5s
    let frameId;

    const update = (now) => {
      const elapsed = now - start;
      const pct = Math.min(1, elapsed / duration);
      const val = Math.floor(pct * 99) + 1; // 1 to 100
      setProgress(val);

      if (pct < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setProgress(100);
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [stage]);

  // Determine message based on progress
  const getStatusMessage = () => {
    if (stage === 'logo') return 'Preparing your delicious experience...';
    if (stage === 'complete') return 'Delivered! Enjoy your meal! 🎉';
    
    if (progress < 45) return 'Preparing your delicious experience...';
    if (progress < 85) return 'Your food is on the way...';
    return 'Almost ready...';
  };

  // Positions for floating food icons (very subtle backdrops)
  const foodFloatingConfig = [
    { component: <PizzaIcon />, initialX: '12%', initialY: '20%', duration: 6, delay: 0.2 },
    { component: <BurgerIcon />, initialX: '85%', initialY: '18%', duration: 7, delay: 0.5 },
    { component: <DrinkIcon />, initialX: '80%', initialY: '70%', duration: 6.5, delay: 0.1 },
    { component: <DonutIcon />, initialX: '15%', initialY: '75%', duration: 7.5, delay: 0.3 },
    { component: <ChefHatIcon />, initialX: '50%', initialY: '12%', duration: 6.8, delay: 0.7 }
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden p-8 bg-gradient-to-tr from-[#020617] via-[#0b0f19] to-[#0f172a] text-white"
    >
      {/* Floating Speed Lines (extremely subtle wind) */}
      {stage === 'delivery' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="absolute h-[1.5px] w-[50px] bg-rose-500 rounded-full left-[60%] top-[45%] animate-speed-line-1" />
          <div className="absolute h-[1.5px] w-[70px] bg-orange-500 rounded-full left-[15%] top-[60%] animate-speed-line-2" />
          <div className="absolute h-[1.5px] w-[40px] bg-yellow-500 rounded-full left-[75%] top-[75%] animate-speed-line-3" />
        </div>
      )}

      {/* Floating Food Icons (Very low opacity background noise) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {foodFloatingConfig.map((item, idx) => (
          <motion.div
            key={idx}
            style={{ position: 'absolute', left: item.initialX, top: item.initialY }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: stage === 'complete' ? 0.12 : 0.05,
              scale: stage === 'complete' ? 0.9 : 0.75,
              y: [0, -12, 0],
              rotate: [0, 8, -8, 0]
            }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { type: 'spring', stiffness: 100, damping: 15 },
              y: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
              rotate: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay }
            }}
            className="filter drop-shadow-sm"
          >
            {item.component}
          </motion.div>
        ))}
      </div>

      {/* Center Delivery Animation Zone */}
      <div className="w-full max-w-md flex flex-col justify-center items-center z-10 px-6">
        {/* The Path with Scooter */}
        <div className="w-full relative h-24 flex items-end mb-6">
          {/* Scooter Position Container */}
          <div
            className="absolute bottom-1 transition-all duration-75 ease-linear"
            style={{
              left: stage === 'logo' 
                ? '10%' 
                : stage === 'complete' 
                ? '85%' 
                : `calc(10% + ${progress * 0.75}%)`,
              transform: 'translateX(-50%)'
            }}
          >
            <ScooterSVG 
              isVibrating={stage === 'delivery'} 
              isSpinning={stage === 'delivery'} 
            />
          </div>

          {/* Road */}
          <div className="w-full">
            <RoadSVG isMoving={stage === 'delivery'} />
          </div>
        </div>

        {/* Loading details */}
        <div className="w-full flex flex-col items-center gap-3">
          {/* Modern Thinner Progress bar */}
          <div className="w-full h-[4px] bg-gray-900 rounded-full overflow-hidden relative border border-gray-800/40">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 via-rose-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              style={{
                width: stage === 'logo' ? '1%' : `${progress}%`
              }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Status Message and modern Percentage */}
          <div className="w-full flex justify-between items-center text-xs text-gray-400 mt-0.5 px-0.5">
            <motion.div
              key={getStatusMessage()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="font-medium text-gray-300 min-h-[16px]"
            >
              {getStatusMessage()}
            </motion.div>
            <div className="font-display font-bold tabular-nums text-sm bg-gray-900/60 text-orange-400 px-2 py-0.5 rounded border border-gray-800/80">
              {stage === 'logo' ? '1' : progress}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
