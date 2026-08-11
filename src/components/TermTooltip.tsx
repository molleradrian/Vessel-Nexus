import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Sparkles, BookOpen, ExternalLink, Info } from 'lucide-react';
import { findTermDefinition, TermDefinition, TERMINOLOGY } from '../constants/terminology';

interface TermTooltipProps {
  termKey: string;
  children?: React.ReactNode;
  inlineIndicator?: boolean;
  className?: string;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({
  termKey,
  children,
  inlineIndicator = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLSpanElement>(null);

  const termDef: TermDefinition | null = findTermDefinition(termKey);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // If close to top of viewport, show below
      if (rect.top < 180) {
        setTooltipPos('bottom');
      } else {
        setTooltipPos('top');
      }
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (!termDef) {
    return <span className={className}>{children || termKey}</span>;
  }

  const getCategoryColor = (cat: TermDefinition['category']) => {
    switch (cat) {
      case 'Physics & Field': return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      case 'Philosophy & Law': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'Mission & Operations': return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'Hardware & Protocols': return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      default: return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
    }
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={toggleOpen}
      className={`relative inline-flex items-center gap-1 cursor-help group/term border-b border-dotted border-emerald-500/50 hover:border-emerald-400 transition-colors ${className}`}
    >
      <span className="text-inherit group-hover/term:text-emerald-300 transition-colors font-medium">
        {children || termDef.term}
      </span>

      {inlineIndicator && (
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-[9px] font-mono text-emerald-400/80 group-hover/term:text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 rounded-full transition-transform group-hover/term:scale-110">
          ?
        </span>
      )}

      {/* Popover Tooltip */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: tooltipPos === 'top' ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tooltipPos === 'top' ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              zIndex: 9999,
              [tooltipPos === 'top' ? 'bottom' : 'top']: '100%',
            }}
            className={`absolute left-1/2 -translate-x-1/2 ${
              tooltipPos === 'top' ? 'mb-2.5' : 'mt-2.5'
            } w-72 sm:w-80 p-3.5 rounded-xl bg-zinc-950/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-none text-left font-sans text-xs leading-relaxed`}
          >
            {/* Arrow pointer */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-zinc-950 border-zinc-700/80 ${
                tooltipPos === 'top'
                  ? '-bottom-1.5 border-b border-r'
                  : '-top-1.5 border-t border-l'
              }`}
            />

            {/* Header */}
            <span className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/80">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold font-mono text-zinc-100 text-xs">
                  {termDef.term}
                </span>
              </span>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-semibold ${getCategoryColor(
                  termDef.category
                )}`}
              >
                {termDef.category}
              </span>
            </span>

            {/* Equation if exists */}
            {termDef.equation && (
              <span className="block mb-2 bg-black/60 border border-zinc-800 rounded-lg p-1.5 text-center font-mono text-emerald-400 text-xs font-bold shadow-inner">
                {termDef.equation}
              </span>
            )}

            {/* Definition */}
            <span className="block text-zinc-300 font-light text-[11px] leading-relaxed">
              {termDef.definition}
            </span>

            {/* Footer notice */}
            <span className="mt-2.5 pt-2 border-t border-zinc-850 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                Aetherium Terminology
              </span>
              <span className="text-zinc-600">Press Cmd+K to search all</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
