import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectDetails } from '../types';
import { X, Shield, Target, Activity, Cpu } from 'lucide-react';

interface ProjectModalProps {
  name: string;
  data: ProjectDetails;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ name, data, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isPriority = name === 'aether_extension';

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />
      
      {/* Side Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col h-full"
      >
        {/* Tech Header */}
        <div className="px-6 py-6 border-b border-zinc-800 bg-zinc-900/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Cpu className="w-24 h-24 text-white" />
           </div>

           <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPriority ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-zinc-600'}`} />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Project_Nexus // Source</span>
                 </div>
                 <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">
                   {name.replace(/_/g, ' ')}
                 </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-zinc-500 hover:text-white transition-all p-2 hover:bg-zinc-800/50 rounded-lg border border-transparent hover:border-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
           </div>

           {isPriority && (
             <div className="mt-4 inline-flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[10px] font-mono text-emerald-500 font-bold tracking-widest">
                <Shield className="w-3 h-3" />
                CRITICAL_PRIORITY_NODE
             </div>
           )}
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
           {/* Status Block */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Status</span>
                 <div className="flex items-center gap-2">
                    <Activity className={`w-3 h-3 ${isPriority ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    <span className={`text-xs font-bold font-mono ${isPriority ? 'text-emerald-400' : 'text-zinc-200'}`}>
                       {data.status}
                    </span>
                 </div>
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Format</span>
                 <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-zinc-400" />
                    <span className="text-xs font-bold font-mono text-zinc-200">
                       {data.format}
                    </span>
                 </div>
              </div>
           </div>

           {/* Project Description */}
           {data.description && (
             <div className="space-y-3">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <div className="w-1 h-3 bg-zinc-700" />
                   Project_Description
                </h3>
                <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-xl">
                   <p className="text-sm text-zinc-400 leading-relaxed font-light italic">
                      {data.description}
                   </p>
                </div>
             </div>
           )}

           {/* Current Focus - High Priority Visual */}
           {data.current_focus && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Target className="w-3 h-3 animate-pulse" />
                      Current_Focus
                   </h3>
                   <span className="text-[9px] font-mono text-zinc-600">VECTOR_READY</span>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity" />
                   <div className="relative bg-zinc-900 border border-emerald-500/30 p-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.05)] overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rotate-45 translate-x-12 -translate-y-12" />
                      <p className="text-emerald-50 text-sm font-medium leading-relaxed relative z-10">
                         {data.current_focus}
                      </p>
                      <div className="mt-3 flex gap-1 relative z-10">
                         <div className="h-1 flex-1 bg-emerald-500/20 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '65%' }}
                              className="h-full bg-emerald-500" 
                            />
                         </div>
                         <span className="text-[9px] font-mono text-emerald-500/70">65%</span>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Technical Logic / Function */}
           {data.function && (
             <div className="space-y-3">
                <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <Cpu className="w-3 h-3" />
                   Functional_Logic
                </h3>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl border-dashed">
                   <div className="flex gap-3">
                      <div className="flex flex-col gap-1">
                         <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                         <div className="w-1 h-full bg-zinc-800/50 rounded-full mx-auto" />
                      </div>
                      <p className="text-xs text-zinc-400 font-mono leading-relaxed py-0.5">
                         {data.function}
                      </p>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Tech Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
           <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 mb-4 uppercase tracking-widest">
              <span>Node_Registration</span>
              <span>v.2.0.46</span>
           </div>
           
           <div className="flex gap-2">
              <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] py-2 rounded border border-zinc-800 uppercase tracking-widest transition-colors">
                Inspect_Module
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-mono text-[10px] py-2 rounded border border-emerald-500/30 uppercase tracking-widest transition-colors"
              >
                Close_Interface
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;