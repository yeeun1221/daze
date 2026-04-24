import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { DiaryEntry } from '../types';
import { mockStickers } from '../data';

interface DiaryEntryModalProps {
  entry: DiaryEntry | null;
  onClose: () => void;
  onEdit: (entry: DiaryEntry) => void;
}

function DynamicIcon({ name, size = 24, className = '' }: { name: string, size?: number, className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function DiaryEntryModal({ entry, onClose, onEdit }: DiaryEntryModalProps) {
  if (!entry) return null;

  const getMoodColor = (mood: string) => {
    switch(mood) {
        case 'Happy': return 'bg-[#fae6eb]';
        case 'Excited': return 'bg-yellow-200';
        case 'Love': return 'bg-rose-200';
        case 'Calm': return 'bg-green-200';
        case 'Meh': return 'bg-surface-container-low';
        case 'Sad': return 'bg-[#bee1ff]';
        case 'Tired': return 'bg-indigo-200';
        case 'Embarrassed': return 'bg-orange-200';
        case 'Angry': return 'bg-[#ffdad6]';
        default: return 'bg-primary-container';
    }
  };

  const getMoodSrc = (mood: string) => {
      switch(mood) {
          case 'Happy': return '/emotions/happy.png';
          case 'Excited': return '/emotions/excited.png';
          case 'Love': return '/emotions/love.png';
          case 'Calm': return '/emotions/calm.png';
          case 'Meh': return '/emotions/meh.png';
          case 'Sad': return '/emotions/sad.png';
          case 'Tired': return '/emotions/tired.png';
          case 'Embarrassed': return '/emotions/embarrassed.png';
          case 'Angry': return '/emotions/angry.png';
          default: return '/emotions/happy.png';
      }
  };

  const moodSrc = getMoodSrc(entry.mood);
  const colorClass = getMoodColor(entry.mood);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#191c1d]/40 backdrop-blur-md flex items-center justify-center px-6"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-[0_20px_60px_rgba(250,218,221,0.6)] border border-primary-container/50 flex flex-col items-center text-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center active:scale-90 transition-transform text-outline hover:text-on-surface"
          >
            <Icons.X size={20} />
          </button>

          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 pill-shadow mt-4 ${colorClass}`}>
            <img src={moodSrc} alt={entry.mood} className="w-14 h-14 object-contain" />
          </div>

          <div className="mb-8 w-full">
            <h2 className="font-jakarta text-[32px] font-bold leading-tight text-on-surface mb-3">
              {(() => {
                const parts = entry.date.split('-');
                return `${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
              })()}
            </h2>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-tertiary-container/30 text-on-tertiary-container font-body font-semibold text-sm border border-tertiary-container/50">
               <Icons.Sparkles size={16} />
               {entry.title}
            </div>
          </div>

          {(entry.attachedStickerIds && entry.attachedStickerIds.length > 0) && (
            <div className="flex gap-2 justify-center mb-6">
              {entry.attachedStickerIds.map(id => {
                const s = mockStickers.find(st => st.id === id);
                if (!s) return null;
                return (
                  <div key={id} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-brand-pink/20 hover:scale-110 transition-transform z-10 relative">
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.name} className="w-8 h-8 object-contain drop-shadow-sm" />
                    ) : (
                      <DynamicIcon name={s.icon} size={24} className="text-brand-pink" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Render positioned stickers */}
          {entry.placedStickers && entry.placedStickers.map(ps => {
            const s = mockStickers.find(st => st.id === ps.stickerId);
            if (!s) return null;
            return (
              <div 
                key={ps.id} 
                className="absolute z-20 pointer-events-none top-0 left-0"
                style={{ transform: `translate(${ps.x}px, ${ps.y}px)` }}
              >
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.name} className="w-16 h-16 object-contain drop-shadow-md" />
                ) : (
                  <DynamicIcon name={s.icon} size={40} className="text-brand-pink drop-shadow-md" />
                )}
              </div>
            );
          })}

          <div className="bg-surface-container-low/50 rounded-[28px] p-6 mb-8 text-left border border-primary-container/20 w-full relative">
            <p className="font-body text-on-surface-variant leading-relaxed text-[15px]">
              {entry.content}
            </p>
          </div>

          <div className="flex w-full gap-3">
            <button 
              onClick={() => onEdit(entry)}
              className="flex-1 bg-surface-container text-on-surface font-jakarta font-bold text-[17px] py-4 rounded-full active:scale-[0.98] transition-all border border-outline-variant/30 hover:bg-surface-container-high"
            >
              수정
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-primary-container text-on-primary-container font-jakarta font-bold text-[17px] py-4 rounded-full pill-shadow active:scale-[0.98] transition-all"
            >
              확인
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
