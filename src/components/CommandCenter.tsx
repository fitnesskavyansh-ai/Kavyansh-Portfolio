import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, X, ShieldAlert, Cpu, Network, Database, Lock, AlertTriangle } from 'lucide-react';
import worldData from '../data/my-world.json';
import projectData from '../data/projects.json';
import certData from '../data/certificates.json';

export const CommandCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveCategory] = useState('world');
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);

  const categories = [
    { id: 'world', title: 'World Archive', data: worldData, icon: Network },
    { id: 'projects', title: 'Project Armory', data: projectData, icon: Cpu },
    { id: 'certs', title: 'Intel Vault', data: certData, icon: Database }
  ];

  const handleOpen = () => {
    setIsHacking(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsHacking(false);
          setIsOpen(true);
          setHackProgress(0);
        }, 500);
      }
      setHackProgress(progress);
    }, 100);
  };

  return (
    <>
      <div className="bg-black py-12 md:py-20 flex justify-center border-t border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/[0.02] transition-colors duration-500" />
        
        <button 
          onClick={handleOpen}
          disabled={isHacking}
          className="relative z-10 flex flex-col items-center gap-3 transition-all active:scale-95"
        >
          {isHacking ? (
            <div className="flex flex-col items-center gap-4">
               <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-brand-red shadow-[0_0_10px_#e50914]"
                    />
                  ))}
               </div>
               <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.6em] animate-pulse">Initializing Breach... {Math.round(hackProgress)}%</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-zinc-800 w-1/3 group-hover:w-full transition-all duration-1000" />
              </div>
              <span className="text-[10px] font-black text-zinc-800 group-hover:text-zinc-500 transition-colors uppercase tracking-[0.8em]">
                Access Command Center
              </span>
              <Terminal className="w-5 h-5 text-zinc-800 group-hover:text-brand-red transition-colors" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 overflow-hidden">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="absolute inset-0 bg-black/98 backdrop-blur-[100px]"
             >
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#e5091411_1px,transparent_1px)] [background-size:40px_40px]" />
             </motion.div>
             
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 50, rotateX: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50, rotateX: -10 }}
               className="relative w-full max-w-7xl h-[90vh] md:h-[85vh] bg-zinc-900/40 border border-brand-red/40 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(229,9,20,0.2)] flex flex-col perspective-2000"
             >
                {/* HUD Header */}
                <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/60 relative overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent animate-pulse" />
                   
                   <div className="flex items-center gap-6 md:gap-10 relative z-10">
                      <div className="p-4 bg-brand-red rounded-2xl shadow-[0_0_30px_rgba(229,9,20,0.5)]">
                         <Terminal className="w-8 h-8 text-white" />
                      </div>
                      <div>
                         <div className="flex items-center gap-4 mb-1">
                            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">COMMAND <span className="text-brand-red">CENTER</span></h2>
                            <div className="px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded text-[10px] text-brand-red font-black uppercase tracking-widest">v4.0.2-stable</div>
                         </div>
                         <div className="flex items-center gap-3 text-[10px] md:text-xs text-zinc-500 font-black uppercase tracking-[0.2em]">
                            <Lock className="w-4 h-4 text-green-500" />
                            <span>Encrypted Link Active // Node: Mathura-IN-01</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         </div>
                      </div>
                   </div>

                   <button 
                     onClick={() => setIsOpen(false)}
                     className="p-4 rounded-full hover:bg-brand-red transition-all text-zinc-500 hover:text-white border border-white/5 hover:border-brand-red group"
                   >
                      <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                   </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                   {/* Sidebar Navigation */}
                   <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 p-4 md:p-8 flex md:flex-col gap-4 overflow-x-auto no-scrollbar">
                      {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`group flex items-center gap-4 px-6 py-5 rounded-2xl text-[11px] md:text-sm font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative overflow-hidden ${
                              activeTab === cat.id ? "bg-brand-red text-white shadow-[0_0_30px_rgba(229,9,20,0.3)]" : "text-zinc-500 hover:bg-white/5"
                            }`}
                          >
                            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${activeTab === cat.id ? "text-white" : "text-brand-red/50 group-hover:text-brand-red"}`} />
                            {cat.title}
                            {activeTab === cat.id && (
                               <motion.div 
                                 layoutId="active-tab"
                                 className="absolute inset-0 bg-white/10"
                                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                               />
                            )}
                          </button>
                        );
                      })}

                      <div className="mt-auto hidden md:block space-y-6">
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-zinc-600 uppercase">Core Load</span>
                               <span className="text-[10px] font-mono text-brand-red">42.8%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-brand-red w-[42.8%]" />
                            </div>
                         </div>
                         <div className="flex items-center gap-4 text-zinc-700 text-[10px] font-black uppercase tracking-widest px-2">
                            <ShieldAlert className="w-4 h-4" />
                            Security Protocol 9
                         </div>
                      </div>
                   </div>

                   {/* Data Console */}
                   <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-black/60 font-mono relative">
                      <div className="flex items-center justify-between mb-8 md:mb-12">
                         <div className="flex items-center gap-4">
                            <Database className="w-6 h-6 text-brand-red" />
                            <h3 className="text-white text-lg md:text-xl font-bold uppercase tracking-widest">./source/{activeTab}.json</h3>
                         </div>
                         <button 
                           onClick={() => {
                             navigator.clipboard.writeText(JSON.stringify(categories.find(c => c.id === activeTab)?.data, null, 2));
                             alert("SOURCE_COPIED_TO_CLIPBOARD");
                           }}
                           className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:border-brand-red transition-all group"
                         >
                            <Copy className="w-4 h-4 group-hover:text-brand-red" />
                            Dump Data
                         </button>
                      </div>

                      <div className="relative group/pre">
                         <div className="absolute top-4 right-4 p-2 bg-brand-red/10 rounded border border-brand-red/20 opacity-0 group-hover/pre:opacity-100 transition-opacity">
                            <AlertTriangle className="w-4 h-4 text-brand-red" />
                         </div>
                         <pre className="p-8 md:p-12 bg-black/80 rounded-3xl border border-white/5 text-brand-red/80 overflow-x-auto text-xs md:text-sm leading-relaxed shadow-inner">
                            {JSON.stringify(categories.find(c => c.id === activeTab)?.data, null, 2)}
                         </pre>
                      </div>

                      {/* Floating Decoration */}
                      <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none">
                         <Cpu className="w-64 h-64 text-white" />
                      </div>
                   </div>
                </div>

                {/* Footer Status Bar */}
                <div className="p-4 md:p-6 bg-black border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Buffer Status: Nominal</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-zinc-800" />
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Encryption: RSA-4096</span>
                      </div>
                   </div>
                   <p className="text-[9px] md:text-[11px] font-bold text-zinc-700 uppercase tracking-[0.4em] text-center md:text-right">
                      Authorized Access Only // <span className="text-brand-red">System.Log(KAVYANSH_SAXENA)</span>
                   </p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
