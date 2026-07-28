import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Food Icons
const PizzaIcon = () => (
  <svg className="w-12 h-12 text-yellow-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 22c2-2 18-2 20 0" />
    <circle cx="12" cy="11" r="1.5" className="fill-current" />
    <circle cx="9" cy="16" r="1" className="fill-current" />
    <circle cx="15" cy="15" r="1" className="fill-current" />
  </svg>
);

const BurgerIcon = () => (
  <svg className="w-12 h-12 text-amber-600 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0-4 4-7 9-7s9 3 9 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 14c2-1 4 1 6-1s4 1 6-1 4 1 6-1" />
    <rect x="3" y="15" width="18" height="2.5" rx="1" className="fill-current" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const DrinkIcon = () => (
  <svg className="w-12 h-12 text-rose-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l1.5 12A2 2 0 009.5 22h5a2 2 0 002-1.8L18 8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M9 5h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l2-3h2" />
  </svg>
);

const DonutIcon = () => (
  <svg className="w-12 h-12 text-pink-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 5v1M7 10l1 .5M17 10l-1 .5M10 16.5l.5 1M14 16.5l-.5 1" strokeLinecap="round" />
  </svg>
);

const ChefHatIcon = () => (
  <svg className="w-12 h-12 text-emerald-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12M6 18a4 4 0 01-1-7.87 5 5 0 019.8-1.5 5 5 0 013.2 9.37" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18v2a1 1 0 001 1h8a1 1 0 001-1v-2" />
  </svg>
);

// Scooter SVG
const ScooterSVG = ({ isVibrating = true, isSpinning = true }) => (
  <div className={`w-[140px] h-[110px] ${isVibrating ? 'animate-scooter-vibe' : ''}`}>
    <svg width="140" height="110" viewBox="0 0 140 110" className="w-full h-full">
      {/* Steam rising from thermal box */}
      {isVibrating && (
        <g>
          <path d="M 20 25 Q 17 15 22 8" className="stroke-rose-400/60 stroke-2 fill-none animate-steam-1" strokeLinecap="round" />
          <path d="M 28 27 Q 26 18 30 10" className="stroke-rose-400/40 stroke-2 fill-none animate-steam-2" strokeLinecap="round" />
        </g>
      )}

      {/* Wheels */}
      {/* Rear Wheel */}
      <g className={isSpinning ? 'animate-wheel-spin' : ''} style={{ transformOrigin: '35px 85px' }}>
        <circle cx="35" cy="85" r="16" className="stroke-gray-700 dark:stroke-gray-600 stroke-[5] fill-none" />
        <circle cx="35" cy="85" r="10" className="stroke-gray-400 stroke-2 stroke-dasharray-[2_4] fill-none" />
        <line x1="35" y1="69" x2="35" y2="101" className="stroke-gray-500 stroke-2" />
        <line x1="19" y1="85" x2="51" y2="85" className="stroke-gray-500 stroke-2" />
        <circle cx="35" cy="85" r="4" className="fill-gray-700" />
      </g>

      {/* Front Wheel */}
      <g className={isSpinning ? 'animate-wheel-spin' : ''} style={{ transformOrigin: '105px 85px' }}>
        <circle cx="105" cy="85" r="16" className="stroke-gray-700 dark:stroke-gray-600 stroke-[5] fill-none" />
        <circle cx="105" cy="85" r="10" className="stroke-gray-400 stroke-2 stroke-dasharray-[2_4] fill-none" />
        <line x1="105" y1="69" x2="105" y2="101" className="stroke-gray-500 stroke-2" />
        <line x1="89" y1="85" x2="121" y2="85" className="stroke-gray-500 stroke-2" />
        <circle cx="105" cy="85" r="4" className="fill-gray-700" />
      </g>

      {/* Mudguards */}
      <path d="M 20 80 Q 20 65 35 65 Q 50 65 50 80" className="fill-rose-600" />
      <path d="M 90 80 Q 95 65 110 65 Q 120 70 120 80" className="fill-rose-600" />
      
      {/* Main Frame connection */}
      <path d="M 35 85 L 75 85 L 95 55 L 105 85" className="stroke-gray-800 dark:stroke-gray-900 stroke-[6] fill-none" strokeLinecap="round" />

      {/* Scooter Deck & Front Shield */}
      <path d="M 45 80 L 80 80 L 98 45 L 95 38" className="stroke-rose-600 stroke-[8] fill-none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Headlight */}
      <circle cx="99" cy="42" r="5" className="fill-yellow-300" />
      {isSpinning && <polygon points="99,39 135,32 135,52 99,45" className="fill-yellow-200/20" />}

      {/* Handle bar */}
      <line x1="95" y1="38" x2="88" y2="28" className="stroke-gray-700 stroke-4" strokeLinecap="round" />
      <circle cx="88" cy="28" r="3" className="fill-gray-900" />

      {/* Delivery Thermal Box */}
      <rect x="12" y="32" width="34" height="34" rx="4" className="fill-gray-800 stroke-rose-600 stroke-2" />
      <circle cx="29" cy="49" r="8" className="fill-rose-600/10 stroke-rose-500 stroke-2" />
      <path d="M 27 45 L 27 53 M 31 45 L 31 53 M 29 45 L 29 53" className="stroke-rose-500 stroke-[1.5]" />

      {/* Rider Torso */}
      <path d="M 48 70 L 68 45 L 85 45" className="stroke-rose-500 stroke-[12] fill-none" strokeLinecap="round" />
      {/* Arm */}
      <path d="M 68 45 L 84 34 L 88 28" className="stroke-rose-500 stroke-4 fill-none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Head */}
      <circle cx="75" cy="30" r="8" className="fill-rose-200" />
      {/* Helmet */}
      <path d="M 66 28 C 66 18, 84 18, 84 28 Z" className="fill-orange-500" />
      {/* Visor */}
      <path d="M 76 24 L 83 24 L 81 29 Z" className="fill-gray-900" />
    </svg>
  </div>
);

// Moving Dashed Road SVG
const RoadSVG = ({ isMoving = true }) => (
  <svg width="100%" height="20" className="w-full overflow-visible">
    <line x1="0" y1="10" x2="100%" y2="10" className="stroke-gray-300 dark:stroke-dark-700 stroke-[4]" strokeLinecap="round" />
    <line
      x1="0"
      y1="10"
      x2="100%"
      y2="10"
      className={`stroke-white dark:stroke-dark-900 stroke-[2] stroke-dasharray-[12_28] ${isMoving ? 'animate-road-move' : ''}`}
      strokeLinecap="round"
    />
  </svg>
);

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(1);
  const [stage, setStage] = useState('logo'); // 'logo' (0-2s) | 'delivery' (2-7s) | 'complete' (7-8s)

  useEffect(() => {
    // Stage 1: Logo & initial state (0-2s)
    const logoTimer = setTimeout(() => {
      setStage('delivery');
    }, 2000);

    // Stage 3: Complete delivery (7s onwards)
    const completeTimer = setTimeout(() => {
      setStage('complete');
    }, 7000);

    // Fade out completely after 8s
    const endTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Handle the count animation from 1 to 100 over 5 seconds (2s - 7s)
  useEffect(() => {
    if (stage !== 'delivery') return;

    const start = performance.now();
    const duration = 5000; // 5000ms
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
    if (stage === 'logo') return 'Setting up kitchen...';
    if (stage === 'complete') return 'Delivered! Bon Appétit! 🎉';
    
    if (progress < 25) return 'Accepting your order... 🛒';
    if (progress < 50) return 'Chef is preparing delicious food... 🍳';
    if (progress < 75) return 'Packing your food in insulated thermal bag... 🎒';
    return 'Rider is speeding to your location... 🛵💨';
  };

  // Positions for floating food icons
  const foodFloatingConfig = [
    { component: <PizzaIcon />, initialX: '15%', initialY: '25%', duration: 4.5, delay: 0.2 },
    { component: <BurgerIcon />, initialX: '80%', initialY: '20%', duration: 5, delay: 0.5 },
    { component: <DrinkIcon />, initialX: '75%', initialY: '65%', duration: 4, delay: 0.1 },
    { component: <DonutIcon />, initialX: '20%', initialY: '70%', duration: 5.5, delay: 0.3 },
    { component: <ChefHatIcon />, initialX: '48%', initialY: '15%', duration: 4.8, delay: 0.7 }
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between items-center select-none overflow-hidden py-12 px-6 bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 transition-colors duration-500"
    >
      {/* Floating Speed Lines (background) */}
      {stage === 'delivery' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute h-[2px] w-[60px] bg-rose-400 dark:bg-rose-600 rounded-full left-[60%] top-[40%] animate-speed-line-1" />
          <div className="absolute h-[2px] w-[80px] bg-orange-400 dark:bg-orange-600 rounded-full left-[20%] top-[55%] animate-speed-line-2" />
          <div className="absolute h-[2px] w-[50px] bg-yellow-400 dark:bg-yellow-600 rounded-full left-[80%] top-[70%] animate-speed-line-3" />
        </div>
      )}

      {/* Floating Food Icons (background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {foodFloatingConfig.map((item, idx) => (
          <motion.div
            key={idx}
            style={{ position: 'absolute', left: item.initialX, top: item.initialY }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: stage === 'logo' ? 0.15 : stage === 'complete' ? 0.8 : 0.4,
              scale: stage === 'complete' ? 1.15 : 1,
              y: [0, -15, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { type: 'spring', stiffness: 200, damping: 10 },
              y: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
              rotate: { duration: item.duration + 1, repeat: Infinity, ease: 'easeInOut', delay: item.delay }
            }}
            className="filter drop-shadow-md"
          >
            {item.component}
          </motion.div>
        ))}
      </div>

      {/* Header / Logo section */}
      <div className="flex flex-col items-center mt-6 z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center gap-3"
        >
          {/* Logo SVG (fork/spoon and fire) */}
          <div className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 000 7H6" />
            </svg>
          </div>
          <span className="text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-orange-500 bg-clip-text text-transparent">
            FoodHub
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-dark-600 dark:text-dark-300 font-medium text-sm mt-2 tracking-widest uppercase"
        >
          Delivering Happiness
        </motion.p>
      </div>

      {/* Center Delivery Animation Zone */}
      <div className="w-full max-w-xl flex flex-col justify-center items-center my-auto z-10 px-4">
        {/* The Path with Scooter */}
        <div className="w-full relative h-36 flex items-end mb-8">
          {/* Scooter Position Container */}
          <div
            className="absolute bottom-2 transition-all duration-75 ease-linear"
            style={{
              left: stage === 'logo' 
                ? '10%' 
                : stage === 'complete' 
                ? '82%' 
                : `calc(10% + ${progress * 0.72}%)`,
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
        <div className="w-full flex flex-col items-center gap-4">
          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-dark-800 rounded-full overflow-hidden shadow-inner relative border border-gray-100 dark:border-dark-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-orange-500 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]"
              style={{
                width: stage === 'logo' ? '1%' : `${progress}%`
              }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Value and status updates */}
          <div className="w-full flex justify-between items-center text-sm font-semibold text-dark-700 dark:text-dark-300 px-1 mt-1">
            <motion.div
              key={getStatusMessage()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-primary-600 dark:text-primary-400 font-bold min-h-[20px]"
            >
              {getStatusMessage()}
            </motion.div>
            <div className="font-display tabular-nums text-lg bg-gray-100 dark:bg-dark-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-dark-700/60 shadow-sm text-orange-500">
              {stage === 'logo' ? '1' : progress}%
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding info */}
      <div className="text-center text-xs text-dark-400 dark:text-dark-500 font-medium z-10 select-none">
        Premium Food Delivery Experience &copy; {new Date().getFullYear()}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
