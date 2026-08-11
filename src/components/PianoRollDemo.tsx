import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Music, 
  Sliders, 
  Zap, 
  Layers, 
  Plus, 
  Trash2, 
  Radio, 
  Activity,
  Disc,
  Info
} from 'lucide-react';

export type InstrumentType = 'piano' | 'lead' | 'bass' | 'percussion';

export interface TrackConfig {
  id: string;
  name: string;
  instrument: InstrumentType;
  color: string; // Tailwind color name / hex
  muted: boolean;
  solo: boolean;
  volume: number; // 0 to 1
  grid: boolean[][]; // [pitchIndex][stepIndex]
}

const PITCHES = [
  { name: 'C5', freq: 523.25, isAccidental: false },
  { name: 'B4', freq: 493.88, isAccidental: false },
  { name: 'A#4', freq: 466.16, isAccidental: true },
  { name: 'A4', freq: 440.00, isAccidental: false },
  { name: 'G#4', freq: 415.30, isAccidental: true },
  { name: 'G4', freq: 392.00, isAccidental: false },
  { name: 'F#4', freq: 369.99, isAccidental: true },
  { name: 'F4', freq: 349.23, isAccidental: false },
  { name: 'E4', freq: 329.63, isAccidental: false },
  { name: 'D#4', freq: 311.13, isAccidental: true },
  { name: 'D4', freq: 293.66, isAccidental: false },
  { name: 'C#4', freq: 277.18, isAccidental: true },
  { name: 'C4', freq: 261.63, isAccidental: false },
  { name: 'B3', freq: 246.94, isAccidental: false },
  { name: 'A3', freq: 220.00, isAccidental: false },
  { name: 'G3', freq: 196.00, isAccidental: false },
  { name: 'C3 (Sub/Kick)', freq: 130.81, isAccidental: false },
];

const NUM_STEPS = 16;

const DEFAULT_TRACKS: TrackConfig[] = [
  {
    id: 'track-1',
    name: 'Acoustic Piano',
    instrument: 'piano',
    color: '#10b981', // emerald
    muted: false,
    solo: false,
    volume: 0.8,
    grid: Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false))
  },
  {
    id: 'track-2',
    name: 'Aether Lead',
    instrument: 'lead',
    color: '#06b6d4', // cyan
    muted: false,
    solo: false,
    volume: 0.75,
    grid: Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false))
  },
  {
    id: 'track-3',
    name: 'Sub Resonance',
    instrument: 'bass',
    color: '#f59e0b', // amber
    muted: false,
    solo: false,
    volume: 0.9,
    grid: Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false))
  },
  {
    id: 'track-4',
    name: 'Phonon Beat',
    instrument: 'percussion',
    color: '#f43f5e', // rose
    muted: false,
    solo: false,
    volume: 0.85,
    grid: Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false))
  }
];

// Presets data initialization
const loadPresetData = (tracks: TrackConfig[], presetName: string): TrackConfig[] => {
  const newTracks = JSON.parse(JSON.stringify(tracks)) as TrackConfig[];
  
  // Clear grids
  newTracks.forEach(t => {
    t.grid = Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false));
  });

  if (presetName === 'coalescence') {
    // Piano chords on steps 0, 4, 8, 12
    const piano = newTracks[0];
    [0, 4, 8, 12].forEach(step => {
      piano.grid[12][step] = true; // C4
      piano.grid[8][step] = true;  // E4
      piano.grid[5][step] = true;  // G4
      piano.grid[1][step] = true;  // B4
    });
    // Lead Arp
    const lead = newTracks[1];
    [0, 2, 4, 6, 8, 10, 12, 14].forEach((step, idx) => {
      const pitchIdx = [12, 8, 5, 3, 1, 3, 5, 8][idx % 8];
      lead.grid[pitchIdx][step] = true;
    });
    // Sub Bass on 0, 6, 8, 14
    const bass = newTracks[2];
    [0, 6, 8, 14].forEach(step => {
      bass.grid[16][step] = true; // C3
    });
    // Percussion on beats
    const perc = newTracks[3];
    [0, 4, 8, 12].forEach(step => perc.grid[16][step] = true); // Kick
    [4, 12].forEach(step => perc.grid[10][step] = true); // Snare
    [0, 2, 4, 6, 8, 10, 12, 14].forEach(step => perc.grid[3][step] = true); // HiHat
  } else if (presetName === 'utopia') {
    // Utopia Planitia Arp
    const lead = newTracks[1];
    for (let s = 0; s < NUM_STEPS; s++) {
      const p = [14, 12, 8, 5, 3, 1, 3, 5][s % 8];
      lead.grid[p][s] = true;
    }
    const bass = newTracks[2];
    [0, 4, 8, 12].forEach(step => bass.grid[15][step] = true); // G3
    const perc = newTracks[3];
    [0, 3, 6, 8, 11, 14].forEach(step => perc.grid[16][step] = true);
  } else if (presetName === 'phonon') {
    // Phonon Field Syncopated
    const piano = newTracks[0];
    [2, 6, 10, 14].forEach(step => {
      piano.grid[10][step] = true; // D4
      piano.grid[7][step] = true;  // F4
      piano.grid[3][step] = true;  // A4
    });
    const bass = newTracks[2];
    [0, 2, 8, 10].forEach(step => bass.grid[16][step] = true);
    const perc = newTracks[3];
    [0, 4, 8, 12].forEach(step => perc.grid[16][step] = true);
    [2, 6, 10, 14].forEach(step => perc.grid[8][step] = true);
  }

  return newTracks;
};

