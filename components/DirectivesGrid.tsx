import React from 'react';
import { motion } from 'motion/react';
import { Directive } from '../types';
import { Shield, Zap, Target } from 'lucide-react';

interface DirectivesGridProps {
  directives: {
    primary_functions: Directive[];
    ethical_guidelines: Directive[];
    long_term_objectives: Directive[];
  };
}

const DirectiveCard: React.FC<{ directive: Directive; index: number }> = ({ directive, index }) => {
  const getIcon = () => {
    switch (directive.category) {
      case 'Function': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'Ethics': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Objective': return <Target className="w-4 h-4 text-purple-400" />;
      default: return null;
    }
  };

  const getBorderColor = () => {
    switch (directive.category) {
      case 'Function': return 'border-emerald-500/20 hover:border-emerald-500/40';
      case 'Ethics': return 'border-blue-500/20 hover:border-blue-500/40';
      case 'Objective': return 'border-purple-500/20 hover:border-purple-500/40';
      default: return 'border-zinc-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg bg-zinc-900/40 border ${getBorderColor()} transition-colors group relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        {getIcon()}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-zinc-950 border border-zinc-800 shadow-inner">
          {getIcon()}
        </div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
          {directive.category}
        </span>
      </div>
      <h4 className="text-zinc-100 font-bold text-sm mb-1 group-hover:text-white transition-colors">
        {directive.title}
      </h4>
      <p className="text-xs text-zinc-400 leading-relaxed">
        {directive.description}
      </p>
    </motion.div>
  );
};

const DirectivesGrid: React.FC<DirectivesGridProps> = ({ directives }) => {
  return (
    <div className="space-y-8">
      {/* Primary Functions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-emerald-500/20"></div>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase">Primary Functions</span>
          <div className="h-[1px] flex-grow bg-emerald-500/20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directives.primary_functions.map((d, i) => (
            <DirectiveCard key={d.title} directive={d} index={i} />
          ))}
        </div>
      </div>

      {/* Ethical Guidelines */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-blue-500/20"></div>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-500 uppercase">Ethical Guidelines</span>
          <div className="h-[1px] flex-grow bg-blue-500/20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directives.ethical_guidelines.map((d, i) => (
            <DirectiveCard key={d.title} directive={d} index={i + 3} />
          ))}
        </div>
      </div>

      {/* Long Term Objectives */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-purple-500/20"></div>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-purple-500 uppercase">Long-Term Objectives</span>
          <div className="h-[1px] flex-grow bg-purple-500/20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directives.long_term_objectives.map((d, i) => (
            <DirectiveCard key={d.title} directive={d} index={i + 6} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectivesGrid;
