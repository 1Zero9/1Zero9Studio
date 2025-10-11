'use client';

import { motion } from 'framer-motion';

export default function RocketAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      {/* Rocket body */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: [20, -5, 0],
          opacity: 1
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {/* Rocket SVG */}
        <svg 
          className="w-full h-full text-rocket-red drop-shadow-lg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2L13.5 8.5L20 7L14 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L10 12L4 7L10.5 8.5L12 2Z" />
        </svg>
      </motion.div>

      {/* Rocket trail/exhaust */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 0.7, 0],
          scale: [0, 1, 0],
          height: [0, 20, 0]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
      >
        <div className="w-3 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full blur-sm"></div>
      </motion.div>

      {/* Sparkles/stars */}
      <motion.div
        className="absolute -top-4 -right-4 w-2 h-2 bg-yellow-400 rounded-full"
        animate={{ 
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      />
      
      <motion.div
        className="absolute -top-2 -left-6 w-1 h-1 bg-blue-300 rounded-full"
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0]
        }}
        transition={{ 
          duration: 1.8,
          repeat: Infinity,
          delay: 1
        }}
      />
    </div>
  );
}
