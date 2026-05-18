import React from 'react';
import { motion } from 'motion/react';
import { ProjectDetails } from '../types';

interface ProjectStatusProps {
  name: string;
  data: ProjectDetails;
  onClick: () => void;
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ name, data, onClick }) => {
  const isPriority = name === 'aether_extension';

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
      relative overflow-hidden flex flex-col p-4 rounded-lg border cursor-pointer transition-all duration-300 group
      ${isPriority 
        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
        : 'bg-zinc-900/30 border-zinc-800 shadow-xl'}
      ${isPriority ? 'hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'hover:border-zinc-600'}
    `}>
      {isPriority && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">
          {name.replace('_', ' ')}
        </h4>
        {isPriority && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded tracking-tighter shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              PRIORITY_VEC
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-3 pointer-events-none relative z-10">
        <div className="flex justify-between text-xs items-center">
          <span className="text-zinc-500 font-mono text-[10px]">FORMAT</span>
          <span className="text-zinc-300 font-medium truncate max-w-[150px]">{data.format}</span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-zinc-500 font-mono text-[10px]">STATUS</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
            isPriority 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-zinc-800 text-zinc-400'
          }`}>
            {data.status}
          </span>
        </div>
      </div>
      
      {/* Interaction Indicator */}
      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-zinc-800"></div>
        <span className="mx-2 text-[9px] text-zinc-500 font-mono tracking-widest whitespace-nowrap">
          ACCESS_DETAILS
        </span>
        <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-zinc-800"></div>
      </div>
    </motion.div>
  );
};

export default ProjectStatus;