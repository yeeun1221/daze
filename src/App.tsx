import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen, DiaryEntry, Task, UserProfile } from './types';
import { mockDiaryEntries, mockTasks, mockStickers } from './data';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { TodoScreen } from './components/TodoScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { DiaryWriteScreen } from './components/DiaryWriteScreen';
import { StickerScreen } from './components/StickerScreen';
import { AddTaskScreen } from './components/AddTaskScreen';
import { DiaryEntryModal } from './components/DiaryEntryModal';
import { RewardToast, RewardData } from './components/RewardToast';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('todo');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '사용자',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd0SN2zfSSMC3KZT9w9DKnaXT7hY3I7Ut7LQ4cSCOQ58oqUrd1gy6Z1nyvD853tAMoz-bypiBr35V_Xh7MM_dm-xJcxmpqRBlsKNvjWeiTWMkMyEn2BRf0vfUebcviqMjTtNgOoD-T3bY2a8V7b_0tAoMazem1bI1Qxy6ryLqAOZyTeXp1UriAy-CPRlUh90AaGtkq_Pb2Q8f7cGuGhg_q0g-pIFQl1E4eSz4ya7qy1ISrYV_rkgJuinZux8LEJKRyTHyClxaIyuc'
  });
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(mockDiaryEntries);
  
  // Rewards & Stickers
  const [points, setPoints] = useState<number>(100); // give some starting points to play with
  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>(mockStickers.filter(s => s.isUnlocked).map(s => s.id));
  const [hasClaimedTodoReward, setHasClaimedTodoReward] = useState(false);
  const [rewardPopup, setRewardPopup] = useState<RewardData | null>(null);

  const showReward = (amount: number, message: string) => {
    setRewardPopup({ id: Date.now(), amount, message });
  };

  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [draftDiaryDate, setDraftDiaryDate] = useState<string>(getTodayDateString());

  const handleToggleTask = (id: string) => {
    setTasks(prev => {
      const nextTasks = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      
      // Check if all tasks are complete
      const allCompleted = nextTasks.length > 0 && nextTasks.every(t => t.completed);
      if (allCompleted && !hasClaimedTodoReward) {
        setPoints(p => p + 30); // 30 points for completing all todos
        showReward(30, '모든 할 일 달성');
        setHasClaimedTodoReward(true);
      }
      
      return nextTasks;
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setCurrentScreen('add-task');
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      setTasks(prev => [...prev, { ...taskData, id: Date.now().toString() }]);
    }
    setCurrentScreen('todo');
    setEditingTask(null);
  };

  const handleChangeScreen = (screen: Screen) => {
    if (screen === 'diary') {
      setDraftDiaryDate(getTodayDateString());
    }
    setCurrentScreen(screen);
  };

  const handleSaveDiary = (newEntryData: Omit<DiaryEntry, 'id'>) => {
    let finalEntry: DiaryEntry;

    setDiaryEntries(prev => {
      // Find if we are editing an existing entry
      const existingEntry = prev.find(e => e.date === newEntryData.date);
      const isEdit = !!existingEntry;

      finalEntry = {
        ...newEntryData,
        id: isEdit ? existingEntry.id : `d-${Date.now()}`
      };
      
      if (!isEdit) {
        setPoints(p => p + 20); // 20 points for a new diary entry!
        showReward(20, '오늘의 첫 일기 기록');
      }
      
      const filtered = prev.filter(e => e.date !== newEntryData.date);
      return [...filtered, finalEntry];
    });

    // Immediately redirect to calendar 
    setDraftDiaryDate(newEntryData.date); 
    setCurrentScreen('calendar');
  };

  const handleBuySticker = (id: string, price: number) => {
    if (points >= price) {
      setPoints(prev => prev - price);
      setUnlockedStickerIds(prev => [...prev, id]);
    }
  };

  // We use this to conditionally render the normal shell 
  // (TopNav + Main Content + BottomNav) vs full-screen overlays
  const isMainShell = currentScreen !== 'add-task' && currentScreen !== 'settings';

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-surface shadow-2xl overflow-x-hidden">
      {/* --- Normal Shell Views --- */}
      {isMainShell && (
        <>
          <TopNav 
            title={`daze, ${userProfile.name}님`}
            points={points} 
            avatarUrl={userProfile.avatarUrl}
            onPointsClick={() => handleChangeScreen('sticker')} 
            onSettingsClick={() => setCurrentScreen('settings')}
          />
          <main className="pt-24 px-6 min-h-[100dvh]">
            <AnimatePresence mode="wait">
              {currentScreen === 'todo' && (
                <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TodoScreen 
                    tasks={tasks} 
                    onToggleTask={handleToggleTask} 
                    onAddTask={() => { setEditingTask(null); setCurrentScreen('add-task'); }}
                    onEditTask={handleEditClick}
                    onDeleteTask={handleDeleteTask}
                  />
                </motion.div>
              )}
              {currentScreen === 'calendar' && (
                <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CalendarScreen 
                    entries={diaryEntries}
                    initialDate={draftDiaryDate}
                    onEntryClick={(entry) => setSelectedEntry(entry)} 
                    onWriteDiary={(date) => {
                      setDraftDiaryDate(date);
                      setCurrentScreen('diary');
                    }} 
                  />
                </motion.div>
              )}
              {currentScreen === 'diary' && (
                <motion.div key={`diary-${draftDiaryDate}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DiaryWriteScreen 
                    date={draftDiaryDate} 
                    existingEntry={diaryEntries.find(e => e.date === draftDiaryDate) || null}
                    onSave={handleSaveDiary} 
                    unlockedStickers={unlockedStickerIds}
                  />
                </motion.div>
              )}
              {currentScreen === 'sticker' && (
                <motion.div key="sticker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StickerScreen 
                    points={points}
                    unlockedStickers={unlockedStickerIds}
                    onBuySticker={handleBuySticker}
                    onWriteDiary={() => handleChangeScreen('diary')} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          <BottomNav currentScreen={currentScreen} onChangeScreen={handleChangeScreen} />
        </>
      )}

      {/* --- Full Screen Overlays --- */}
      <AnimatePresence>
        {currentScreen === 'add-task' && (
          <AddTaskScreen 
            onBack={() => { setEditingTask(null); setCurrentScreen('todo'); }}
            onSave={handleSaveTask}
            editingTask={editingTask}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen 
            profile={userProfile}
            onUpdateProfile={setUserProfile}
            onBack={() => setCurrentScreen('todo')}
          />
        )}
      </AnimatePresence>

      {/* --- Modals --- */}
      <DiaryEntryModal 
        entry={selectedEntry} 
        onClose={() => setSelectedEntry(null)} 
        onEdit={(entry) => {
          setDraftDiaryDate(entry.date);
          setSelectedEntry(null);
          setCurrentScreen('diary');
        }}
      />
      
      {/* --- Global Notifications --- */}
      <RewardToast 
        reward={rewardPopup} 
        onClose={() => setRewardPopup(null)} 
      />
      
    </div>
  );
}




