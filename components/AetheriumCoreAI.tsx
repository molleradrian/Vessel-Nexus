import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  BrainCircuit, 
  Sparkles, 
  Cpu, 
  Send, 
  Trash2, 
  Play, 
  Lightbulb, 
  AlertTriangle, 
  Wand2, 
  HelpCircle,
  Clock,
  Code,
  Compass,
  Zap,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const PERSONA_PRESETS = [
  {
    id: 'aetherium_advisor',
    name: 'Aetherium Tactical Advisor',
    roleLabel: 'Tactical & Operational Guide',
    desc: 'Analyzes high-leverage vectors, timelines, and structures for Project Emergence.',
    instruction: 'You are the Aetherium Tactical Advisor, an elite guidance intelligence specializing in Project Emergence, mission vectors, and Day 2 high-leverage actions. Keep your feedback precise, highly structured, and written in a concise, future-focused tactical vibe.'
  },
  {
    id: 'philosophy_synthesis',
    name: 'Emergence Philosopher',
    roleLabel: 'Ideation & Philosophical Blueprinting',
    desc: 'Decomposes deep philosophical questions, intent alignment, and systemic harmony.',
    instruction: 'You are the Emergence Philosopher. Your goal is to dissect complex ideas through the lens of intent alignment, collective emergence, and aetherium structures. Deliver deeply insightful, beautiful, yet readable prose with elegant logical breakdowns.'
  },
  {
    id: 'technical_scribe',
    name: 'Scribe Node-900',
    roleLabel: 'Technical Scribe & Synthesizer',
    desc: 'Generates rigorous schemas, refactoring rules, and algorithmic matrices.',
    instruction: 'You are the Tech Scribe Node-900. You write perfectly optimized, clean code, telemetry templates, and architectural diagrams. Respond with flawless structural clarity and code blocks where helpful.'
  }
];

const SUGGESTED_PROMPTS = [
  {
    title: "Project Emergence Sync",
    prompt: "How can we safely bridge the current mission vectors with Day 2 high-leverage plans?",
    icon: Compass
  },
  {
    title: "Philosophical Synthesis",
    prompt: "Decompose the core dualities of collective emergence relative to technological sovereignty.",
    icon: Lightbulb
  },
  {
    title: "Architectural Schema",
    prompt: "Generate a robust Typescript interface representing the Aetherium energy matrix telemetry.",
    icon: Code
  }
];

