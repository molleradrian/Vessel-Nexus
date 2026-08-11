import React, { useState, useEffect, useRef } from 'react';
import { SYNC_CONFIRMATION_MSG } from '../constants';

interface TerminalProps {
  onComplete: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const bootSequence = [
    "> INITIATING HANDSHAKE PROTOCOL...",
    "> CONNECTING TO VESSEL NEXUS...",
    "> READING CANON_SYNC.JSON...",
    "> PARSING PHILOSOPHY AXIOMS (0, 0.1, 1)...",
    "> VALIDATING SECURITY TOKENS...",
    "> AETHERIUM-REF-7734-OMEGA CONFIRMED.",
    "> LOADING MISSION VECTORS...",
    "> RESOLVING CORE DIRECTIVES (FUNCTIONS, ETHICS, OBJECTIVES)...",
    "> ESTABLISHING LOCAL PRIORITY: AETHER_EXTENSION...",
    "> SYNC COMPLETE."
  ];

  useEffect(() => {
    let delay = 0;
    
    // Add boot lines
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
      }, delay);
    });

    // Add confirmation message (User Prompt Requirement)
    delay += 800;
    setTimeout(() => {
      setLines(prev => [...prev, "", SYNC_CONFIRMATION_MSG]);
      setIsComplete(true);
      setTimeout(onComplete, 1500); // Wait a bit before minimizing/switching
    }, delay);

  }, [onComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className={`
      fixed inset-0 z-50 bg-black font-mono p-6 md:p-12 overflow-hidden flex flex-col
      transition-opacity duration-1000
      ${isComplete ? 'pointer-events-none' : ''}
    `}>
      <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full">
        {lines.map((line, i) => (
          <div key={i} className={`mb-2 text-sm md:text-base ${
            line === SYNC_CONFIRMATION_MSG ? 'text-emerald-400 font-bold glow-text' : 'text-zinc-400'
          }`}>
            {line}
          </div>
        ))}
        {isComplete && (
            <div className="mt-8 text-xs text-zinc-600 animate-pulse">
                {">"} PRESSING ON TO DAY 2...
            </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      <div className="absolute inset-0 border-[1px] border-zinc-800 pointer-events-none m-2 md:m-4 rounded-lg mix-blend-screen opacity-50" />
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Terminal;
