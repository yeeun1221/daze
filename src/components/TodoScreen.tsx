import { motion } from 'motion/react';
import { Check, Edit2, Plus, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TodoScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function TodoScreen({ tasks, onToggleTask, onAddTask, onEditTask, onDeleteTask }: TodoScreenProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32"
    >
      <section className="mb-8">
        <h1 className="font-jakarta text-3xl font-bold text-on-surface mb-1 tracking-tight">나의 할 일</h1>
        <p className="font-body text-on-surface-variant opacity-70">오늘 하루를 차근차근 가꿔보세요.</p>
      </section>

      <section className="mb-8">
        <div className="bg-primary-container rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_12px_30px_rgba(250,218,221,0.4)]">
          <div className="z-10">
            <span className="font-body text-[12px] font-semibold text-on-primary-container bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm mb-4 inline-block">
              오늘의 성장
            </span>
            <h2 className="font-jakarta text-2xl font-bold text-on-primary-container mb-2 tracking-tight">
              {progressPercentage === 100 ? '오늘 하루도 수고하셨어요!' : '조금만 더 힘내세요!'}
            </h2>
            <p className="font-body text-on-primary-container/80 max-w-[200px] text-sm leading-relaxed">
              {totalTasks === 0 ? '새로운 할 일을 추가해 보세요.' : `오늘 ${totalTasks}개 중 ${completedTasks}개의 할 일을 완료했습니다.`}
            </p>
          </div>
          
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mt-8 z-10 flex items-center justify-between gap-4">
            <div className="flex-1 h-2 bg-white/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="h-full bg-brand-pink rounded-full" 
              />
            </div>
            <span className="font-body font-semibold text-sm text-on-primary-container">{progressPercentage}%</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`rounded-[24px] p-4 flex items-center gap-4 transition-all duration-300 ${
              task.completed 
                ? 'bg-surface-container-low opacity-60' 
                : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container hover:shadow-md'
            }`}
          >
            <button 
              onClick={() => onToggleTask(task.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                task.completed 
                  ? 'bg-brand-pink text-white' 
                  : `border-2 border-primary-container bg-surface flex items-center justify-center hover:bg-primary-container ${task.priority ? 'border-brand-pink/50' : ''}`
              }`}
            >
              {task.completed && <Check size={16} strokeWidth={3} />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-body font-semibold text-[15px] truncate ${task.completed ? 'text-on-surface/50 line-through' : 'text-on-surface'}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {task.category !== '집' && !task.completed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    task.priority ? 'bg-secondary-container/50 text-on-secondary-container' : 'bg-tertiary-container/50 text-on-tertiary-container'
                  }`}>
                    {task.category}
                  </span>
                )}
                {task.completed && <span className="text-[12px] text-on-surface-variant/60">{task.category} • 완료</span>}
                {!task.completed && task.time && <span className="text-[12px] text-on-surface-variant/70">{task.time}</span>}
                {!task.completed && !task.time && task.category === '집' && <span className="text-[12px] text-on-surface-variant/70">{task.category}</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {!task.completed && (
                <button 
                  onClick={() => onEditTask(task)} 
                  className="text-on-surface-variant/40 hover:text-brand-pink p-1.5 rounded-full hover:bg-brand-pink/10 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              )}
              <button 
                onClick={() => onDeleteTask(task.id)} 
                className="text-on-surface-variant/40 hover:text-error p-1.5 rounded-full hover:bg-error/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-10 text-on-surface-variant/50 font-body">
            할 일이 없습니다. + 버튼을 눌러 추가해보세요.
          </div>
        )}
      </section>

      <button 
        onClick={onAddTask}
        className="fixed bottom-28 right-6 w-14 h-14 bg-brand-pink text-white rounded-[20px] flex flex-col items-center justify-center pill-glow active:scale-90 transition-transform duration-200 z-30 sm:right-[calc(50%-224px+24px)]"
      >
        <Plus size={32} />
      </button>
    </motion.div>
  );
}
