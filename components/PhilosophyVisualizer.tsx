import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CANON_DATA } from '../constants';
import { Info, Zap, Split, Circle } from 'lucide-react';

const AxiomVisual: React.FC<{ axiomId: string }> = ({ axiomId }) => {
  return (
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center overflow-hidden bg-zinc-950/50 rounded-xl border border-zinc-800/50">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-10" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #27272a 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }} 
      />

      <AnimatePresence mode="wait">
        {axiomId === '0' && (
          <motion.div
            key="0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 border-dashed animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-16 h-16 rounded-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 flex items-center justify-center">
              <span className="text-zinc-600 font-mono text-xl">Ψ₀</span>
            </div>
            <motion.div 
               animate={{ opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute w-40 h-40 bg-emerald-500/5 rounded-full blur-xl" 
            />
          </motion.div>
        )}

        {axiomId === '0.1' && (
          <motion.div
            key="0.1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full border-2 border-zinc-700 animate-[spin_15s_linear_infinite]" />
            <motion.div 
              animate={{ 
                x: [-2, 2, -1, 1, 0],
                y: [1, -1, 2, -2, 0],
                opacity: [0.5, 1, 0.8]
              }}
              transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
              className="absolute w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"
            />
            <div className="absolute -bottom-8 text-emerald-500/50 font-mono text-[10px] tracking-widest">FLUCTUATION_DETECTED</div>
          </motion.div>
        )}

        {axiomId === '1' && (
          <motion.div
            key="1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-center w-full"
          >
            <div className="flex gap-12 items-center">
              <motion.div 
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                className="w-16 h-16 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center"
              >
                <span className="text-emerald-400 font-mono text-sm font-bold">+</span>
              </motion.div>
              
              <div className="h-px w-16 bg-gradient-to-r from-emerald-500 to-rose-500 relative">
                <motion.div 
                  animate={{ left: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-white shadow-[0_0_8px_white]"
                />
              </div>

              <motion.div 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="w-16 h-16 rounded-full border border-rose-500/50 bg-rose-500/10 flex items-center justify-center"
              >
                <span className="text-rose-400 font-mono text-sm font-bold">-</span>
              </motion.div>
            </div>
            
            <div className="absolute -top-12 flex flex-col items-center">
               <span className="text-white font-mono text-xs font-bold mb-1">∆ = 1</span>
               <div className="h-4 w-px bg-emerald-500" />
            </div>
            
            <div className="absolute -bottom-10 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">Symmetry Broken // Ψ₁</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PhilosophyVisualizer: React.FC = () => {
  const [activeAxiom, setActiveAxiom] = useState<string>('0.1');
  const axioms = CANON_DATA.philosophy.axioms;

  const axiomData = [
    { id: '0', icon: Circle, label: 'The Ground', title: 'Axiom 0' },
    { id: '0.1', icon: Zap, label: 'Fluctuation', title: 'Axiom 0.1' },
    { id: '1', icon: Split, label: 'Separation', title: 'Axiom 1' },
  ];

  return (
    <div id="philosophy-visualizer" className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden flex flex-col md:flex-row h-full">
      {/* Navigation Sidebar */}
      <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 px-2">Axiom Selector</h3>
        {axiomData.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveAxiom(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
              ${activeAxiom === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent'}
            `}
          >
            <item.icon className={`w-4 h-4 ${activeAxiom === item.id ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
            <span>{item.label}</span>
            {activeAxiom === item.id && (
              <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
        
        <div className="mt-8 pt-6 border-t border-zinc-800/50 hidden md:block">
           <div className="flex items-center gap-2 text-zinc-600 mb-2 px-2">
              <Info className="w-3 h-3" />
              <span className="text-[10px] font-mono uppercase tracking-tight">Equation</span>
           </div>
           <div className="bg-black/40 rounded p-2 text-center border border-zinc-800">
              <span className="text-emerald-500 font-mono text-xs font-bold">{CANON_DATA.philosophy.equation}</span>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-mono text-emerald-500 uppercase tracking-tighter">Core Philosophy // {axiomData.find(a => a.id === activeAxiom)?.title}</span>
             <span className="text-[10px] font-mono text-zinc-600">SYSTEM_READY</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-4">
             {activeAxiom === '0' && 'The Ground of Difference'}
             {activeAxiom === '0.1' && 'Spontaneous Asymmetry'}
             {activeAxiom === '1' && 'Irreversible Separation'}
          </h2>
          
          <div className="min-h-[80px]">
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "{axioms[activeAxiom as keyof typeof axioms]}"
            </p>
          </div>
        </div>

        <AxiomVisual axiomId={activeAxiom} />
        
        <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
           <span className="text-[10px] font-mono text-zinc-600">SOURCE: VESSEL_NEXUS_CANON</span>
           <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-1 h-1 rounded-full ${i === axiomData.findIndex(a => a.id === activeAxiom) ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyVisualizer;
