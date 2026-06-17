import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Terminal as TerminalIcon, 
  ShieldAlert, 
  Boxes, 
  Volume2, 
  Award, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  Compass, 
  Zap, 
  TrendingUp, 
  Activity, 
  FileCode2, 
  Lock, 
  GitBranch, 
  AlertCircle 
} from 'lucide-react';

const ObservXRepoSnapshot: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [testCount, setTestCount] = useState<number>(0);
  const [audioHint, setAudioHint] = useState<string>('Idle • Web Audio ready');
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Web Audio Context persistence across renders
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Animate test count on mount
  useEffect(() => {
    let current = 0;
    const target = 299;
    const interval = setInterval(() => {
      current += Math.ceil((target - current) / 8);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setTestCount(current);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('Emergence-of-One/observx-game');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const tones: Record<string, number[]> = {
    'bo-kaap': [660, 880, 1320],
    'sea-point': [392, 523.25, 659.25],
    'kirstenbosch': [523.25, 659.25, 783.99],
    'clifton': [329.63, 415.3, 493.88]
  };

  const playChord = (id: string, label: string) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const freqs = tones[id] || [440, 660];
      const now = ctx.currentTime;
      const master = ctx.createGain();
      
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      master.connect(ctx.destination);

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.5 / freqs.length, now);
        osc.connect(g).connect(master);
        osc.start(now + i * 0.01);
        osc.stop(now + 0.85);
      });

      setAudioHint(`Playing • ${label}`);
      setActiveButton(id);
      setTimeout(() => {
        setAudioHint('Idle • Web Audio ready');
        setActiveButton(null);
      }, 950);
    } catch (e) {
      setAudioHint('Audio blocked • tap again');
    }
  };

  return (
    <div className="relative overflow-hidden p-1 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-md">
      {/* Background radial overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-transparent to-cyan-900/5 pointer-events-none" />

      <div className="p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 shadow-xl shadow-violet-950/20 flex items-center justify-center shrink-0">
              <Compass className="size-6 text-black/80" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ObservX <span className="text-zinc-500 font-medium">— Repo Snapshot</span>
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <p className="mono text-xs text-zinc-500 font-mono truncate">Emergence-of-One/observx-game</p>
                <button 
                  onClick={handleCopy}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-1 hover:bg-zinc-800 transition"
                >
                  {copied ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3 text-zinc-400 group-hover:text-white" />
                  )}
                  <span className={`text-[11px] font-mono leading-none ${copied ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-white'}`}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-emerald-400"></span>
              </span>
              <span className="mono text-[11px] text-emerald-300 font-mono tracking-wide">
                Active • June 8, 2026 • Private
              </span>
            </div>
            <a 
              href="https://github.com/emergenceofone-glitch/Nexus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 hover:bg-zinc-800 transition text-xs text-zinc-300"
            >
              <svg className="size-4 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576" />
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main Column */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Tech Stack */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 md:p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Tech Stack</span>
                <span className="mono text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">React Native / Expo</span>
              </div>
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">TypeScript</span>
                    <span className="mono text-xs text-zinc-500 font-mono">dominant</span>
                  </div>
                  <span className="mono text-sm font-bold font-mono text-violet-300">97%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-950/80 border border-zinc-800 overflow-hidden relative">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 w-[97%]" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="size-2 rounded-full bg-[#3178c6]" /> TypeScript 97%
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="size-2 rounded-full bg-[#f1e05a]" /> JavaScript
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="size-2 rounded-full bg-[#563d7c]" /> CSS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="size-2 rounded-full bg-zinc-400" /> React Native
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className="size-2 rounded-full bg-[#10b981]" /> Expo
                </span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 md:p-6 relative">
              <div className="flex items-center justify-between mb-5 border-b border-zinc-800/60 pb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Recent Activity</span>
                <span className="mono text-[10px] font-mono text-zinc-500">main • 2 commits</span>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-[3px] top-1.5 bottom-1.5 w-px bg-gradient-to-b from-violet-500/50 via-zinc-800 to-transparent" />
                
                {/* Commit 1 */}
                <div className="relative mb-6">
                  <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-violet-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <time className="mono text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">June 8, 2026</time>
                    <span className="mono text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">feat</span>
                    <span className="mono text-[10px] font-mono text-zinc-500">a3f9c12</span>
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-sm">Added game manual screen with tutorial/guide</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Database helpers and schema for scores, progress, and settings. New onboarding flow with interactive walkthrough.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">screens/Manual.tsx</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">db/schema.ts</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">db/helpers.ts</span>
                  </div>
                </div>

                {/* Commit 2 */}
                <div className="relative">
                  <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-cyan-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <time className="mono text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">June 6, 2026</time>
                    <span className="mono text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold uppercase tracking-wider">integration</span>
                    <span className="mono text-[10px] font-mono text-zinc-500">7d2b481</span>
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-sm">GitHub integration for score sharing + Cape Town environments</h4>
                  <ul className="text-xs text-zinc-400 mt-1.5 space-y-1.5 list-disc list-inside marker:text-zinc-600">
                    <li>Score sharing via GitHub Gists, leaderboard persistence with AsyncStorage</li>
                    <li>Social sharing to Twitter/Discord, GitHub profile display</li>
                    <li>Cape Town-themed quadrants: Bo-Kaap, Sea Point, Kirstenbosch, Clifton</li>
                    <li>Location-specific audio feedback using Web Audio API</li>
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">services/github.ts</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">audio/environment.ts</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">world/cape-town/*</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 md:p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Core Features</span>
                <span className="mono text-[10px] font-mono text-zinc-500">mobile-first design</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-violet-500/30 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <TerminalIcon className="size-4 text-violet-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Procedural World Gen</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Seed-based, deterministic maps for full replayability.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-cyan-500/30 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                      <Compass className="size-4 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Themed Environments</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Four Cape Town quadrants with customized, stunning visuals.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-amber-500/30 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <Award className="size-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Leaderboards Matrix</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Per-environment high scores with secure client state replication.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700/50 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-zinc-500/10 border border-zinc-600/20 flex items-center justify-center shrink-0">
                      <svg className="size-4 text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">GitHub Ingest & Sharing</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Gist synchronization for high score files & user profile links.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-sky-500/30 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                      <Share2 className="size-4 text-sky-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Social Amplification</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">One-click metadata formatting for high-score tweets & discord channels.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-emerald-500/30 transition-colors">
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Volume2 className="size-4 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Web Audio Synthesizer</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Real-time localized audio waveforms generated via code oscillator.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-fuchsia-500/30 transition-colors sm:col-span-2">
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-4 text-fuchsia-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white">
                        Comprehensive Test Harness — <span className="text-fuchsia-300 font-mono text-xs font-bold">{testCount}</span> tests passing
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-1">Unit, integration, and functional coverage for core gameplay, state replication, and Gist storage.</p>
                      <div className="mt-3 h-2 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-fuchsia-600 to-violet-500 transition-all duration-1000" 
                          style={{ width: `${(testCount / 299) * 96}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Insights */}
            <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-violet-600/30 via-fuchsia-500/20 to-cyan-500/10">
              <div className="relative rounded-2xl bg-zinc-950 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-6 rounded-md bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <Sparkles className="size-3.5 text-amber-300" />
                  </div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Insights</h4>
                </div>
                <p className="text-xs leading-relaxed text-zinc-300">
                  Well-structured codebase, active developer activity indexes, robust unit validation checks, and immersive localized audio pipelines.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400">clean architecture</span>
                  <span className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400">offline-first</span>
                  <span className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400">Cape Town vibe</span>
                </div>
              </div>
            </div>

            {/* Audio Quadrants Player */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 relative">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Cape Town Waves</span>
                <span className="mono text-[9px] font-mono text-zinc-500 text-right">tap to play audio</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => playChord('bo-kaap', 'Bo-Kaap')}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    activeButton === 'bo-kaap' 
                      ? 'border-pink-500 ring-1 ring-pink-500/30 bg-pink-950/10' 
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-pink-500/40'
                  }`}
                >
                  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity bg-gradient-to-br from-pink-500 to-amber-500 pointer-events-none" />
                  <div className="relative font-mono">
                    <div className="text-[10px] text-pink-300/80 mb-1">01</div>
                    <div className="text-xs font-semibold text-white">Bo-Kaap</div>
                    <div className="text-[9px] text-zinc-500 mt-1">percussive, resonant</div>
                  </div>
                </button>

                <button 
                  onClick={() => playChord('sea-point', 'Sea Point')}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    activeButton === 'sea-point' 
                      ? 'border-cyan-500 ring-1 ring-cyan-500/30 bg-cyan-950/10' 
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity bg-gradient-to-br from-cyan-500 to-blue-500 pointer-events-none" />
                  <div className="relative font-mono">
                    <div className="text-[10px] text-cyan-300/80 mb-1">02</div>
                    <div className="text-xs font-semibold text-white">Sea Point</div>
                    <div className="text-[9px] text-zinc-500 mt-1">coastal sweep, airy</div>
                  </div>
                </button>

                <button 
                  onClick={() => playChord('kirstenbosch', 'Kirstenbosch')}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    activeButton === 'kirstenbosch' 
                      ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-950/10' 
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity bg-gradient-to-br from-emerald-500 to-lime-500 pointer-events-none" />
                  <div className="relative font-mono">
                    <div className="text-[10px] text-emerald-300/80 mb-1">03</div>
                    <div className="text-xs font-semibold text-white">Kirstenbosch</div>
                    <div className="text-[9px] text-zinc-500 mt-1">garden hum, chimes</div>
                  </div>
                </button>

                <button 
                  onClick={() => playChord('clifton', 'Clifton')}
                  className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                    activeButton === 'clifton' 
                      ? 'border-amber-500 ring-1 ring-amber-500/30 bg-amber-950/10' 
                      : 'border-zinc-800 bg-zinc-950/50 hover:border-amber-500/40'
                  }`}
                >
                  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity bg-gradient-to-br from-amber-500 to-orange-500 pointer-events-none" />
                  <div className="relative font-mono">
                    <div className="text-[10px] text-amber-300/80 mb-1">04</div>
                    <div className="text-xs font-semibold text-white">Clifton</div>
                    <div className="text-[9px] text-zinc-500 mt-1">sunset, slow filter</div>
                  </div>
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Volume2 className="size-3.5 text-[#10b981]" />
                <span className="mono text-[10px] font-mono text-zinc-400">{audioHint}</span>
              </div>
            </div>

            {/* Repos Meta Info Card */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 relative space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">Metadata Index</h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Visibility</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                  <Lock className="size-3 text-zinc-500" /> Private
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Branch</span>
                <span className="font-mono text-[11px] text-zinc-300 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 flex items-center gap-1">
                  <GitBranch className="size-3 text-zinc-500" /> main
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Open issues</span>
                <span className="font-mono text-[11px] text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  0
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">License</span>
                <span className="font-mono text-[11px] text-zinc-300 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                  Proprietary
                </span>
              </div>
              <div className="border-t border-zinc-800/60 pt-3 flex gap-2 items-start mt-1">
                <AlertCircle className="size-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Private single origin archive. Synced to Utopia Planitia landing sequence targets.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ObservXRepoSnapshot;
