import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { mockStickers } from '../data';
import { Sticker } from '../types';

interface StickerScreenProps {
  points: number;
  unlockedStickers: string[];
  onBuySticker: (id: string, price: number) => void;
  onWriteDiary: () => void;
}

function DynamicIcon({ name, size = 24, className = '' }: { name: string, size?: number, className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function StickerScreen({ points, unlockedStickers, onBuySticker, onWriteDiary }: StickerScreenProps) {
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  const totalUnlocked = unlockedStickers.length;
  const totalStickers = mockStickers.length;
  
  const handlePurchase = (id: string, price: number) => {
    onBuySticker(id, price);
    setSelectedSticker(null);
  };

  const categories = ['Decoration', 'Diary&Objects', 'Daily mood markers'] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 relative"
    >
      <section className="text-center mb-8">
        <h2 className="font-jakarta text-3xl font-bold text-on-surface mb-2 tracking-tight">스티커 보관함</h2>
        <p className="font-body text-on-surface-variant opacity-70">작은 발걸음으로 채워가는 여정</p>
      </section>

      <div className="flex justify-center gap-3 mb-8">
        <div className="bg-primary-container/80 px-4 py-2 rounded-full flex items-center gap-2">
          <Icons.Sparkles size={16} className="text-brand-pink" fill="currentColor" />
          <span className="font-body text-sm font-semibold text-brand-pink">{totalUnlocked}/{totalStickers} 수집함</span>
        </div>
        <div className="bg-tertiary-container/80 px-4 py-2 rounded-full flex items-center gap-2">
          <Icons.Sparkles size={16} className="text-[#6a5e2b]" />
          <span className="font-body text-sm font-semibold text-[#6a5e2b]">레어 획득</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 mb-10">
        {categories.map(category => (
          <div key={category}>
            <h3 className="font-jakarta text-xl font-bold text-on-surface mb-4 px-2">{category}</h3>
            <div className="grid grid-cols-3 gap-3">
              {mockStickers.filter(s => s.category === category).map(sticker => {
                const isUnlocked = sticker.isUnlocked || unlockedStickers.includes(sticker.id);

                if (!isUnlocked) {
                  return (
                    <button 
                      key={sticker.id} 
                      onClick={() => setSelectedSticker(sticker.id)}
                      className="p-4 bg-surface-container-low/50 rounded-[24px] flex flex-col items-center justify-center text-center border border-dashed border-outline-variant/60 relative overflow-hidden h-full hover:bg-surface-container-low active:scale-95 transition-all w-full min-h-[120px]"
                    >
                      <div className="mb-2 opacity-20 text-on-surface flex justify-center">
                        {sticker.imageUrl ? (
                          <img src={sticker.imageUrl} alt={sticker.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <DynamicIcon name={sticker.icon} size={32} />
                        )}
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] bg-white/80 p-1.5 rounded-full backdrop-blur-md shadow-sm border border-white">
                        <Icons.Lock size={14} className="text-outline" />
                      </div>
                      <span className="font-body text-[11px] font-medium text-outline-variant mt-2 flex items-center gap-1">
                        <Icons.Coins size={10} className="text-[#fbc02d]" /> {sticker.price}
                      </span>
                    </button>
                  );
                }

                return (
                  <div key={sticker.id} className={`p-4 bg-white rounded-[24px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center border ${sticker.isRare ? 'border-[#6a5e2b]/30' : 'border-white/60'} h-full min-h-[120px]`}>
                      {sticker.isRare && (
                          <div className="absolute top-2 right-2 flex items-center justify-center bg-tertiary-container rounded-full p-1">
                              <Icons.Sparkles size={10} className="text-[#6a5e2b]" />
                          </div>
                      )}
                    <div className={`mb-3 drop-shadow-sm hover:scale-110 transition-transform cursor-pointer flex justify-center ${sticker.isRare ? 'text-[#6a5e2b]' : 'text-brand-pink'}`}>
                      {sticker.imageUrl ? (
                        <img src={sticker.imageUrl} alt={sticker.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <DynamicIcon name={sticker.icon} size={40} />
                      )}
                    </div>
                    <span className="font-body text-[11px] font-semibold text-on-surface leading-tight">{sticker.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-secondary-container/20 rounded-[32px] border border-white flex flex-col items-center text-center shadow-sm mb-4">
        <Icons.BrainCircuit className="text-[#42647e] mb-3" size={32} />
        <h4 className="font-body font-bold text-[#42647e] text-lg mb-2">새로운 스티커 잠금 해제</h4>
        <p className="font-body text-sm text-on-secondary-container mb-6 opacity-80 leading-relaxed">
          투두리스트를 완료하거나 일기를 쓰면<br/>포인트를 얻을 수 있어요!
        </p>
        <button 
          onClick={onWriteDiary}
          className="w-full bg-[#40627b] text-white py-4 rounded-full font-body font-semibold active:scale-[0.98] transition-transform text-base shadow-md"
        >
          포인트 모으러 가기
        </button>
      </div>
      
      {/* --- Purchase Modal --- */}
      <AnimatePresence>
          {selectedSticker && (() => {
              const sticker = mockStickers.find(s => s.id === selectedSticker);
              if (!sticker || !sticker.price) return null;
              
              const canAfford = points >= sticker.price;

              return (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-[#191c1d]/40 backdrop-blur-md flex items-center justify-center px-6"
                    onClick={() => setSelectedSticker(null)}
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.95, y: 10, opacity: 0 }}
                      className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl flex flex-col items-center text-center relative pointer-events-auto border border-primary-container/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => setSelectedSticker(null)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container transition-colors"
                      >
                        <Icons.X size={20} className="text-on-surface-variant" />
                      </button>

                      <div className="mb-6 drop-shadow-md text-brand-pink opacity-80 flex justify-center">
                        {sticker.imageUrl ? (
                          <img src={sticker.imageUrl} alt={sticker.name} className="w-16 h-16 object-contain" />
                        ) : (
                          <DynamicIcon name={sticker.icon} size={64} />
                        )}
                      </div>
                      
                      <h3 className="font-jakarta text-2xl font-bold text-on-surface mb-2">{sticker.name}</h3>
                      <p className="font-body text-on-surface-variant text-sm mb-6 max-w-[200px] leading-relaxed">
                          {sticker.description || '이 귀여운 스티커를 해금할까요?'}
                      </p>

                      <div className="flex items-center gap-2 px-4 py-2 bg-[#fff8e1] rounded-full border border-[#ffe082]/50 mb-8">
                        <Icons.Coins size={18} className="text-[#fbc02d]" fill="currentColor" />
                        <span className="font-jakarta font-bold text-[#f57f17] text-lg">{sticker.price} P</span>
                      </div>

                      <button 
                        onClick={() => handlePurchase(sticker.id, sticker.price!)}
                        disabled={!canAfford}
                        className={`w-full py-4 rounded-full font-jakarta font-bold text-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2 ${canAfford ? 'bg-brand-pink text-white pill-shadow' : 'bg-surface-container-high text-on-surface-variant/50'}`}
                      >
                        {canAfford ? '해금하기' : '포인트가 부족해요'}
                      </button>
                    </motion.div>
                  </motion.div>
              );
          })()}
      </AnimatePresence>
    </motion.div>
  );
}
