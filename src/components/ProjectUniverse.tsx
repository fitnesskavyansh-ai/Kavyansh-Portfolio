import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Cpu, Code, Globe, Shield, Activity, Terminal, Github, ExternalLink, ShieldCheck } from 'lucide-react';
import { Carousel } from './Carousel';
import { ProjectCard } from './ProjectCard';
import { Modal } from './EventModal';
import projectsData from '../data/projects.json';
import { useScrollLock } from '../hooks/useScrollLock';

const categories = [
  { id: 'all', title: 'All Units', icon: Shield },
  { id: 'ai', title: 'AI/ML Core', icon: Cpu },
  { id: 'web', title: 'Web Protocol', icon: Globe },
  { id: 'fullstack', title: 'Neural Systems', icon: Code },
];

export const ProjectUniverse: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useScrollLock(!!selectedProject);

  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || 
                             (project as any).category?.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const easing: any = [0.16, 1, 0.3, 1];

  return (
    <section id="projects" className="bg-black py-24 md:py-40 px-6 md:px-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-red/5 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-brand-red/5 blur-[120px] md:blur-[180px] rounded-full pointer-events-none opacity-50" />
      
      {/* HUD Header */}
      <div className="px-6 md:px-16 mb-16 md:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 relative z-10">
        <div className="flex items-center gap-6 md:gap-8">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="h-24 md:h-32 w-[3px] bg-brand-red shadow-[0_0_20px_#e50914]" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-red" />
          </motion.div>
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-2 md:mb-4"
            >
              <Terminal className="w-5 h-5 text-brand-red" />
              <span className="text-[10px] md:text-[12px] font-black text-brand-red uppercase tracking-[0.6em] md:tracking-[0.8em]">System Repository // V2.0</span>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: easing }}
              className="text-5xl md:text-[140px] font-black text-white uppercase italic tracking-tighter leading-[0.8]"
            >
              PROJECT <span className="text-transparent font-outline-2 text-white opacity-40">UNIVERSE</span>
            </motion.h3>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full lg:w-auto">
          {/* Search Input */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full md:w-96 group"
          >
            <div className="absolute inset-0 bg-brand-red/5 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-brand-red transition-colors" />
            <input 
              type="text" 
              placeholder="LOCATE SEQUENCE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-2xl py-5 md:py-6 pl-16 pr-8 text-[11px] md:text-xs font-black uppercase tracking-[0.3em] focus:border-brand-red/50 focus:outline-none transition-all placeholder:text-zinc-700 text-white"
            />
          </motion.div>

          {/* Category Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 p-2 bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[24px] w-full md:w-auto overflow-x-auto no-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-[20px] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  activeCategory === cat.id 
                  ? 'bg-brand-red text-white shadow-[0_0_30px_#e5091466]' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.title}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="min-h-[500px] md:min-h-[700px] relative z-10">
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div 
              key={activeCategory + searchTerm}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: easing }}
              className="space-y-24 md:space-y-40 pb-24 md:pb-48"
            >
              <Carousel title="PRIMARY DEPLOYMENTS">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => setSelectedProject(project)} 
                  />
                ))}
              </Carousel>

              {filteredProjects.length > 3 && (
                <Carousel title="AUXILIARY SEQUENCES">
                  {filteredProjects.slice().reverse().map((project) => (
                    <ProjectCard 
                      key={project.id + '-aux'} 
                      project={project} 
                      onClick={() => setSelectedProject(project)} 
                    />
                  ))}
                </Carousel>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 md:py-40 text-center mx-6 md:mx-16 relative"
            >
              <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-[60px]" />
              <div className="flex flex-col items-center gap-8 relative z-10">
                <div className="p-10 md:p-14 bg-zinc-900/50 backdrop-blur-2xl rounded-full border border-white/5 relative group">
                  <div className="absolute inset-0 bg-brand-red/20 rounded-full blur-3xl animate-pulse" />
                  <Activity className="w-16 h-16 md:w-20 md:h-20 text-brand-red animate-bounce" />
                </div>
                <div>
                  <p className="text-zinc-600 text-xs md:text-sm font-black uppercase tracking-[1em] mb-6">Zero Matching Signals Detected</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
                    className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all rounded-2xl shadow-xl active:scale-95"
                  >
                    REBOOT FILTER SYSTEM
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Decorative Elements */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden 2xl:block opacity-20">
        <div className="flex flex-col gap-12">
          {[ '01', '02', '03', '04' ].map(n => (
            <span key={n} className="text-[12px] font-black text-zinc-700 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">{n} // SEC</span>
          ))}
        </div>
      </div>
      {/* Project Viewer Modal */}
      <Modal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        title={selectedProject?.title || "PROJECT_INTEL"}
      >
        {selectedProject && (
          <div className="space-y-12">
             <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src={selectedProject.image} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  alt={selectedProject.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-6 left-6 flex gap-3">
                  <div className="px-5 py-2 bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.3em] skew-x-[-12deg] shadow-2xl">
                    <span className="inline-block skew-x-[12deg]">Project Intel</span>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                   <div>
                      <div className="flex items-center gap-3 text-brand-red mb-4">
                         <Code className="w-5 h-5" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Development Log</h4>
                      </div>
                      <p className="text-zinc-400 text-lg md:text-2xl font-light leading-relaxed italic border-l-2 border-brand-red/30 pl-8">
                        {selectedProject.description}
                      </p>
                   </div>

                   <div>
                      <div className="flex items-center gap-3 text-brand-red mb-6">
                         <ShieldCheck className="w-5 h-5" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Tech Stack Matrix</h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                         {selectedProject.tech.map((t: string) => (
                           <span key={t} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-zinc-300 font-black uppercase tracking-widest hover:border-brand-red transition-all cursor-default">
                             {t}
                           </span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-8">
                      <div>
                         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-4">Deployment Status</span>
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white font-black text-sm uppercase tracking-widest">{selectedProject.status}</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <a 
                           href={selectedProject.links.github} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-center gap-4 w-full py-5 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:border-brand-red hover:bg-brand-red/10 transition-all group"
                         >
                            <Github className="w-5 h-5" />
                            Source Archive
                         </a>
                         
                         {selectedProject.links.live && (
                           <a 
                             href={selectedProject.links.live} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-4 w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:border-brand-red hover:text-white transition-all shadow-xl"
                           >
                              <ExternalLink className="w-5 h-5" />
                              Live Terminal
                           </a>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

