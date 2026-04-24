import { CheckCircle2, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onChangeScreen: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onChangeScreen }: BottomNavProps) {
  const tabs = [
    { id: 'todo', label: '할 일', icon: CheckCircle2 },
    { id: 'calendar', label: '캘린더', icon: Calendar },
    { id: 'diary', label: '일기', icon: BookOpen },
    { id: 'sticker', label: '스티커', icon: Sparkles },
  ] as const;

  return (
    <nav className="fixed bottom-0 max-w-md mx-auto w-full z-40 flex justify-around items-center px-4 pt-3 pb-safe-offset-2 pb-8 bg-white/80 backdrop-blur-xl border-t border-white shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-3xl">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChangeScreen(tab.id as Screen)}
            className={`flex flex-col items-center justify-center relative active:scale-95 transition-all duration-300 w-16 ${
              isActive ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink/60'
            }`}
          >
            <Icon 
              size={24} 
              className="mb-1" 
              strokeWidth={isActive ? 2.5 : 2}
              fill={isActive ? 'currentColor' : 'none'} 
              fillOpacity={isActive ? 0.2 : 0}
            />
            <span className="font-jakarta text-[11px] font-medium tracking-wide">
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-2 w-1 h-1 bg-brand-pink rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
