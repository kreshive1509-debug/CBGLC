import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-[80vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md space-y-6">
        
        {/* Large Illustration / Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative w-48 h-48 bg-primary/5 border border-primary/10 rounded-full flex items-center justify-center mx-auto"
        >
          {/* Custom scale and shield */}
          <ShieldAlert className="w-24 h-24 text-gold stroke-1 animate-pulse" />
          <div className="absolute -bottom-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
            ERROR Code 404
          </div>
        </motion.div>

        {/* Text Area */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
            Jurisdiction Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page or document you are trying to verify does not exist in our institutional archives. It may have been relocated or updated.
          </p>
        </div>

        {/* Home Navigation button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Return to Campus Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
