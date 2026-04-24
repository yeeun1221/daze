import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles } from 'lucide-react';

export interface RewardData {
  id: number;
  amount: number;
  message: string;
}

interface RewardToastProps {
  reward: RewardData | null;
  onClose: () => void;
}

export function RewardToast({ reward, onClose }: RewardToastProps) {
  useEffect(() => {
    if (reward) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [reward, onClose]);

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          key={reward.id}
          initial={{ opacity: 0, y: -40, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: -20, scale: 0.9, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[100] bg-[#fff8e1] border-2 border-[#ffe082] px-5 py-3 rounded-full shadow-[0_10px_40px_rgba(251,192,45,0.3)] flex items-center gap-3 w-max pointer-events-none"
        >
          <div className="w-10 h-10 bg-[#ffe082] rounded-full flex items-center justify-center shrink-0">
            <Coins className="text-[#f57f17]" size={24} fill="currentColor" />
          </div>
          <div>
            <p className="font-body text-[#f57f17] text-[11px] font-bold opacity-80 mb-0.5">{reward.message}</p>
            <p className="font-jakarta text-[#f57f17] text-lg font-bold leading-none">+{reward.amount} P <span className="text-sm font-body">획득!</span></p>
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-[#fbc02d] animate-pulse" size={24} fill="currentColor" />
          <Sparkles className="absolute -bottom-1 -left-2 text-[#fbc02d] animate-pulse" size={16} fill="currentColor" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
