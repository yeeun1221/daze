import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { DiaryEntry } from '../types';
import { mockStickers } from '../data';

function DynamicIcon({ name, size = 24, className = '' }: { name: string, size?: number, className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}

interface CalendarScreenProps {
  entries: DiaryEntry[];
  onEntryClick: (entry: DiaryEntry) => void;
  onWriteDiary: (date: string) => void;
  initialDate?: string;
}

export function CalendarScreen({ entries, onEntryClick, onWriteDiary, initialDate }: CalendarScreenProps) {
    const defaultDateObj = (() => {
      if (initialDate) {
        const [y, m, d] = initialDate.split('-');
        if (y && m && d) return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      }
      return new Date();
    })();

    const [currentDate, setCurrentDate] = useState(() => new Date(defaultDateObj.getFullYear(), defaultDateObj.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(defaultDateObj);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // 0 = Sun
    const totalDays = lastDay.getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const calendarDays = [];
    
    // Prev month padding
    for (let i = startingDay - 1; i >= 0; i--) {
        calendarDays.push({
            date: new Date(year, month - 1, prevMonthLastDate - i),
            isCurrentMonth: false
        });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
        calendarDays.push({
            date: new Date(year, month, i),
            isCurrentMonth: true
        });
    }

    // Next month padding
    const remainingSlots = 42 - calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
        calendarDays.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        });
    }

    const formatDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const isSameDate = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };

    const selectedDateString = formatDate(selectedDate);
    const selectedEntry = entries.find(e => e.date === selectedDateString);

    const getMoodColor = (mood: string) => {
        switch(mood) {
            case 'Happy': return 'bg-brand-pink';
            case 'Excited': return 'bg-yellow-200';
            case 'Love': return 'bg-rose-200';
            case 'Calm': return 'bg-green-200';
            case 'Meh': return 'bg-surface-container-low';
            case 'Sad': return 'bg-[#bee1ff]';
            case 'Tired': return 'bg-indigo-200';
            case 'Embarrassed': return 'bg-orange-200';
            case 'Angry': return 'bg-[#ffdad6]';
            default: return 'bg-[#e1e3e4]';
        }
    };

    const getMoodSrc = (mood: string) => {
        switch(mood) {
            case 'Happy': return '/emotions/happy.png';
            case 'Excited': return '/emotions/excited.png';
            case 'Love': return '/emotions/love.png';
            case 'Calm': return '/emotions/calm.png';
            case 'Meh': return '/emotions/meh_.png';
            case 'Sad': return '/emotions/sad.png';
            case 'Tired': return '/emotions/tired.png';
            case 'Embarrassed': return '/emotions/embarrassed.png';
            case 'Angry': return '/emotions/angry.png';
            default: return '';
        }
    };

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-32"
        >
            <section className="mb-6">
                <h2 className="font-jakarta text-3xl font-bold text-on-surface tracking-tight">캘린더</h2>
                <p className="font-body text-on-surface-variant opacity-70 mt-1">색으로 보는 {monthNames[month]}의 여정</p>
            </section>

            <div className="flex items-center justify-between mb-6 px-2">
                <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95">
                    <Icons.ChevronLeft size={20} />
                </button>
                <span className="font-jakarta text-[22px] font-bold text-on-surface">{year}년 {monthNames[month]}</span>
                <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95">
                    <Icons.ChevronRight size={20} />
                </button>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(250,218,221,0.15)] mb-8 border border-primary-container/20">
                <div className="grid grid-cols-7 mb-4 text-center">
                    {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                        <span key={d} className={`text-[12px] font-body font-semibold ${i === 0 || i === 6 ? 'text-brand-pink/70' : 'text-outline'}`}>
                            {d}
                        </span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center items-start min-h-[240px]">
                    {calendarDays.map((calDay, i) => {
                        const dateStr = formatDate(calDay.date);
                        const entryData = entries.find(e => e.date === dateStr);
                        const isSelected = isSameDate(calDay.date, selectedDate);
                        
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if(!calDay.isCurrentMonth) {
                                        setCurrentDate(new Date(calDay.date.getFullYear(), calDay.date.getMonth(), 1));
                                    }
                                    setSelectedDate(calDay.date);
                                }}
                                className="relative aspect-square flex flex-col items-center justify-center w-full active:scale-90 transition-transform"
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full z-10 transition-colors ${isSelected ? 'bg-brand-pink text-white font-bold shadow-md' : calDay.isCurrentMonth ? 'text-on-surface' : 'text-on-surface/30'}`}>
                                    <span className="font-body text-sm">{calDay.date.getDate()}</span>
                                </div>
                                {entryData && !isSelected && (
                                    <div className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${getMoodColor(entryData.mood)} mb-1`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                {selectedEntry ? (
                    <motion.button 
                        key="entry"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => onEntryClick(selectedEntry)}
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full text-left block relative overflow-hidden bg-white rounded-[32px] p-6 border border-primary-container/10 shadow-[0_4px_20px_rgba(250,218,221,0.2)]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getMoodColor(selectedEntry.mood)}`}>
                                    {(() => {
                                        const moodSrc = getMoodSrc(selectedEntry.mood);
                                        return moodSrc ? <img src={moodSrc} alt={selectedEntry.mood} className="w-7 h-7 object-contain mix-blend-overlay" /> : <Icons.Star fill="currentColor" size={24} className="text-white mix-blend-overlay" />;
                                    })()}
                                </div>
                                <div>
                                    <h4 className="font-body font-bold text-on-surface">{parseInt(selectedEntry.date.split('-')[1])}월 {parseInt(selectedEntry.date.split('-')[2])}일</h4>
                                    <p className="font-body text-sm text-on-surface-variant/80">{selectedEntry.title}</p>
                                </div>
                            </div>
                            <span className="font-jakarta font-bold text-4xl text-primary-container opacity-50 z-10">
                                {String(parseInt(selectedEntry.date.split('-')[2])).padStart(2, '0')}
                            </span>
                        </div>
                        
                        {(selectedEntry.attachedStickerIds && selectedEntry.attachedStickerIds.length > 0) && (
                            <div className="flex gap-[-8px] items-center mb-3">
                                {selectedEntry.attachedStickerIds.map((id, index) => {
                                    const s = mockStickers.find(st => st.id === id);
                                    if (!s) return null;
                                    return (
                                        <div key={id} className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-white shadow-sm" style={{ zIndex: selectedEntry.attachedStickerIds!.length - index, marginLeft: index > 0 ? '-8px' : '0' }}>
                                            {s.imageUrl ? (
                                                <img src={s.imageUrl} alt={s.name} className="w-5 h-5 object-contain" />
                                            ) : (
                                                <DynamicIcon name={s.icon} size={16} className="text-brand-pink" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <p className="font-body text-on-surface-variant italic leading-relaxed line-clamp-3 text-[15px] relative z-10">
                            "{selectedEntry.content}"
                        </p>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                    </motion.button>
                ) : (
                    <motion.button 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => onWriteDiary(formatDate(selectedDate))}
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full text-center block relative overflow-hidden bg-white/50 border-2 border-dashed border-primary-container/50 rounded-[32px] p-8 hover:bg-primary-container/10 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center mx-auto mb-4">
                            <Icons.Plus size={24} className="text-brand-pink/70" />
                        </div>
                        <h4 className="font-body font-bold text-on-surface mb-1">{selectedDate.getDate()}일의 일기</h4>
                        <p className="font-body text-sm text-on-surface-variant/60">아직 작성된 일기가 없습니다.<br/>새로운 기록을 남겨보세요!</p>
                    </motion.button>
                )}
            </AnimatePresence>

            <button
                onClick={() => onWriteDiary(formatDate(selectedDate))}
                className="fixed bottom-28 right-6 w-14 h-14 bg-brand-pink text-white rounded-[20px] flex flex-col items-center justify-center pill-glow active:scale-90 transition-transform duration-200 z-30 sm:right-[calc(50%-224px+24px)]"
            >
                <Icons.BookHeart size={28} />
            </button>
        </motion.div>
    );
}
