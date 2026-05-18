import React from 'react';
import { ActionItem } from '../types';

interface ActionCardProps {
  action: ActionItem;
}

const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const getBorderColor = (leverage: string) => {
    switch (leverage) {
      case 'Critical': return 'border-emerald-500/50 shadow-emerald-500/10';
      case 'High': return 'border-amber-500/50 shadow-amber-500/10';
      case 'Essential': return 'border-blue-500/50 shadow-blue-500/10';
      default: return 'border-zinc-700';
    }
  };

  const getTextColor = (leverage: string) => {
    switch (leverage) {
      case 'Critical': return 'text-emerald-400';
      case 'High': return 'text-amber-400';
      case 'Essential': return 'text-blue-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className={`
      relative group overflow-hidden
      bg-zinc-900/50 backdrop-blur-sm 
      border ${getBorderColor(action.leverage)} shadow-lg
      p-6 rounded-xl transition-all duration-300 hover:-translate-y-1
    `}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-6xl font-black font-mono text-white tracking-tighter">
            {action.id.split('-')[1]}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-mono font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/40 border border-white/10 ${getTextColor(action.leverage)}`}>
          {action.leverage} Leverage
        </span>
        <span className="text-xs text-zinc-500 font-mono">{action.id}</span>
      </div>

      <h3 className="text-xl font-bold text-zinc-100 mb-3 tracking-tight">
        {action.title}
      </h3>
      
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        {action.description}
      </p>

      <div className="mt-auto border-t border-white/5 pt-4">
        <p className="text-xs text-zinc-500 font-mono">
          <span className="text-zinc-600">CONTEXT_ </span>
          {action.context}
        </p>
      </div>

      <div className={`absolute bottom-0 left-0 h-1 bg-current w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${getTextColor(action.leverage)}`} />
    </div>
  );
};

export default ActionCard;
