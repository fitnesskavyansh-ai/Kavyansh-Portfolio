import React, { useEffect, useState } from 'react';
import { Search, User, Zap, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { profileConfig } from '../data/profile';
import { useScrollLock } from '../hooks/useScrollLock';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useScrollLock(isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Mainframe', href: '#hero' },
    { name: 'Armory', href: '#projects' },
    { name: 'Archives', href: '#hackathons' },
    { name: 'Codex', href: '#journey' },
    { name: 'Contact', href: '#contact' },
  ];

  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[80] transition-all duration-700 px-6 md:px-16 py-6",
      isScrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-4" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <motion.a 
            href="/" 
            className="group flex items-center gap-3 md:gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red flex items-center justify-center skew-x-[-12deg] group-hover:scale-110 transition-transform shadow-[0_0_30px_#e5091466] relative overflow-hidden">
              <Zap className="w-6 h-6 md:w-7 md:h-7 text-white skew-x-[12deg] fill-current relative z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xl md:text-3xl font-black tracking-tighter leading-none uppercase italic">{profileConfig.firstName}</span>
              <span className="text-brand-red text-[8px] md:text-[10px] font-black tracking-[0.4em] leading-none uppercase mt-1">Tactical Protocol</span>
            </div>
          </motion.a>
          
          <div className="hidden lg:flex items-center gap-10 text-[10px] md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            {navLinks.map((link, i) => (
              <motion.a 
                key={link.name} 
                href={link.href} 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: easing }}
                className="hover:text-white transition-colors relative group py-2"
              >
                {link.name}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-red group-hover:w-full transition-all duration-500 ease-[0.16,1,0.3,1]" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-white/5 rounded-full border border-white/5 hover:border-brand-red/30 transition-all group cursor-default">
            <Shield className="w-4 h-4 text-brand-red group-hover:animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Signal Secured</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-zinc-500 hover:text-brand-red transition-all p-2 rounded-lg hover:bg-white/5">
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="relative group cursor-pointer hidden sm:block">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center group-hover:border-brand-red group-hover:shadow-[0_0_20px_#e5091433] transition-all">
                <User className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col p-10 lg:hidden"
          >
            <div className="flex justify-between items-center mb-20">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-red flex items-center justify-center skew-x-[-12deg]">
                    <Zap className="w-7 h-7 text-white skew-x-[12deg] fill-current" />
                  </div>
                  <span className="text-white text-3xl font-black tracking-tighter uppercase italic">{profileConfig.firstName}</span>
               </div>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)} 
                 className="p-4 bg-zinc-900 rounded-2xl border border-white/10 text-white active:scale-90 transition-transform"
               >
                 <X className="w-8 h-8" />
               </button>
            </div>

            <div className="flex flex-col gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, ease: easing }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-5xl font-black text-zinc-700 hover:text-brand-red uppercase italic tracking-tighter transition-all"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 flex flex-col gap-8">
               <div className="flex items-center gap-4 text-brand-red bg-brand-red/5 p-6 rounded-2xl border border-brand-red/20">
                  <Shield className="w-6 h-6 animate-pulse" />
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-zinc-400">Security Status</span>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Active Neural Link</span>
                  </div>
               </div>
               <div className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.4em]">
                 © 2024 {profileConfig.fullName.toUpperCase()} // THE LEGEND
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
