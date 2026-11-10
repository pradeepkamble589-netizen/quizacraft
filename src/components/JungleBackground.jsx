import React from 'react';
import { useLocation } from 'react-router-dom';
import { TEMPLATES } from '../data/quizData';

export const JungleBackground = ({ children }) => {
  const location = useLocation();
  const categoryId = location.state?.category || 'jungle';

  const currentTemplate = TEMPLATES.find(t => t.id === categoryId) || TEMPLATES[0];

  const ambientEmojis = currentTemplate.ambientEmojis || ["🌿", "🍃", "🌴", "🍄"];

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-gradient-to-b ${currentTemplate.bgGradient || 'from-emerald-950 via-teal-950 to-emerald-900'} text-slate-800 flex flex-col justify-between transition-colors duration-700`}>
      {/* Ambient Theme Glow Orbs */}
      <div className={`fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full ${currentTemplate.glowColor1 || 'bg-emerald-500/20'} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full ${currentTemplate.glowColor2 || 'bg-amber-500/15'} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className={`fixed top-[40%] right-[10%] w-[350px] h-[350px] rounded-full ${currentTemplate.glowColor1 || 'bg-teal-400/15'} blur-3xl pointer-events-none transition-all duration-700`} />

      {/* Decorative Floating Theme Emojis */}
      <div className="fixed top-20 left-4 text-4xl opacity-40 select-none pointer-events-none hidden lg:block animate-bounce-slow">
        {ambientEmojis[0]}
      </div>
      <div className="fixed top-36 right-8 text-4xl opacity-40 select-none pointer-events-none hidden lg:block animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
        {ambientEmojis[1]}
      </div>
      <div className="fixed bottom-12 left-8 text-4xl opacity-40 select-none pointer-events-none hidden lg:block animate-bounce-slow" style={{ animationDelay: '0.8s' }}>
        {ambientEmojis[2]}
      </div>
      <div className="fixed bottom-20 right-6 text-4xl opacity-40 select-none pointer-events-none hidden lg:block animate-bounce-slow" style={{ animationDelay: '2.2s' }}>
        {ambientEmojis[3]}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* Theme Footer Bar */}
      <footer className="relative z-10 py-3.5 text-center text-xs font-semibold text-emerald-200/80 border-t border-emerald-800/40 bg-black/40 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 flex-wrap px-4">
          <span>🌟 QuizCraft Kids - Consistent AI Narrator Voice</span>
          <span>•</span>
          <span>{currentTemplate.name}</span>
          <span>•</span>
          <span>Learn. Play. Explore.</span>
        </div>
      </footer>
    </div>
  );
};

export default JungleBackground;
