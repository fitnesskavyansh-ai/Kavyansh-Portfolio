import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface CertCardProps {
  cert: any;
}

export const CertCard: React.FC<CertCardProps> = ({ cert }) => {
  return (
    <motion.div className="group relative min-w-[240px] sm:min-w-[300px] md:min-w-[350px] aspect-[4/5] bg-zinc-900 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-red/50 transition-all duration-500">
      <div className="h-full w-full p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-800 to-black relative z-10">
        
        <div className="flex justify-between items-start">
          <div className="p-3 md:p-4 bg-black/40 rounded-lg md:rounded-xl border border-white/10 group-hover:border-brand-red/30 transition-all">
            <Award className={cn(
              "w-8 h-8 md:w-12 md:h-12 transition-all duration-500",
              cert.category === 'microsoft' ? "text-blue-500" : "text-brand-red"
            )} />
          </div>
          
          {cert.verified && (
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full">
              <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              <span className="text-[7px] md:text-[10px] text-green-500 font-black uppercase tracking-widest">Verified</span>
            </div>
          )}
        </div>

        <div className="space-y-3 md:space-y-4">
          <div>
            <span className="text-[8px] md:text-[10px] text-brand-red font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1 md:mb-2 block">
              {cert.issuer} // ACQUISITION
            </span>
            <h4 className="text-lg md:text-2xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-brand-red transition-colors">
              {cert.title}
            </h4>
          </div>
          
          <div className="pt-3 md:pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="text-[7px] md:text-[10px] text-zinc-500 font-mono truncate">
              UID: {cert.credentialId.slice(0, 10)}...
            </div>
            <div className="text-[7px] md:text-[10px] text-zinc-500 font-mono whitespace-nowrap">
              {cert.date}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-red/50 -translate-y-full group-hover:translate-y-[500px] transition-transform duration-[3000ms] ease-linear" />
    </motion.div>
  );
};
