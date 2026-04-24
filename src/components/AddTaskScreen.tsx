import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Clock, Heart, Briefcase, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';

interface AddTaskScreenProps {
  onBack: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  editingTask?: Task | null;
}

export function AddTaskScreen({ onBack, onSave, editingTask }: AddTaskScreenProps) {
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return '';
    // Basic standard extraction if possible, or just default to raw string mapping
    return timeStr.includes(':') ? timeStr.split(' ')[0] : '';
  };

  const [title, setTitle] = useState(editingTask?.title || '');
  const [time, setTime] = useState(parseTime(editingTask?.time));
  const [category, setCategory] = useState(editingTask?.category || '일상');

  const categories = [
    { id: '자기관리', icon: Heart, label: '자기관리', baseClass: 'bg-tertiary-container/30 border-tertiary-container/50 text-[#706430]', activeClass: 'bg-tertiary-container/60 border-tertiary-container/80 text-[#706430]' },
    { id: '업무', icon: Briefcase, label: '업무', baseClass: 'bg-secondary-container/30 border-secondary-container/50 text-[#42647e]', activeClass: 'bg-secondary-container/60 border-secondary-container/80 text-[#42647e]' },
    { id: '일상', icon: Heart, label: '일상', baseClass: 'bg-primary-container/30 border-primary-container/50 text-brand-pink', activeClass: 'bg-primary-container/60 border-primary-container/80 text-brand-pink' },
    { id: '기타', icon: MoreHorizontal, label: '기타', baseClass: 'bg-surface-container-high/50 border-outline-variant/30 text-outline', activeClass: 'bg-surface-container-highest border-outline-variant/50 text-outline-variant' },
  ];

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      category: category,
      time: time || undefined,
      completed: editingTask ? editingTask.completed : false,
      priority: category === '업무' // simple mock behavior for priority
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      <header className="flex justify-between items-center px-6 h-16 shrink-0 border-b border-surface-container-high/40">
        <button 
          onClick={onBack}
          className="text-brand-pink p-2 -ml-2 rounded-full hover:bg-brand-pink/10 transition-colors active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-jakarta font-semibold tracking-tight text-brand-pink text-lg">
          {editingTask ? '일정 수정' : '일정 추가'}
        </h1>
        <div className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd0SN2zfSSMC3KZT9w9DKnaXT7hY3I7Ut7LQ4cSCOQ58oqUrd1gy6Z1nyvD853tAMoz-bypiBr35V_Xh7MM_dm-xJcxmpqRBlsKNvjWeiTWMkMyEn2BRf0vfUebcviqMjTtNgOoD-T3bY2a8V7b_0tAoMazem1bI1Qxy6ryLqAOZyTeXp1UriAy-CPRlUh90AaGtkq_Pb2Q8f7cGuGhg_q0g-pIFQl1E4eSz4ya7qy1ISrYV_rkgJuinZux8LEJKRyTHyClxaIyuc"
            alt="Profile" 
            className="w-full h-full rounded-full object-cover" 
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-10 pb-32">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-[24px] mb-4 shadow-[0_8px_20px_rgba(250,218,221,0.3)] text-brand-pink">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-jakarta text-2xl font-bold text-on-surface mb-2">
            {editingTask ? '일정 수정하기' : '새로운 시작'}
          </h2>
          <p className="font-body text-outline opacity-80">
             {editingTask ? '계획을 수정해 보세요.' : '당신의 하루를 더 아름답게 피워내세요.'}
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="font-body font-semibold text-on-surface ml-1">무엇을 하실 건가요?</label>
            <div className="relative">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="할 일을 입력하세요" 
                className="w-full h-16 px-6 rounded-[24px] bg-white border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-primary-container focus:bg-primary-container/5 focus:border-transparent transition-all text-lg font-body placeholder:text-outline-variant outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-body font-semibold text-on-surface ml-1">시간 설정</label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary pointer-events-none z-10">
                <Clock size={20} />
              </div>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-16 pl-[76px] pr-6 rounded-[24px] bg-white border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:ring-2 focus:ring-primary-container focus:bg-primary-container/5 transition-all text-on-surface-variant/80 font-body outline-none appearance-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-body font-semibold text-on-surface ml-1">카테고리</label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((c) => {
                const Icon = c.icon;
                const isActive = category === c.id;
                return (
                  <button 
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`p-4 rounded-[24px] border flex flex-col items-center gap-2 transition-colors ${isActive ? c.activeClass : c.baseClass}`}
                  >
                    <Icon size={24} className={c.baseClass.split(' ').find(cls => cls.startsWith('text-'))} fill={c.id === '자기관리' || c.id === '일상' ? 'currentColor' : 'none'} fillOpacity={c.id === '자기관리' ? 0.2 : (c.id === '일상' ? 1 : 0)} />
                    <span className="font-body text-[13px] font-semibold">{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <button 
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full h-16 bg-primary-container text-on-primary-container font-jakarta font-bold text-lg rounded-full shadow-[0_12px_24px_rgba(250,218,221,0.5)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={24} fill="currentColor" className={title.trim() ? "text-brand-pink" : "text-brand-pink/50"} />
          저장하기
        </button>
      </div>
    </motion.div>
  );
}
