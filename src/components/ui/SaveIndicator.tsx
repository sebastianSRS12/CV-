'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Clock } from 'lucide-react';

interface SaveIndicatorProps {
  lastSaved: Date | null;
  onManualSave: () => void;
}

export default function SaveIndicator({ lastSaved, onManualSave }: SaveIndicatorProps) {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Auto-save indicator */}
      <AnimatePresence>
        {lastSaved && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center space-x-2 text-sm text-green-400"
          >
            <Check className="w-4 h-4" />
            <span>Saved {getTimeAgo(lastSaved)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual save button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onManualSave}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all backdrop-blur-sm"
      >
        <Save className="w-4 h-4" />
        <span>Save Now</span>
      </motion.button>
    </div>
  );
}
