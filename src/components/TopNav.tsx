import { Settings, Coins, User } from 'lucide-react';

interface TopNavProps {
  title?: string;
  points?: number;
  avatarUrl?: string;
  onPointsClick?: () => void;
  onSettingsClick?: () => void;
}

export function TopNav({ title = 'daze', points = 0, avatarUrl, onPointsClick, onSettingsClick }: TopNavProps) {
  return (
    <header className="fixed top-0 max-w-md mx-auto w-full z-40 flex justify-between items-center px-6 h-16 bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(250,218,221,0.1)]">
      <div className="flex items-center gap-3">
        <button 
          onClick={onSettingsClick}
          className="w-9 h-9 rounded-full bg-primary-container overflow-hidden ring-2 ring-white shadow-sm flex items-center justify-center cursor-pointer outline-none hover:ring-brand-pink/50 transition-all"
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={18} className="text-brand-pink" />
          )}
        </button>
        <span className="font-jakarta font-bold text-brand-pink text-xl tracking-tight">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onPointsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff8e1] rounded-full border border-[#ffe082]/50 shadow-sm hover:bg-[#fff3c4] active:scale-95 transition-all cursor-pointer"
        >
          <Coins size={16} className="text-[#fbc02d]" fill="currentColor" />
          <span className="font-jakarta font-bold text-[#f57f17] text-sm">{points}</span>
        </button>
        <button 
          onClick={onSettingsClick}
          className="text-on-surface-variant/50 hover:text-brand-pink transition-colors active:scale-95 p-1 rounded-full"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
}
