import React from 'react';
import { ProjectDetails } from '../types';

interface ProjectStatusProps {
  name: string;
  data: ProjectDetails;
  onClick: () => void;
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ name, data, onClick }) => {
  const isPriority = name === 'aether_extension';

  return (
    <div 
      onClick={onClick}
      className={`
      flex flex-col p-4 rounded-lg border cursor-pointer transition-all duration-200 group
      ${isPriority 
        ? 'bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-900/30 hover:border-emerald-500/50' 
        : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors">
          {name.replace('_', ' ')}
        </h4>
        {isPriority && (
          <span className="text-[10px] text-emerald-500 font-mono border border-emerald-500/50 px-1 rounded shadow-[0_0_5px_rgba(16,185,129,0.2)]">
            PRIORITY
          </span>
        )}
      </div>
      
      <div className="space-y-2 pointer-events-none">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">FORMAT</span>
          <span className="text-zinc-300 text-right truncate max-w-[150px]">{data.format}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">STATUS</span>
          <span className={`text-right font-mono truncate max-w-[150px] ${isPriority ? 'text-emerald-400' : 'text-zinc-400'}`}>
            {data.status}
          </span>
        </div>
      </div>
      
      {/* Hover hint */}
      <div className="mt-2 text-[10px] text-zinc-600 text-center opacity-0 group-hover:opacity-100 transition-opacity font-mono">
        CLICK TO EXPAND
      </div>
    </div>
  );
};

export default ProjectStatus;