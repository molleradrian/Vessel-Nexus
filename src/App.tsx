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
import { RefreshCw, Play, Pause, FastForward, Activity, ShieldCheck, Cpu, SlidersHorizontal, Search } from 'lucide-react';

import PhilosophyVisualizer from './components/PhilosophyVisualizer';
import DirectivesGrid from './components/DirectivesGrid';
import { InteractionProtocols } from './components/InteractionProtocols';
import { MemoryQuerySystem } from './components/MemoryQuerySystem';
import ObservXRepoSnapshot from './components/ObservXRepoSnapshot';
import FeedbackTestingMechanics from './components/FeedbackTestingMechanics';
import AetheriumBackground from './components/AetheriumBackground';
import { GoogleDriveExplorer } from './components/GoogleDriveExplorer';
import { AetheriumCoreAI } from './components/AetheriumCoreAI';
import { AetheriumForceGraph } from './components/AetheriumForceGraph';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { TermTooltip } from './components/TermTooltip';
import { SystemEventLog, LogEvent } from './components/SystemEventLog';

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{d: number, h: number, m: number, s: number} | null>(null);
  const [selectedProject, setSelectedProject] = useState<{name: string, data: ProjectDetails} | null>(null);
  const [activeView, setActiveView] = useState<'nexus' | 'observx_repo' | 'observx_progression' | 'google_drive' | 'aetherium_core'>('nexus');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcut Cmd/Ctrl+K for Search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Auto Cycle Operations (ACO) State & System Event Log
  const [autoCycleOps, setAutoCycleOps] = useState<boolean>(false);
  const [cycleDuration, setCycleDuration] = useState<number>(12); // seconds per view cycle
  const [cycleCountdown, setCycleCountdown] = useState<number>(12);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [autoRotateViews, setAutoRotateViews] = useState<boolean>(true);
  const [eventLogs, setEventLogs] = useState<LogEvent[]>([]);

  const addLogEvent = (type: LogEvent['type'], message: string, code?: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: LogEvent = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      type,
      message,
      code
    };
    setEventLogs(prev => [...prev.slice(-49), newLog]);
  };

  const viewOrder: Array<'nexus' | 'observx_repo' | 'observx_progression' | 'google_drive' | 'aetherium_core'> = [
    'nexus', 
    'observx_repo', 
    'observx_progression', 
    'google_drive', 
    'aetherium_core'
  ];

  const cyclePhases = [
    { name: 'COALESCENCE_RESONANCE_AUDIT', label: 'Coalescence Resonance Audit' },
    { name: 'SOVEREIGN_NODE_PULSE', label: 'Sovereign Node Pulse Check' },
    { name: 'MEMORY_SYNC_VALIDATION', label: 'Memory Sync & Canon Validation' },
    { name: 'PHONON_FIELD_SWEEP', label: 'Phonon Field Harmonic Sweep' },
    { name: 'VESSEL_DIRECTIVE_SYNC', label: 'Vessel Directive Sync' }
  ];

  const currentPhase = cyclePhases[(cycleCount - 1) % cyclePhases.length];

  // Boot Event Log
  useEffect(() => {
    if (bootComplete) {
      addLogEvent('system', 'Vessel Nexus Boot Complete • Immutable Aetherium Sync Active', 'BOOT_001');
    }
  }, [bootComplete]);

  // Log ACO Toggle & Phase Shift
  useEffect(() => {
    if (autoCycleOps) {
      addLogEvent('system', `Auto Cycle Operations ENABLED (${cycleDuration}s interval)`, 'ACO_START');
      addLogEvent('phase', `Phase Shifted to ${currentPhase.name} (${currentPhase.label})`, currentPhase.name);
    } else if (bootComplete) {
      addLogEvent('system', 'Auto Cycle Operations PAUSED', 'ACO_PAUSE');
    }
  }, [autoCycleOps]);

  // Log Phase Shift when cycleCount advances
  useEffect(() => {
    if (!autoCycleOps || cycleCount === 1) return;
    const phase = cyclePhases[(cycleCount - 1) % cyclePhases.length];
    addLogEvent('phase', `Phase Shifted to ${phase.name} (${phase.label})`, phase.name);
  }, [cycleCount]);

  // Auto Cycle Operations Interval Loop
  useEffect(() => {
    if (!autoCycleOps) return;

    const timer = setInterval(() => {
      setCycleCountdown(prev => {
        if (prev <= 1) {
          if (autoRotateViews) {
            setActiveView(currentView => {
              const currentIndex = viewOrder.indexOf(currentView);
              const nextIndex = (currentIndex + 1) % viewOrder.length;
              const nextView = viewOrder[nextIndex];
              addLogEvent('view', `Auto-rotated interface view to ${nextView.toUpperCase()}`, 'VIEW_ROTATE');
              return nextView;
            });
          }
          setCycleCount(c => c + 1);
          return cycleDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoCycleOps, cycleDuration, autoRotateViews]);

  const handleNextCycle = () => {
    if (autoRotateViews) {
      setActiveView(currentView => {
        const currentIndex = viewOrder.indexOf(currentView);
        const nextIndex = (currentIndex + 1) % viewOrder.length;
        const nextView = viewOrder[nextIndex];
        addLogEvent('view', `Manual fast-forward view shift to ${nextView.toUpperCase()}`, 'VIEW_SHIFT');
        return nextView;
      });
    }
    setCycleCount(c => c + 1);
    setCycleCountdown(cycleDuration);
    addLogEvent('action', `Manual ACO trigger executed (Cycle #${cycleCount + 1})`, 'ACO_TRIGGER');
  };

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
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30 relative overflow-hidden">
      <AetheriumBackground />
      
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-0 md:h-16 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h1 className="text-lg font-bold font-mono tracking-tighter text-white">
                VESSEL<span className="text-zinc-600 mx-1">//</span>NEXUS
              </h1>
            </div>

            {/* View Selector Navigation */}
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl font-mono text-xs max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveView('nexus')}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-all font-semibold whitespace-nowrap ${
                  activeView === 'nexus'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                NEXUS CONSOLE
              </button>
              <button
                onClick={() => setActiveView('observx_repo')}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-all font-semibold whitespace-nowrap ${
                  activeView === 'observx_repo'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                REPOS SNAPSHOT
              </button>
              <button
                onClick={() => setActiveView('observx_progression')}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-all font-semibold whitespace-nowrap ${
                  activeView === 'observx_progression'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                FEEDBACK & PROGRESS
              </button>
              <button
                onClick={() => setActiveView('google_drive')}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-all font-semibold whitespace-nowrap ${
                  activeView === 'google_drive'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                GOOGLE DRIVE
              </button>
              <button
                onClick={() => setActiveView('aetherium_core')}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-all font-semibold whitespace-nowrap ${
                  activeView === 'aetherium_core'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                AETHERIUM AI CORE
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-emerald-500/60 hover:text-emerald-300 text-zinc-300 transition-all font-mono text-xs cursor-pointer shadow-sm group"
                title="Search Canon records, philosophy, directives, projects (Cmd/Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Search Index</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">⌘K</span>
              </button>

              <button
                onClick={() => setAutoCycleOps(!autoCycleOps)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  autoCycleOps
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
                title="Toggle Autonomous Operational Cycling"
              >
                {autoCycleOps ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                    <span>ACO ACTIVE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>AUTO CYCLE OPS</span>
                  </>
                )}
              </button>

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

        {/* Auto Cycle Operations (ACO) Live HUD Console */}
        <AnimatePresence>
          {autoCycleOps && (
            <div className="bg-zinc-900/95 border-b border-emerald-500/30 text-xs font-mono py-2.5 px-4 backdrop-blur-md sticky top-16 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-md">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="font-bold">CYCLE #{String(cycleCount).padStart(3, '0')}</span>
                  </div>
                  <div className="text-zinc-300">
                    <span className="text-zinc-500">PHASE:</span>{' '}
                    <span className="text-emerald-400 font-semibold">{currentPhase.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>VIEW:</span>
                    <span className="text-white font-bold uppercase">{activeView.replace('_', ' ')}</span>
                  </div>

                  {/* Countdown Timer Meter */}
                  <div className="flex items-center gap-2 bg-black/60 border border-zinc-800 px-2.5 py-1 rounded-md">
                    <span className="text-zinc-500">NEXT STEP:</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{cycleCountdown}s</span>
                    <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(cycleCountdown / cycleDuration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* ACO Options & Manual Controls */}
                  <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
                    <button
                      onClick={() => setAutoRotateViews(!autoRotateViews)}
                      className={`px-2 py-1 rounded text-[10px] transition-colors border ${
                        autoRotateViews 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}
                      title="Toggle view auto rotation during operational cycle"
                    >
                      {autoRotateViews ? 'ROTATE VIEWS' : 'LOCK VIEW'}
                    </button>

                    <button
                      onClick={handleNextCycle}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Skip to Next Operational Cycle"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setAutoCycleOps(false)}
                      className="p-1 rounded bg-red-950/50 border border-red-800/40 hover:bg-red-900/60 text-red-400 transition-colors"
                      title="Halt Auto Cycle Operations"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {activeView === 'nexus' && (
            <div className="space-y-12">
          
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

          {/* Interactive Force-Directed Topology Graph */}
          <section>
             <AetheriumForceGraph />
          </section>

          {/* Interaction Protocols */}
          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                 INTERACTION PROTOCOLS
               </h2>
               <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                 MEMORY_URI: canon_sync.json
               </span>
             </div>
             <InteractionProtocols />
          </section>

          {/* Memory Query Node */}
          <section>
             <MemoryQuerySystem />
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
        </div>
      )}

          {activeView === 'observx_repo' && (
            <ObservXRepoSnapshot />
          )}

          {activeView === 'observx_progression' && (
            <FeedbackTestingMechanics />
          )}

          {activeView === 'google_drive' && (
            <GoogleDriveExplorer />
          )}

          {activeView === 'aetherium_core' && (
            <AetheriumCoreAI />
          )}
        </main>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
              name={selectedProject.name} 
              data={selectedProject.data} 
              sourceNode={CANON_DATA.meta.source_node}
              relatedActions={PROPOSED_ACTIONS.filter(action => 
                action.title.toLowerCase().includes(selectedProject.name.replace(/_/g, ' ').toLowerCase()) ||
                action.context.toLowerCase().includes(selectedProject.name.replace(/_/g, ' ').toLowerCase())
              )}
              onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
      
      {/* Global Search Modal Overlay (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectView={(v) => setActiveView(v)}
        onSelectProject={(projKey) => {
          const rawProj = CANON_DATA.projects[projKey as keyof typeof CANON_DATA.projects];
          if (rawProj) {
            setSelectedProject({
              name: projKey,
              data: rawProj as ProjectDetails
            });
          }
        }}
      />

      {/* Toggleable System Event Log */}
      <SystemEventLog
        logs={eventLogs}
        onClearLogs={() => setEventLogs([])}
        autoCycleActive={autoCycleOps}
        currentPhaseName={currentPhase?.name}
      />

      <Analytics />
    </div>
  );
};

export default App;