import React from 'react';
import { useData } from '../context/DataContext';
import { GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const BreakingNewsTicker: React.FC = () => {
  const { settings, admissionSettings } = useData();

  const currentBreakingNewsStatus = admissionSettings?.breakingNewsStatus !== undefined ? admissionSettings.breakingNewsStatus : settings.breakingNewsStatus;
  const currentBreakingNewsText = admissionSettings?.breakingNewsText || settings.breakingNewsText;
  const currentAcademicSession = admissionSettings?.academicSession || settings.academicSession;
  const messages = (settings.breakingNewsMessages && settings.breakingNewsMessages.length ? settings.breakingNewsMessages : [currentBreakingNewsText]).filter(Boolean);

  if (!currentBreakingNewsStatus || !messages.length) {
    return null;
  }

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-white/5 h-10 flex items-center">
      {/* Premium Badge */}
      <div className="relative z-20 h-full flex items-center bg-primary px-6 shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-white" />
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-2 h-2 text-gold" />
            </motion.div>
          </div>
          <span className="font-serif font-black text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">
            Admissions {currentAcademicSession}
          </span>
        </div>
        {/* Slant edge for premium feel */}
        <div className="absolute top-0 -right-4 h-full w-8 bg-primary skew-x-[25deg] -z-10" />
      </div>

      {/* Scrolling Text Content */}
      <div className="flex-grow relative overflow-hidden h-full flex items-center">
        <div className="ticker-container flex items-center gap-12 pl-8">
          {messages.concat(messages).map((message, index) => {
            const messageText = typeof message === 'string' ? message : (message as any)?.text || '';
            return (
              <p key={`${messageText}-${index}`} className="whitespace-nowrap font-sans font-medium text-xs tracking-wide text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shrink-0" />
                {messageText}
              </p>
            );
          })}
        </div>
      </div>

      <style>{`
        .ticker-container {
          animation: ticker-premium 30s linear infinite;
          width: fit-content;
        }
        @keyframes ticker-premium {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
