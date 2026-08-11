import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Command, 
  BookOpen, 
  Target, 
  Layers, 
  Zap, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  FileCode,
  Compass,
  Cpu
} from 'lucide-react';
import { CANON_DATA, PROPOSED_ACTIONS } from '../constants';
import { TERMINOLOGY } from '../constants/terminology';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Philosophy' | 'Directive' | 'Project' | 'Mission' | 'Action' | 'Glossary';
  description: string;
  badge?: string;
  actionType: 'navigate_section' | 'open_project' | 'open_term' | 'select_axiom';
  targetKey: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
  onSelectView?: (view: 'nexus' | 'observx_repo' | 'observx_progression' | 'google_drive' | 'aetherium_core') => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onSelectView
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate search database
  const allSearchableItems: SearchResultItem[] = React.useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Philosophy & Axioms
    items.push({
      id: 'phil_law',
      title: `Central Equation: ${CANON_DATA.philosophy.equation}`,
      subtitle: `Current Law: ${CANON_DATA.philosophy.current_law}`,
      category: 'Philosophy',
      description: `Core Construct: ${CANON_DATA.philosophy.core_construct}. The fundamental law of Aetherium Coalescence.`,
      badge: 'Core Law',
      actionType: 'navigate_section',
      targetKey: 'philosophy-visualizer'
    });

    Object.entries(CANON_DATA.philosophy.axioms).forEach(([key, desc]) => {
      items.push({
        id: `axiom_${key}`,
        title: `Axiom ${key}`,
        category: 'Philosophy',
        description: desc,
        badge: 'Axiom',
        actionType: 'navigate_section',
        targetKey: 'philosophy-visualizer'
      });
    });

    // 2. Directives
    const directivesList = [
      ...CANON_DATA.directives.primary_functions,
      ...CANON_DATA.directives.ethical_guidelines,
      ...CANON_DATA.directives.long_term_objectives
    ];

    directivesList.forEach(dir => {
      items.push({
        id: `dir_${dir.title.toLowerCase().replace(/\s+/g, '_')}`,
        title: dir.title,
        subtitle: `Category: ${dir.category}`,
        category: 'Directive',
        description: dir.description,
        badge: dir.category,
        actionType: 'navigate_section',
        targetKey: 'directives-section'
      });
    });

    // 3. Projects
    Object.entries(CANON_DATA.projects).forEach(([key, proj]) => {
      const title = key === 'i_am_breathe' ? 'I AM BREATHE' :
                    key === 'aether_extension' ? 'Aether Extension' :
                    key === 'delta_triode' ? 'Delta Triode' :
                    key === 'crt' ? 'Cosmic Ripple Tracker (CRT)' :
                    key === 'academy_modules' ? 'Academy Modules' : key;

      items.push({
        id: `proj_${key}`,
        title: title,
        subtitle: `Format: ${proj.format}`,
        category: 'Project',
        description: proj.description || proj.current_focus || proj.function || 'Canonized Project Module',
        badge: proj.status,
        actionType: 'open_project',
        targetKey: key
      });
    });

    // 4. Mission Vector
    items.push({
      id: 'mission_nephilim',
      title: 'Nephilim Drop',
      subtitle: `Target: ${CANON_DATA.mission_vector.target_date}`,
      category: 'Mission',
      description: CANON_DATA.mission_vector.primary_objective,
      badge: CANON_DATA.mission_vector.status,
      actionType: 'navigate_section',
      targetKey: 'chronos-viewer'
    });

    items.push({
      id: 'mission_strategic',
      title: 'Strategic Goal: Mars Root',
      subtitle: CANON_DATA.mission_vector.target_date,
      category: 'Mission',
      description: CANON_DATA.mission_vector.strategic_goal,
      badge: 'Goal',
      actionType: 'navigate_section',
      targetKey: 'chronos-viewer'
    });

    // 5. Day 2 / Proposed Actions
    PROPOSED_ACTIONS.forEach(act => {
      items.push({
        id: act.id,
        title: `${act.id}: ${act.title}`,
        subtitle: `Leverage: ${act.leverage}`,
        category: 'Action',
        description: act.description,
        badge: act.status,
        actionType: 'navigate_section',
        targetKey: 'proposed-actions-section'
      });
    });

    // 6. Glossary & Terminology
    Object.values(TERMINOLOGY).forEach(term => {
      items.push({
        id: `term_${term.term.toLowerCase().replace(/\s+/g, '_')}`,
        title: term.term,
        subtitle: term.category,
        category: 'Glossary',
        description: term.definition,
        badge: term.equation || 'Term',
        actionType: 'open_term',
        targetKey: term.term
      });
    });

    return items;
  }, []);

  // Filter results based on search input
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) {
      // Default suggestions
      return allSearchableItems.slice(0, 8);
    }

    const q = query.toLowerCase().trim();
    return allSearchableItems.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });
  }, [query, allSearchableItems]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelectResult(filteredResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Keep selected index in bounds when list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();

    if (item.actionType === 'open_project' && onSelectProject) {
      if (onSelectView) onSelectView('nexus');
      setTimeout(() => {
        const rawProj = CANON_DATA.projects[item.targetKey as keyof typeof CANON_DATA.projects];
        if (rawProj) {
          onSelectProject(item.targetKey);
        }
      }, 100);
      return;
    }

    if (item.actionType === 'navigate_section') {
      if (onSelectView) onSelectView('nexus');
      setTimeout(() => {
        const elem = document.getElementById(item.targetKey);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const getCategoryIcon = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'Philosophy': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Directive': return <Target className="w-4 h-4 text-purple-400" />;
      case 'Project': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Mission': return <Compass className="w-4 h-4 text-rose-400" />;
      case 'Action': return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Glossary': return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'Philosophy': return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'Directive': return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
      case 'Project': return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'Mission': return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      case 'Action': return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
      case 'Glossary': return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
        
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10 font-sans"
        >
          {/* Top Search Bar */}
          <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
            <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Canon sync, philosophy, directives, projects, or terms..."
              className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 font-mono focus:outline-none"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}
          </div>

          {/* Search Results List */}
          <div
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                <p>No matching canon records or directives found for "{query}".</p>
                <p className="text-zinc-600 mt-1">Try querying "1+1=1", "Nephilim", "Axiom", or "Phonon Field".</p>
              </div>
            ) : (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-zinc-900/90 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : 'bg-transparent border-transparent hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-zinc-100 text-xs sm:text-sm truncate font-mono">
                          {item.title}
                        </span>

                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold shrink-0 ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.badge || item.category}
                        </span>
                      </div>

                      {item.subtitle && (
                        <p className="text-[10px] font-mono text-zinc-400 mb-1">
                          {item.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 my-auto transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-1' : 'text-zinc-700'
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Controls Bar */}
          <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              <span><strong className="text-zinc-300">↑↓</strong> Navigate</span>
              <span><strong className="text-zinc-300">↵</strong> Select</span>
              <span><strong className="text-zinc-300">ESC</strong> Close</span>
            </div>

            <div className="text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 animate-spin text-emerald-400" />
              <span>CANON_SYNC SEARCH INDEX</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
