import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectDetails, ActionItem } from '../types';
import { X, Shield, Target, Activity, Cpu, Zap, Globe } from 'lucide-react';

interface ProjectModalProps {
  name: string;
  data: ProjectDetails;
  relatedActions: ActionItem[];
  sourceNode: string;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ name, data, relatedActions, sourceNode, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isPriority = name === 'aether_extension';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Tech Header */}
        <div className="px-6 py-6 border-b border-zinc-800 bg-zinc-900/40 relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Cpu className="w-32 h-32 text-white" />
           </div>

           <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPriority ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-zinc-600'}`} />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Project_Nexus // Source</span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                   {name.replace(/_/g, ' ')}
                 </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-zinc-500 hover:text-white transition-all p-2 hover:bg-zinc-800/50 rounded-lg border border-transparent hover:border-zinc-700 active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
           </div>

           {isPriority && (
             <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-mono text-emerald-500 font-bold tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                CRITICAL_PRIORITY_NODE
             </div>
           )}
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">
           {/* Status Block */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-colors">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Status</span>
                 <div className="flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${isPriority ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    <span className={`text-sm font-bold font-mono ${isPriority ? 'text-emerald-400' : 'text-zinc-200'}`}>
                       {data.status}
                    </span>
                 </div>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-colors">
                 <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Format</span>
                 <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-bold font-mono text-zinc-200">
                       {data.format}
                    </span>
                 </div>
              </div>
           </div>

           {/* Project Description */}
           {data.description && (
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] whitespace-nowrap">
                      Project_Description
                   </h3>
                   <div className="h-[1px] w-full bg-zinc-800" />
                </div>
                <div className="bg-zinc-900/20 border-l-2 border-zinc-800 p-5 rounded-r-xl">
                   <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light">
                      {data.description}
                   </p>
                </div>
             </div>
           )}

           {/* Current Focus - High Priority Visual */}
           {data.current_focus && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-2">
                      <Target className="w-4 h-4 animate-pulse" />
                      Current_Focus
                   </h3>
                   <span className="text-[9px] font-mono text-zinc-600">STABILITY_LOCKED</span>
                </div>
                <div className="relative group">
                   <div className="absolute -inset-1 bg-emerald-500/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                   <div className="relative bg-zinc-900 border border-emerald-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.03)]">
                      <p className="text-emerald-50 text-base font-medium leading-relaxed mb-4">
                         {data.current_focus}
                      </p>
                      <div className="flex items-center gap-3">
                         <div className="h-1.5 flex-1 bg-emerald-950 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '74%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                            />
                         </div>
                         <span className="text-[10px] font-mono font-bold text-emerald-500">74%</span>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* Functional Logic */}
           {data.function && (
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] whitespace-nowrap">
                      Functional_Logic
                   </h3>
                   <div className="h-[1px] w-full bg-zinc-800" />
                </div>
                <div className="bg-black/40 border border-zinc-800 p-6 rounded-2xl relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 text-zinc-800 group-hover:text-zinc-700 transition-colors">
                      <Cpu className="w-12 h-12" />
                   </div>
                   <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                         <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                         <div className="w-0.5 h-full bg-zinc-800/50 rounded-full" />
                      </div>
                      <p className="text-sm text-zinc-400 font-mono leading-relaxed py-0.5 relative z-10">
                         {data.function}
                      </p>
                   </div>
                </div>
             </div>
           )}

           {/* Related Actions */}
           {relatedActions.length > 0 && (
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] whitespace-nowrap">
                      Related_Vectors
                   </h3>
                   <div className="h-[1px] w-full bg-zinc-800" />
                </div>
                <div className="space-y-2">
                   {relatedActions.map(action => (
                      <div key={action.id} className="p-4 bg-zinc-900 shadow-xl border border-zinc-800 rounded-xl flex items-start gap-4 group">
                         <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0">
                            <Zap className={`w-4 h-4 ${action.leverage === 'Critical' ? 'text-emerald-500' : 'text-zinc-500'}`} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[9px] font-mono font-bold text-zinc-500">{action.id}</span>
                               <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                  action.leverage === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'
                               }`}>
                                  {action.leverage}
                               </span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{action.title}</h4>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* Canon Metadata */}
           <div className="space-y-4 pb-4">
              <div className="flex items-center gap-4">
                 <h3 className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em] whitespace-nowrap">
                    Nexus_Connection
                 </h3>
                 <div className="h-[1px] w-full bg-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <Globe className="w-3 h-3 text-zinc-500" />
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-zinc-600 uppercase">Provider_Node</span>
                       <span className="text-[10px] font-mono text-zinc-300">{sourceNode}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <Activity className="w-3 h-3 text-zinc-500" />
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-zinc-600 uppercase">Auth_Status</span>
                       <span className="text-[10px] font-mono text-emerald-500">VERIFIED</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 border-t border-zinc-800 bg-zinc-900/20 shrink-0">
           <div className="flex gap-3">
              <button className="flex-[2] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] h-11 px-6 rounded-xl border border-zinc-800 uppercase tracking-[0.2em] transition-all hover:border-zinc-600 active:scale-[0.98]">
                Synthesize_Node
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-mono text-[11px] h-11 px-6 rounded-xl border border-emerald-500/30 uppercase tracking-[0.2em] transition-all hover:border-emerald-500/50 active:scale-[0.98]"
              >
                Close
              </button>
           </div>
           <div className="mt-6 flex items-center justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
              <span>Sequence: 0x2294</span>
              <span>Vector_Status: Synchronized</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectModal;