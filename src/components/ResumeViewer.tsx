import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, X, Eye, ShieldCheck, ChevronRight } from 'lucide-react';

import { useScrollLock } from '../hooks/useScrollLock';

export const ResumeViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const resumeUrl = "/assets/Kavyansh_Saxena_Resume.pdf";

  useScrollLock(isOpen);

  return (
    <div className="flex justify-center py-24 md:py-40 bg-black relative px-6 md:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-xl"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-full flex items-center gap-4 md:gap-6 px-6 md:px-12 py-4 md:py-6 bg-zinc-900 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-brand-red transition-all duration-500"
        >
          <div className="relative p-3 md:p-4 bg-black/40 border border-white/5 rounded-lg md:rounded-xl">
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-brand-red" />
          </div>
          
          <div className="relative text-left flex-1">
            <div className="text-[8px] md:text-[10px] font-black text-brand-red uppercase tracking-[0.4em] mb-1">Professional Protocol</div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">ACCESS <span className="text-zinc-500">RESUME</span></h3>
          </div>
          
          <ChevronRight className="relative w-5 h-5 md:w-6 md:h-6 text-zinc-500 group-hover:text-brand-red transition-all" />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-5xl h-[80vh] md:h-[85vh] bg-zinc-900 border border-brand-red/30 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="p-2 md:p-3 bg-brand-red rounded-lg">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h2 className="text-sm md:text-xl font-black text-white uppercase italic tracking-tighter">KAVYANSH_RESUME.PDF</h2>
                  </div>
                  <div className="sm:hidden font-black text-white text-xs">RESUME.PDF</div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                  <a 
                    href={resumeUrl} 
                    download 
                    className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl hover:bg-brand-red transition-all text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 md:p-3 text-zinc-500 hover:text-white rounded-full transition-all"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-zinc-800 relative overflow-hidden">
                <iframe 
                  src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-none"
                  title="Resume Viewer"
                />
              </div>

              <div className="p-3 md:p-4 bg-black border-t border-white/10 flex items-center justify-center gap-4 md:gap-8">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[7px] md:text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Active</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Eye className="w-3 h-3 md:w-4 md:h-4 text-brand-red" />
                    <span className="text-[7px] md:text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Secure View</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