export const PianoRollDemo: React.FC = () => {
  const [tracks, setTracks] = useState<TrackConfig[]>(() => 
    loadPresetData(DEFAULT_TRACKS, 'coalescence')
  );
  const [activeTrackId, setActiveTrackId] = useState<string>('track-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(112);
  const [masterVolume, setMasterVolume] = useState<number>(0.8);
  const [activePreset, setActivePreset] = useState<string>('coalescence');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerIdRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);

  // Initialize Web Audio Context & Analyser
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, analyser: analyserRef.current };
  }, []);

  // Synthesizer trigger engine per instrument
  const playNote = useCallback((freq: number, instrument: InstrumentType, vol: number = 0.8) => {
    try {
      const { ctx, analyser } = getAudioContext();
      if (!ctx || !analyser) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(vol * masterVolume, now);
      masterGain.connect(analyser);

      if (instrument === 'piano') {
        // Acoustic/Electric Piano: Dual sine/triangle with quick decay
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now); // 1 octave overtone

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.85);
        osc2.stop(now + 0.85);

      } else if (instrument === 'lead') {
        // Aether Lead: Sawtooth with resonant filter sweep
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 1.5, now);
        filter.frequency.exponentialRampToValueAtTime(freq * 4, now + 0.05);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.4);
        filter.Q.setValueAtTime(4, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.55);

      } else if (instrument === 'bass') {
        // Sub Bass: Deep square/sine with sub filter
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq / 2, now); // Sub octave

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.5);

      } else if (instrument === 'percussion') {
        // Phonon Drums: Kick or Snare depending on pitch
        if (freq < 200) {
          // Sub Kick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.16);
        } else if (freq < 350) {
          // Snare / Noise burst
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.4, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

          noise.connect(noiseGain);
          noiseGain.connect(masterGain);
          noise.start(now);
        } else {
          // Hi-Hat
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(7000, now);

          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.3, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(masterGain);
          noise.start(now);
        }
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }, [getAudioContext, masterVolume]);

  // Sequencer loop execution
  useEffect(() => {
    if (!isPlaying) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      return;
    }

    const intervalMs = (60 / bpm / 4) * 1000; // 16th notes

    timerIdRef.current = window.setInterval(() => {
      const step = currentStepRef.current;
      
      // Determine if any track is soloed
      const hasSolo = tracks.some(t => t.solo);

      tracks.forEach(track => {
        if (track.muted) return;
        if (hasSolo && !track.solo) return;

        PITCHES.forEach((pitch, pitchIdx) => {
          if (track.grid[pitchIdx][step]) {
            playNote(pitch.freq, track.instrument, track.volume);
          }
        });
      });

      setCurrentStep(step);
      currentStepRef.current = (step + 1) % NUM_STEPS;
    }, intervalMs);

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isPlaying, bpm, tracks, playNote]);

  // Canvas Oscilloscope Rendering
  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const draw = () => {
      animFrame = requestAnimationFrame(draw);
      if (!analyserRef.current) {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx2d.fillStyle = 'rgba(9, 9, 11, 0.3)';
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);

      ctx2d.lineWidth = 1.5;
      ctx2d.strokeStyle = '#10b981'; // Emerald glow
      ctx2d.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx2d.moveTo(x, y);
        } else {
          ctx2d.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx2d.lineTo(canvas.width, canvas.height / 2);
      ctx2d.stroke();
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Grid Cell Toggle
  const toggleCell = (trackId: string, pitchIdx: number, stepIdx: number) => {
    setTracks(prevTracks => 
      prevTracks.map(track => {
        if (track.id !== trackId) return track;
        const newGrid = track.grid.map(row => [...row]);
        const nextVal = !newGrid[pitchIdx][stepIdx];
        newGrid[pitchIdx][stepIdx] = nextVal;

        if (nextVal) {
          playNote(PITCHES[pitchIdx].freq, track.instrument, track.volume);
        }

        return { ...track, grid: newGrid };
      })
    );
  };

  // Change Instrument Type for active track
  const handleInstrumentChange = (trackId: string, newInst: InstrumentType) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, instrument: newInst } : t));
  };

  // Toggle Mute / Solo
  const toggleMute = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t));
  };

  const toggleSolo = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, solo: !t.solo } : t));
  };

  // Preset Selection
  const handleSelectPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    setTracks(prev => loadPresetData(prev, presetKey));
  };

  // Clear Grid
  const handleClear = () => {
    setTracks(prev => prev.map(t => ({
      ...t,
      grid: Array(PITCHES.length).fill(false).map(() => Array(NUM_STEPS).fill(false))
    })));
  };

  const activeTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-6 shadow-2xl font-sans text-zinc-100 relative overflow-hidden">
      
      {/* Top Title & Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Music className="size-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold font-mono text-zinc-100">
                Aetherium Polyphonic Piano Roll
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 uppercase">
                4-Track Sequencer
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Interactive Web Audio step sequencer with assignable multi-instrument synthesis.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Oscilloscope Canvas */}
          <div className="relative w-32 h-9 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 hidden sm:block">
            <canvas ref={canvasRef} width={128} height={36} className="w-full h-full" />
            <span className="absolute bottom-1 right-1 text-[8px] font-mono text-zinc-600 uppercase">
              Oscilloscope
            </span>
          </div>

          {/* BPM Slider */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
            <span className="text-zinc-500 text-[10px]">BPM</span>
            <input
              type="range"
              min="60"
              max="180"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="w-16 accent-emerald-500 cursor-pointer h-1 bg-zinc-800 rounded"
            />
            <span className="text-emerald-400 font-bold w-7 text-right">{bpm}</span>
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => {
              if (!isPlaying) getAudioContext();
              setIsPlaying(!isPlaying);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="size-3.5 fill-current" />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              setCurrentStep(0);
              currentStepRef.current = 0;
            }}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Reset Playhead"
          >
            <RotateCcw className="size-3.5" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-900/50 text-zinc-400 hover:text-rose-400 transition-colors"
            title="Clear All Notes"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
          <Sparkles className="size-3.5 text-emerald-400 ml-1" />
          <span className="text-zinc-400">Presets:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'coalescence', label: 'Coalescence 1+1=1' },
            { id: 'utopia', label: 'Utopia Planitia Arp' },
            { id: 'phonon', label: 'Phonon Syncopated' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activePreset === p.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Track Tabs & Instrument Assign Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {tracks.map(track => {
          const isActive = track.id === activeTrackId;
          return (
            <div
              key={track.id}
              onClick={() => setActiveTrackId(track.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-zinc-900/90 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-xs font-bold font-mono text-zinc-200 truncate">
                    {track.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(track.id);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border transition-colors ${
                      track.muted
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSolo(track.id);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border transition-colors ${
                      track.solo
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>

              {/* Instrument Assignment Dropdown */}
              <div className="flex items-center justify-between gap-1 mt-1 pt-2 border-t border-zinc-800/50">
                <span className="text-[10px] font-mono text-zinc-500">Synth Engine:</span>
                <select
                  value={track.instrument}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleInstrumentChange(track.id, e.target.value as InstrumentType);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-zinc-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 focus:outline-none cursor-pointer"
                >
                  <option value="piano">Acoustic Piano</option>
                  <option value="lead">Aether Lead</option>
                  <option value="bass">Sub Bass</option>
                  <option value="percussion">Phonon Drums</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Piano Roll Grid Component */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col">
        
        {/* Step Numbers Header Bar */}
        <div className="flex items-center border-b border-zinc-800/80 bg-zinc-900/60 text-[10px] font-mono text-zinc-500 select-none">
          <div className="w-24 sm:w-28 shrink-0 px-3 py-2 border-r border-zinc-800/80 text-zinc-400 font-semibold">
            Pitch / Key
          </div>
          <div className="flex-1 grid grid-cols-16">
            {Array.from({ length: NUM_STEPS }).map((_, stepIdx) => (
              <div
                key={stepIdx}
                className={`py-2 text-center border-r border-zinc-850/60 font-mono transition-colors ${
                  currentStep === stepIdx && isPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : stepIdx % 4 === 0
                    ? 'text-zinc-300 bg-zinc-900/40'
                    : 'text-zinc-600'
                }`}
              >
                {stepIdx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Pitch Rows */}
        <div className="max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
          {PITCHES.map((pitch, pitchIdx) => {
            const isAccidental = pitch.isAccidental;

            return (
              <div
                key={pitch.name}
                className={`flex items-center border-b border-zinc-900 ${
                  isAccidental ? 'bg-zinc-950/80' : 'bg-zinc-900/30'
                }`}
              >
                {/* Piano Key Trigger Button */}
                <button
                  onClick={() => playNote(pitch.freq, activeTrack.instrument, activeTrack.volume)}
                  className={`w-24 sm:w-28 shrink-0 px-2.5 py-1.5 border-r border-zinc-800/80 flex items-center justify-between text-[10px] font-mono transition-all text-left group ${
                    isAccidental
                      ? 'bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-emerald-300'
                  }`}
                  title={`Preview ${pitch.name} (${Math.round(pitch.freq)}Hz)`}
                >
                  <span className="font-bold">{pitch.name}</span>
                  <span className="text-[8px] text-zinc-600 group-hover:text-emerald-400">
                    {Math.round(pitch.freq)}Hz
                  </span>
                </button>

                {/* Grid Cells for this Pitch */}
                <div className="flex-1 grid grid-cols-16 h-7">
                  {Array.from({ length: NUM_STEPS }).map((_, stepIdx) => {
                    const isStepActiveInCurrentTrack = activeTrack.grid[pitchIdx][stepIdx];
                    
                    // Check if note is active in any other track
                    const otherTracksWithNote = tracks.filter(
                      t => t.id !== activeTrack.id && !t.muted && t.grid[pitchIdx][stepIdx]
                    );

                    const isCurrentStepPlayhead = currentStep === stepIdx && isPlaying;

                    return (
                      <div
                        key={stepIdx}
                        onClick={() => toggleCell(activeTrack.id, pitchIdx, stepIdx)}
                        className={`relative border-r border-zinc-850/50 cursor-pointer transition-all flex items-center justify-center ${
                          isStepActiveInCurrentTrack
                            ? 'z-10'
                            : isCurrentStepPlayhead
                            ? 'bg-emerald-500/10'
                            : stepIdx % 4 === 0
                            ? 'bg-zinc-900/20 hover:bg-zinc-800/40'
                            : 'hover:bg-zinc-800/30'
                        }`}
                      >
                        {/* Playhead highlight line */}
                        {isCurrentStepPlayhead && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                        )}

                        {/* Note Block for Active Track */}
                        {isStepActiveInCurrentTrack && (
                          <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-5 rounded-md mx-0.5 border shadow-sm transition-transform hover:scale-105"
                            style={{
                              backgroundColor: activeTrack.color,
                              borderColor: `${activeTrack.color}dd`,
                              boxShadow: isCurrentStepPlayhead
                                ? `0 0 10px ${activeTrack.color}`
                                : 'none'
                            }}
                          />
                        )}

                        {/* Ghost Note Markers for Other Tracks */}
                        {!isStepActiveInCurrentTrack && otherTracksWithNote.length > 0 && (
                          <div className="flex gap-0.5">
                            {otherTracksWithNote.map(ot => (
                              <span
                                key={ot.id}
                                className="size-1.5 rounded-full opacity-60"
                                style={{ backgroundColor: ot.color }}
                                title={`Note in ${ot.name}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sequencer Footer Status */}
        <div className="px-3 py-2 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Radio className="size-3 text-emerald-400 animate-pulse" />
            <span>Editing: <strong style={{ color: activeTrack.color }}>{activeTrack.name}</strong> ({activeTrack.instrument.toUpperCase()})</span>
          </div>

          <div className="flex items-center gap-3 hidden sm:flex">
            <span>Grid: 16 Steps</span>
            <span>Synthesizer: Web Audio API</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PianoRollDemo;
