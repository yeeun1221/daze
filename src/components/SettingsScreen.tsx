import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, User } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
}

export function SettingsScreen({ profile, onUpdateProfile, onBack }: SettingsScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateProfile({ ...profile, avatarUrl: url });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...profile, name: e.target.value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 z-50 bg-surface flex flex-col max-w-md mx-auto shadow-2xl"
    >
      <header className="flex items-center gap-4 px-6 h-16 bg-white/80 backdrop-blur-md shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors">
          <ChevronLeft size={24} className="text-on-surface" />
        </button>
        <h1 className="font-jakarta text-xl font-bold text-on-surface">설정</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-outline/10 mb-6 flex flex-col items-center">
          <h2 className="font-jakarta font-bold text-lg text-on-surface w-full mb-6 text-center">프로필 수정</h2>
          
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-container overflow-hidden shadow-inner flex items-center justify-center border-4 border-white ring-1 ring-outline/10">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-brand-pink/50" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-brand-pink text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block font-jakarta text-sm font-semibold text-on-surface-variant mb-2">
                이름
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={handleNameChange}
                placeholder="이름을 입력하세요"
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-brand-pink/50 transition-all font-body text-on-surface placeholder:text-outline/50"
              />
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
