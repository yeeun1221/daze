export type Screen = 'todo' | 'calendar' | 'diary' | 'sticker' | 'add-task' | 'settings';

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  time?: string;
  completed: boolean;
  priority: boolean;
}

export interface PlacedSticker {
  id: string; // unique ID for the placement instance
  stickerId: string; // reference to the Sticker id
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type Emotion = 'Happy' | 'Sad' | 'Calm' | 'Angry' | 'Meh' | 'Excited' | 'Embarrassed' | 'Love' | 'Tired';

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: Emotion;
  attachedStickerIds?: string[];
  placedStickers?: PlacedSticker[];
}

export interface Sticker {
  id: string;
  name: string;
  description: string;
  category: 'Decoration' | 'Diary&Objects' | 'Daily mood markers';
  icon: string; // Keep for fallback or older stickers
  imageUrl?: string; // New property for image-based stickers
  isUnlocked?: boolean; 
  isRare?: boolean;
  price?: number;
}
