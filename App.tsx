import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import ActionCard from './components/ActionCard';
import ProjectStatus from './components/ProjectStatus';
import ChronosViewer from './components/ChronosViewer';
import ProjectModal from './components/ProjectModal';
import { CANON_DATA, PROPOSED_ACTIONS } from './constants';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence } from 'motion/react';
import { ProjectDetails } from './types';

import PhilosophyVisualizer from './components/PhilosophyVisualizer';
import DirectivesGrid from './components/DirectivesGrid';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number} | null>(null);
  const [selectedProject, setSelectedProject] = useState<{name: string, data: ProjectDetails} | null>(null);

  useEffect(() => {
    const target = new Date(CANON_DATA.mission_vector.target_date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(null);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30">
      
      {!bootComplete && (
        <Terminal onComplete={() => setBootComplete(true)} />
      )}

      {/* Main Interface */}
      <div className={`
        transition-opacity duration-1000
        ${bootComplete ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h1 className="text-lg font-bold font-mono tracking-tighter text-white">
                VESSEL<span className="text-zinc-600 mx-1">//</span>NEXUS
              </h1>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 hidden md:flex">
              <span>SYNC: v2026.02</span>
              <span>NODE: GEMINI</span>
              <a 
                href="https://vercel.com/adrians-projects-d594a794" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
              >
                DEPLOYMENT
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-shadow" />
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
          
          {/* Mission Status Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Vector */}
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between group">
               <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-500">
                 <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
               </div>
               
               <div className="relative z-10 mb-6">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-emerald-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        PRIMARY OBJECTIVE
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-2 border ${
                        CANON_DATA.mission_vector.status.includes('Locked') 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                        {CANON_DATA.mission_vector.status.includes('Locked') && (
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        )}
                        {CANON_DATA.mission_vector.status}
                    </span>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{CANON_DATA.mission_vector.primary_objective.split('—')[0]}</h2>
                        <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                          {CANON_DATA.mission_vector.primary_objective.split('—')[1]}
                        </p>
                    </div>
                    
                    <div className="border-l-2 border-zinc-800 pl-4 py-1">
                        <span className="text-[10px] font-mono text-zinc-500 block mb-1">STRATEGIC_VECTOR</span>
                        <p className="text-xs text-zinc-400 italic">
                            {CANON_DATA.mission_vector.strategic_goal}
                        </p>
                    </div>
                 </div>
               </div>

               {/* Countdown Interface */}
               <div className="relative z-10 bg-black/40 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
                 <div className="grid grid-cols-4 divide-x divide-zinc-700/50">
                    <div className="text-center px-2">
                        <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{timeLeft?.d || 0}</div>
                        <div className="text-[10px] text-zinc-500 font-mono tracking-widest">DAYS</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{timeLeft?.h || 0}</div>
                        <div className="text-[10px] text-zinc-500 font-mono tracking-widest">HOURS</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-2xl md:text-3xl font-mono font-bold text-white tabular-nums">{timeLeft?.m || 0}</div>
                        <div className="text-[10px] text-zinc-500 font-mono tracking-widest">MINS</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-2xl md:text-3xl font-mono font-bold text-emerald-400 tabular-nums">{timeLeft?.s || 0}</div>
                        <div className="text-[10px] text-emerald-500/50 font-mono tracking-widest">SECS</div>
                    </div>
                 </div>
                 <div className="mt-3 flex justify-between items-center border-t border-zinc-700/50 pt-3">
                     <div className="text-xs font-mono text-zinc-400">
                        TARGET: <span className="text-white">{CANON_DATA.mission_vector.target_date}</span>
                     </div>
                     <div className="text-xs font-mono text-zinc-500">
                        LOCATION: UTOPIA PLANITIA
                     </div>
                 </div>
               </div>
            </div>

            {/* System Parameters */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between relative group overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
               
               <div>
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    SYSTEM_PARAMS
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Active Nodes</span>
                        <div className="flex flex-wrap gap-2">
                            {CANON_DATA.active_nodes.map(node => (
                                <span key={node} className="px-2 py-0.5 bg-zinc-800/50 border border-zinc-700 rounded text-[10px] font-mono text-zinc-300">
                                    {node}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Core Construct</span>
                        <p className="text-xs text-emerald-400 font-mono font-bold">{CANON_DATA.philosophy.core_construct}</p>
                    </div>

                    <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Current Law</span>
                        <p className="text-xs text-zinc-300 font-mono italic">{CANON_DATA.philosophy.current_law}</p>
                    </div>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t border-zinc-800/50">
                 <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-600 uppercase">Version</span>
                    <span className="text-zinc-400">{CANON_DATA.meta.version}</span>
                 </div>
               </div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                 AXIOMATIC PHILOSOPHY
               </h2>
               <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                  {CANON_DATA.philosophy.equation} // BEYOND SYMMETRY
               </span>
             </div>
             <PhilosophyVisualizer />
          </section>

          {/* Core Directives */}
          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                 CORE DIRECTIVES
               </h2>
               <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                 SOURCE: VESSEL_NEXUS_GOVERNANCE
               </span>
             </div>
             <DirectivesGrid directives={CANON_DATA.directives} />
          </section>

          {/* High Leverage Actions */}
          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                 DAY 2: HIGH LEVERAGE ACTIONS
               </h2>
               <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                 SOURCE: VESSEL_NEXUS_ANALYSIS
               </span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {PROPOSED_ACTIONS.map(action => (
                 <ActionCard key={action.id} action={action} />
               ))}
             </div>
          </section>

          {/* Data Visualization / Chronos Stub */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-zinc-200">CHRONOS VIEWER // <span className="text-emerald-500">ACTIVE FEED</span></h2>
                 <span className="text-xs font-mono text-zinc-600">PHONON_TAX_ESTIMATE</span>
              </div>
              <div className="h-72 md:h-80 w-full">
                 <ChronosViewer />
              </div>
            </div>

            {/* Project Stack */}
            <div className="space-y-4">
               <h2 className="text-lg font-bold text-zinc-200 mb-4">ACTIVE PROJECTS</h2>
               <div className="space-y-3 h-72 md:h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(CANON_DATA.projects).map(([key, data]) => (
                    <ProjectStatus 
                      key={key} 
                      name={key} 
                      data={data} 
                      onClick={() => setSelectedProject({name: key, data})} 
                    />
                  ))}
               </div>
            </div>
          </section>

          {/* Footer / Canon Hash */}
          <footer className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono">
            <div className="mb-4 md:mb-0 max-w-2xl">
               <span className="block mb-2 text-zinc-500">CANARY TRAP:</span>
               {CANON_DATA.security_protocols.canary_trap}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div>
                SECURE_HASH: 0x9f...a3b2
              </div>
              <a 
                href="https://github.com/emergenceofone-glitch/Nexus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                SOURCE_REPO
              </a>
            </div>
          </footer>
        </main>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
              name={selectedProject.name} 
              data={selectedProject.data} 
              onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
      
      <Analytics />
    </div>
  );
};

export default App;