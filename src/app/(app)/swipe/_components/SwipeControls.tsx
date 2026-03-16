"use client";

import { motion } from "motion/react";

interface SwipeControlsProps {
  onPass: () => void;
  onWant: () => void;
  disabled: boolean;
}

export default function SwipeControls({ onPass, onWant, disabled }: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Pass button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onPass}
        disabled={disabled}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-red bg-accent-red/10 text-accent-red transition-colors hover:bg-accent-red/20 disabled:opacity-40"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Want button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onWant}
        disabled={disabled}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-green bg-accent-green/10 text-accent-green transition-colors hover:bg-accent-green/20 disabled:opacity-40"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.button>
    </div>
  );
}
