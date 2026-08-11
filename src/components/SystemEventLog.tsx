import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, ChevronDown, ChevronUp, Trash2, Activity, Sparkles, Shield, Radio } from 'lucide-react';

export interface LogEvent {
  id: string;
  timestamp: string;
  type: 'phase' | 'view' | 'system' | 'action';
  message: string;
  code?: string;
}

interface SystemEventLogProps {
  logs: LogEvent[];
  onClearLogs?: () => void;
  autoCycleActive: boolean;
  currentPhaseName?: string;
}

export const SystemEventLog: React.FC<SystemEventLogProps> = ({
  logs,
  onClearLogs,
  autoCycleActive,
  currentPhaseName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastLogIdRef = useRef<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log window to bottom when new logs arrive & track unread
  useEffect(() => {
    if (logs.length > 0) {
      const latest = logs[logs.length - 1];
      if (latest.id !== lastLogIdRef.current) {
        lastLogIdRef.current = latest.id;
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }
    }
  }, [logs, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }
  }, [isOpen, logs]);

  const getTypeStyle = (type: LogEvent['type']) => {
    switch (type) {
      case 'phase':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'view':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'action':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      default:
        return 'text-zinc-400 bg-zinc-900 border-zinc-800';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 sm:w-96 mb-3 bg-zinc-950/95 border border-zinc-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <Activity className={`w-3.5 h-3.5 ${autoCycleActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                  {autoCycleActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </div>
                <span className="font-bold text-zinc-100 tracking-tight">System Event Log</span>
                {autoCycleActive && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 uppercase font-bold">
                    ACO ACTIVE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {onClearLogs && logs.length > 0 && (
                  <button
                    onClick={onClearLogs}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Clear Log History"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Current Phase Sub-bar if active */}
            {autoCycleActive && currentPhaseName && (
              <div className="px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center justify-between text-[10px] font-mono text-emerald-300">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
                  Current Phase:
                </span>
                <span className="font-bold truncate max-w-[180px]">{currentPhaseName}</span>
              </div>
            )}

            {/* Log Stream List */}
            <div
              ref={logContainerRef}
              className="max-h-64 min-h-[140px] overflow-y-auto p-2.5 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 font-mono text-[11px] leading-relaxed"
            >
              {logs.length === 0 ? (
                <div className="py-8 text-center text-zinc-600 text-xs font-mono">
                  <Terminal className="w-5 h-5 mx-auto mb-1.5 opacity-40" />
                  No events recorded yet.
                </div>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-zinc-900/70 border border-zinc-850 hover:border-zinc-750 transition-colors flex items-start gap-2 text-left"
                  >
                    <span className="text-[9px] text-zinc-500 shrink-0 font-mono mt-0.5">
                      {log.timestamp}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold shrink-0 ${getTypeStyle(
                            log.type
                          )}`}
                        >
                          {log.type}
                        </span>

                        {log.code && (
                          <span className="text-[9px] font-bold text-zinc-300 truncate">
                            {log.code}
                          </span>
                        )}
                      </div>

                      <div className="text-zinc-300 font-light text-[10.5px] break-words">
                        {log.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span>{logs.length} total events logged</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Real-time Telemetry
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-mono shadow-lg backdrop-blur-md transition-all cursor-pointer ${
          isOpen
            ? 'bg-zinc-900 text-zinc-100 border-zinc-700 shadow-zinc-950/80'
            : autoCycleActive
            ? 'bg-zinc-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
            : 'bg-zinc-950/90 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Activity className={`w-3.5 h-3.5 ${autoCycleActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'}`} />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-bounce" />
          )}
        </div>

        <span className="font-bold text-[11px] hidden sm:inline">Event Log</span>

        {unreadCount > 0 && !isOpen && (
          <span className="bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
            +{unreadCount}
          </span>
        )}

        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
        )}
      </motion.button>
    </div>
  );
};

export default SystemEventLog;
