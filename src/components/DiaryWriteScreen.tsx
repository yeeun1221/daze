import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { DiaryEntry, PlacedSticker } from '../types';
import { mockStickers } from '../data';

interface DiaryWriteScreenProps {
  date: string; // YYYY-MM-DD
  existingEntry?: DiaryEntry | null;
  onSave: (entry: Omit<DiaryEntry, 'id'>) => void;
  unlockedStickers?: string[];
}

function DynamicIcon({ name, size = 24, className = '' }: { name: string, size?: number, className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

export function DiaryWriteScreen({ date, existingEntry, onSave, unlockedStickers = [] }: DiaryWriteScreenProps) {
  const [selectedMood, setSelectedMood] = useState<DiaryEntry['mood']>(existingEntry?.mood || 'Happy');
  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(existingEntry?.content || '');
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(existingEntry?.placedStickers || []);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const moods: { id: DiaryEntry['mood']; label: string; iconSrc: string; color: string; bg: string; border: string }[] = [
    { id: 'Happy', label: '행복해요', iconSrc: '/emotions/happy.png', color: 'text-brand-pink', bg: 'bg-white', border: 'border-white' },
    { id: 'Excited', label: '신나요', iconSrc: '/emotions/excited.png', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { id: 'Love', label: '사랑해요', iconSrc: '/emotions/love.png', color: 'text-rose-500', bg: 'bg-rose-100', border: 'border-rose-200' },
    { id: 'Calm', label: '평온해요', iconSrc: '/emotions/calm.png', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
    { id: 'Meh', label: '보통이야', iconSrc: '/emotions/meh.png', color: 'text-gray-600', bg: 'bg-surface-container-low', border: 'border-outline-variant/30' },
    { id: 'Sad', label: '슬퍼요', iconSrc: '/emotions/sad.png', color: 'text-[#42647e]', bg: 'bg-[#bee1ff]/40', border: 'border-transparent' },
    { id: 'Tired', label: '피곤해요', iconSrc: '/emotions/tired.png', color: 'text-indigo-500', bg: 'bg-indigo-100', border: 'border-indigo-200' },
    { id: 'Embarrassed', label: '당황했어요', iconSrc: '/emotions/embarrassed.png', color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' },
    { id: 'Angry', label: '화나요', iconSrc: '/emotions/angry.png', color: 'text-[#ba1a1a]', bg: 'bg-[#ffdad6]/40', border: 'border-transparent' },
  ];

  const availableStickers = mockStickers.filter(s => s.isUnlocked || unlockedStickers.includes(s.id));

  const formatDisplayDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(y)}년 ${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const handleSave = () => {
    if (!content.trim() || !title.trim()) return;
    onSave({
      date,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      placedStickers: placedStickers,
    });
  };

  const handleAddSticker = (stickerId: string) => {
    setPlacedStickers(prev => {
      if (prev.length >= 10) return prev; // max 10 stickers
      
      const newSticker: PlacedSticker = {
        id: `ps-${Date.now()}-${Math.random()}`,
        stickerId,
        x: Math.random() * 50 + 20, // default offset
        y: Math.random() * 50 + 20,
        scale: 1,
        rotation: 0
      };
      return [...prev, newSticker];
    });
  };

  const handleDragEnd = (id: string, dx: number, dy: number) => {
    setPlacedStickers(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, x: s.x + dx, y: s.y + dy };
      }
      return s;
    }));
  };

  const handleRemoveSticker = (id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32"
    >
      <header className="mb-8">
        <h2 className="font-jakarta text-3xl font-bold text-on-surface tracking-tight">{formatDisplayDate(date)} 일기</h2>
        <p className="font-body text-on-surface-variant opacity-70 mt-1">
          {existingEntry ? '일기를 수정해보세요.' : '오늘 기분은 어떠신가요?'}
        </p>
      </header>

      <section className="grid grid-cols-5 gap-2 mb-8">
        {moods.map((mood) => {
          const isActive = selectedMood === mood.id;
          return (
            <button 
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-[20px] transition-all duration-200 active:scale-95 border-2 ${mood.bg} ${isActive ? 'pill-shadow border-brand-pink/30' : mood.border}`}
            >
              <img src={mood.iconSrc} alt={mood.label} className="w-8 h-8 object-contain mb-2" />
              <span className={`font-body text-[10px] sm:text-[11px] font-semibold ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>{mood.label}</span>
            </button>
          )
        })}
      </section>

      <section className="mb-8 relative">
        <div ref={containerRef} className="bg-surface-container-low rounded-[32px] p-6 min-h-[300px] shadow-sm flex flex-col relative border border-white/50 overflow-hidden">
          {/* Draggable Stickers Overlay */}
          {placedStickers.map(ps => {
            const s = mockStickers.find(st => st.id === ps.stickerId);
            if (!s) return null;
            return (
              <motion.div
                key={ps.id}
                drag
                dragMomentum={false}
                dragConstraints={containerRef}
                initial={{ x: ps.x, y: ps.y }}
                onDragEnd={(e, info) => handleDragEnd(ps.id, info.offset.x, info.offset.y)}
                className="absolute z-10 cursor-move top-0 left-0"
                style={{ touchAction: 'none' }}
              >
                <div className="relative group">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-16 h-16 object-contain drop-shadow-md pointer-events-none" />
                  ) : (
                    <DynamicIcon name={s.icon} size={40} className="text-brand-pink drop-shadow-md pointer-events-none" />
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSticker(ps.id);
                    }}
                    className="absolute -top-2 -right-2 bg-on-surface text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icons.X size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 한 줄 요약 (제목)"
            className="w-full bg-transparent border-b border-outline-variant/30 pb-3 mb-4 focus:border-brand-pink/50 font-jakarta font-bold text-lg text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-colors relative z-0"
          />
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full bg-transparent border-none focus:ring-0 font-body text-on-surface placeholder:text-on-surface-variant/40 resize-none outline-none leading-relaxed relative z-0"
            placeholder="오늘의 하루, 떠오르는 생각들을 자유롭게 기록해보세요..."
          />
          
          <div className="mt-8 pt-8 border-t border-surface-container-highest flex justify-center relative z-0">
            <div className="relative">
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 flex items-center justify-center bg-white rounded-full pill-shadow"
              >
                <Icons.Sparkles className="text-brand-pink" size={32} fill="currentColor" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-body font-semibold text-sm text-on-surface">스티커 추가하기</h3>
          <span className="font-body text-xs text-brand-pink opacity-80">터치하여 배치</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {availableStickers.length === 0 ? (
             <div className="text-sm font-body text-outline-variant p-4 text-center w-full bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/30">해금된 스티커가 없습니다.</div>
          ) : (
            availableStickers.map((s) => {
              return (
                <button 
                  key={s.id} 
                  onClick={() => handleAddSticker(s.id)}
                  className={`relative shrink-0 w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:pill-shadow transition-all active:scale-90 border border-surface-container/50`}
                >
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <DynamicIcon name={s.icon} size={28} className="text-outline-variant opacity-60" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      <button 
        onClick={handleSave}
        disabled={!title.trim() || !content.trim()}
        className="w-full bg-brand-pink text-white font-body font-semibold py-5 rounded-full pill-glow active:scale-95 transition-all text-lg disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
      >
        {existingEntry ? '수정 완료하기' : '일기 저장하기'}
      </button>
    </motion.div>
  );
}