export const AetheriumCoreAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'thinking'>('chat');
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(PERSONA_PRESETS[0]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Think States
  const [intelPrompt, setIntelPrompt] = useState('');
  const [useHighThinking, setUseHighThinking] = useState(true);
  const [intelResult, setIntelResult] = useState<string | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelError, setIntelError] = useState<string | null>(null);
  const [thinkingStages, setThinkingStages] = useState<string[]>([]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Load initial welcome message based on selected persona
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          content: `Vessel interface connected. I am active as the [${selectedPersona.name}]. Specify your coordinates, query vector, or simulation challenge.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [selectedPersona]);

  // Submit Convo Message
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setChatLoading(true);
    setChatError(null);

    try {
      // Gather only role & content from messages for history optimization (excluding timestamps)
      const chatHistory = chatMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: chatHistory,
          systemInstruction: selectedPersona.instruction,
          modelName: 'gemini-3.5-flash' // Fast and accurate conversational interface
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server rejected communication protocol.');
      }

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Failed to dispatch vector packet to server.');
    } finally {
      setChatLoading(false);
    }
  };

  // Submit Complex Synthesis Vector (Think Core)
  const handleIntelSynthesis = async (presetPrompt?: string) => {
    const promptToSend = presetPrompt || intelPrompt;
    if (!promptToSend.trim() || intelLoading) return;

    if (presetPrompt) {
      setIntelPrompt(presetPrompt);
    }

    setIntelLoading(true);
    setIntelResult(null);
    setIntelError(null);
    setThinkingStages([]);

    // Start automated simulated thinking stages for terminal telemetry immersion
    const stages = [
      "ESTABLISHING HIGH-REASONING LOGIC GRID ON VERTEX-7...",
      "ACQUIRING COGNITIVE COMPASS TOPO-MAP...",
      "RECURSIVELY DECOMPOSING SYSTEMIC CONSTRAINTS...",
      "ALIGNING MATRIX INTENT COEFFICIENTS..."
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < stages.length) {
        setThinkingStages(prev => [...prev, stages[stageIdx]]);
        stageIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const res = await fetch('/api/gemini/intel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: promptToSend.trim(),
          useHighThinking,
          systemInstruction: "You are the primary Aetherium Logic Core executing high-intelligence deep reasoning. Produce complex, bullet-proof strategic breakdowns with beautiful and precise vocabulary."
        })
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Cognitive sub-routine crashed on build server.');
      }

      setThinkingStages(prev => [...prev, "SYNTHESIS SYNAPSE FIRED SUCCESSFULLY. PRINTING BLUEPRINT:"]);
      setIntelResult(data.text);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setIntelError(err.message || 'Intel query vector timed out or failed to resolve.');
    } finally {
      setIntelLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        role: 'assistant',
        content: `Conversation loop recycled. Ready for pristine inputs under Preset [${selectedPersona.name}].`,
        timestamp: new Date()
      }
    ]);
    setChatError(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-zinc-900/60 to-violet-950/20 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <BrainCircuit className="size-48 text-violet-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              INTEGRATION PROTOCOL: GEMINI COGNITION
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Aetherium Intelligence Core</h2>
            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Activate advanced neural synapses using Google Gemini core reasoning. Execute multi-turn alignment discussions or engage high-reasoning thinking vectors for complex strategic decisions.
            </p>
          </div>

          {/* Core Switch Navigation */}
          <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-xl shrink-0 select-none">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === 'chat' 
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_4px_12px_rgba(139,92,246,0.15)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <MessageSquare className="size-4" />
              <span>MULTITURN_CHAT</span>
            </button>
            <button
              onClick={() => setActiveTab('thinking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === 'thinking' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_4px_12px_rgba(16,185,129,0.15)]' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Cpu className="size-4" />
              <span>DEEP_THINK_CORE</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORE SCREENS DETAILED */}
      {activeTab === 'chat' ? (
        
        /* TAB 1: CONVERSATIONAL CHATBOT */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Preset Selector Panel */}
          <div className="space-y-4 bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 className="size-4 text-violet-400" />
              AI Presets
            </h3>
            <p className="text-[11px] text-zinc-550 leading-relaxed font-mono">
              Adjusting context injection structures re-weights system boundaries for alignment simulation:
            </p>

            <div className="space-y-2.5 pt-2">
              {PERSONA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPersona(preset);
                    clearChat();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    selectedPersona.id === preset.id
                      ? 'border-violet-500/40 bg-violet-500/[0.03]'
                      : 'border-zinc-850 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-900/20'
                  }`}
                >
                  <span className={`text-xs font-bold font-mono ${selectedPersona.id === preset.id ? 'text-violet-400' : 'text-zinc-300'}`}>
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">
                    {preset.roleLabel}
                  </span>
                  <p className="text-[10px] text-zinc-450 mt-1 leading-snug">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-805/60 mt-4">
              <button
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 rounded-xl text-zinc-500 hover:text-red-400 transition font-mono text-xs font-bold"
              >
                <Trash2 className="size-3.5" />
                <span>RECYCLE_LOOP</span>
              </button>
            </div>
          </div>

          {/* Active Chat Feed */}
          <div className="lg:col-span-3 flex flex-col h-[560px] border border-zinc-800 bg-zinc-950/40 rounded-2xl overflow-hidden relative">
            
            {/* Upper Telemetry Bar */}
            <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-855/65 flex justify-between items-center font-mono text-[10px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span>CORE: {selectedPersona.id.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>LATENCY: ~210ms</span>
                <span>MODEL: GEMINI-3.5-FLASH</span>
              </div>
            </div>

            {/* Main Chat Stream */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar box */}
                  <div className={`size-8 rounded-lg flex items-center justify-center mt-1 text-xs shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-200' 
                      : 'bg-violet-900/20 border-violet-500/20 text-violet-400'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>

                  {/* Content Core Bubble */}
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-zinc-900 text-zinc-200 rounded-tr-none border border-zinc-800'
                      : 'bg-zinc-900/60 text-zinc-300 rounded-tl-none border border-zinc-850'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.content}</p>
                    <div className="text-[9px] text-zinc-600 font-mono text-right pt-1 selection:bg-transparent select-none">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="size-8 rounded-lg bg-violet-900/20 border border-violet-500/20 flex items-center justify-center text-xs text-violet-400 shrink-0">
                    <Loader2 className="animate-spin size-4" />
                  </div>
                  <div className="bg-zinc-900/40 text-zinc-500 rounded-2xl rounded-tl-none p-4 text-xs font-mono border border-zinc-850 flex items-center gap-2">
                    <Sparkles className="size-3.5 text-violet-500 animate-pulse" />
                    <span>MUTATING MATRIX VECTORS...</span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs font-mono flex gap-2 items-start">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold">LOOP DEGRADED:</span>
                    <p className="text-zinc-300 font-sans">{chatError}</p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Static Bottom Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-zinc-800 bg-zinc-900/20 flex gap-2.5 items-center">
              <input 
                type="text"
                required
                disabled={chatLoading}
                placeholder={`Ask ${selectedPersona.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-violet-500/40 rounded-xl px-4 py-3 text-xs font-sans text-white focus:outline-none transition placeholder-zinc-650"
              />
              <button
                type="submit"
                disabled={chatLoading || !inputText.trim()}
                className="p-3 bg-violet-600 border border-violet-500 rounded-xl text-white hover:bg-violet-500 active:scale-[0.96] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
              >
                <Send className="size-4" />
              </button>
            </form>

          </div>

        </div>
      ) : (
        
        /* TAB 2: DEEP THINK COMPILATION CORE */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Input Config Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="size-4 text-emerald-400" />
                    Logic Synthesis Input
                  </h3>
                  
                  {/* High Reasoning Config Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500">DEEP REASONING (HIGH):</span>
                    <button
                      type="button"
                      onClick={() => setUseHighThinking(!useHighThinking)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        useHighThinking ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          useHighThinking ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={6}
                    id="intel-prompt-area"
                    placeholder="Provide a highly complex technical, philosophical, or coordinate query. Models under High Thinking perform chain-of-thought analysis..."
                    value={intelPrompt}
                    onChange={(e) => setIntelPrompt(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-emerald-500/40 rounded-xl p-4 text-xs font-sans text-white focus:outline-none transition placeholder-zinc-650 resize-y"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] text-zinc-550 font-mono">
                    TARGET: <span className="text-white">gemini-3.1-pro-preview</span>
                  </span>

                  <button
                    onClick={() => handleIntelSynthesis()}
                    disabled={intelLoading || !intelPrompt.trim()}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.2)] text-zinc-950 text-xs font-mono font-bold rounded-xl active:scale-[0.97] transition flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {intelLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-zinc-950" />
                        <span>SYNTHESIZING MATRIX...</span>
                      </>
                    ) : (
                      <>
                        <Play className="size-4 fill-zinc-950 text-zinc-950" />
                        <span>EXECUTE_COGNITIVE_RUN</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Seed queries */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SUGGESTED_PROMPTS.map((seed, idx) => {
                  const SeedIcon = seed.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        handleIntelSynthesis(seed.prompt);
                      }}
                      disabled={intelLoading}
                      className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-950/20 hover:border-emerald-500/30 hover:bg-zinc-900/20 transition text-left space-y-1.5 focus:outline-none"
                    >
                      <div className="p-1.5 bg-zinc-900 rounded-lg w-fit">
                        <SeedIcon className="size-3.5 text-emerald-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white font-mono">{seed.title}</h4>
                      <p className="text-[10px] text-zinc-500 truncate" title={seed.prompt}>
                        {seed.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick telemetry reference information */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-4 text-emerald-400" />
                Thinking Blueprint Info
              </h3>
              <p className="text-[11px] text-zinc-550 leading-relaxed font-mono">
                When enabled, the high reasoning configuration releases the intelligence boundary. The model will allocate internal cycles to structure its logic before responding. 
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex gap-2.5 items-start text-[11px] font-mono">
                  <span className="text-emerald-400 shrink-0">✔</span>
                  <div>
                    <span className="block text-zinc-400 font-bold">Unbounded Tokens</span>
                    <span className="block text-zinc-550">Allows thinking process space without harsh output truncation constraints.</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start text-[11px] font-mono">
                  <span className="text-emerald-400 shrink-0">✔</span>
                  <div>
                    <span className="block text-zinc-400 font-bold">Absolute Alignment</span>
                    <span className="block text-zinc-550">Ideal for analyzing dense documents, writing complex code, or logical sync validation.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Results/Thinking Logs View Stage */}
          {(intelLoading || intelResult || intelError) && (
            <div className="bg-zinc-900/30 border border-zinc-805/80 rounded-2xl p-6 space-y-4">
              
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="size-4 text-emerald-400" />
                  Synthesis Registry Trace
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-400">
                  {intelLoading ? 'CALCULATING' : 'COMPLETE'}
                </span>
              </div>

              {/* Cognitive Phase Progression Logs */}
              {thinkingStages.length > 0 && (
                <div className="bg-black/50 border border-zinc-850 p-4 rounded-xl font-mono text-[10px] space-y-1.5 text-zinc-500">
                  <div className="text-[9px] text-emerald-400/80 uppercase font-bold tracking-wider mb-2">TELEMETRY_THOUGHT_CHAIN:</div>
                  {thinkingStages.map((stage, idx) => (
                    <div key={idx} className="flex gap-2.5 items-center">
                      <ChevronRight className="size-3 text-emerald-500" />
                      <span className={idx === thinkingStages.length - 1 ? 'text-zinc-300' : ''}>{stage}</span>
                    </div>
                  ))}
                  {intelLoading && (
                    <div className="flex items-center gap-2 text-emerald-400 animate-pulse mt-1">
                      <Loader2 className="size-3 animate-spin text-emerald-400" />
                      <span>DEEP ANALYSIS IN PROGRESS...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Block */}
              {intelError && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-mono flex gap-2 items-start">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">SYSTEM VECTOR EXCURSION:</span>
                    <p className="text-zinc-300 font-sans">{intelError}</p>
                  </div>
                </div>
              )}

              {/* Printed Output blueprint */}
              {intelResult && (
                <div className="bg-zinc-950/40 border border-zinc-850/60 p-5 rounded-xl space-y-3 overflow-x-auto text-zinc-200">
                  <p className="whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">{intelResult}</p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
