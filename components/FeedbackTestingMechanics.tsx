import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronDown, 
  CheckSquare, 
  Square,
  HelpCircle, 
  Settings, 
  Activity, 
  Code, 
  CheckCircle2, 
  ShieldCheck, 
  LineChart, 
  Database, 
  FileCode, 
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
}

interface Stage {
  id: number;
  title: string;
  desc: string;
  categories: string[];
  leftColumnTitle: string;
  leftTasks: Task[];
  rightColumnTitle: string;
  rightTasks: Task[];
  hasExtra?: 'schema' | 'frameworks';
}

const FeedbackTestingMechanics: React.FC = () => {
  const stages: Stage[] = [
    {
      id: 1,
      title: "Initial Setup",
      desc: "Establish capture points and test harness",
      categories: ["Collection", "Form Design"],
      leftColumnTitle: "User Feedback Mechanism",
      leftTasks: [
        { id: "s1-1", text: "Deploy in-app 'Send Feedback' button with context capture" },
        { id: "s1-2", text: "Configure contextual surveys (triggered by feature use)" },
        { id: "s1-3", text: "Add feature-specific prompts (NPS after 3 uses)" },
        { id: "s1-4", text: "Create D1 database schema" }
      ],
      rightColumnTitle: "Testing Framework",
      rightTasks: [
        { id: "s1-5", text: "Set up Jest for unit tests" },
        { id: "s1-6", text: "Configure Cypress for E2E flows" },
        { id: "s1-7", text: "Define unit / integration / e2e test structure" }
      ],
      hasExtra: "schema"
    },
    {
      id: 2,
      title: "Feedback Collection",
      desc: "Launch mechanism and validate ingestion",
      categories: ["Collection"],
      leftColumnTitle: "Launch mechanism",
      leftTasks: [
        { id: "s2-1", text: "Enable feedback button in production" },
        { id: "s2-2", text: "Trigger first-run survey after onboarding" }
      ],
      rightColumnTitle: "Initial testing",
      rightTasks: [
        { id: "s2-3", text: "Run baseline test suite across staging" },
        { id: "s2-4", text: "Validate data ingestion to D1" }
      ]
    },
    {
      id: 3,
      title: "Data Analysis and Prioritization",
      desc: "Turn signals into roadmap",
      categories: ["Analysis", "Prioritization"],
      leftColumnTitle: "Analyze feedback",
      leftTasks: [
        { id: "s3-1", text: "Aggregate feedback by sentiment and component" },
        { id: "s3-2", text: "Identify recurring themes and friction points" }
      ],
      rightColumnTitle: "Prioritize feedback",
      rightTasks: [
        { id: "s3-3", text: "Score by impact vs effort (RICE)" },
        { id: "s3-4", text: "Map top items to roadmap quarters" }
      ]
    },
    {
      id: 4,
      title: "Iterative Development",
      desc: "Build, test, ship",
      categories: ["Analysis"],
      leftColumnTitle: "Implement changes",
      leftTasks: [
        { id: "s4-1", text: "Ship top 3 feedback-driven fixes" },
        { id: "s4-2", text: "Version and tag releases with changelog" }
      ],
      rightColumnTitle: "Testing of new features",
      rightTasks: [
        { id: "s4-3", text: "Write tests before code (TDD)" },
        { id: "s4-4", text: "Run full Cypress regression suite" }
      ]
    },
    {
      id: 5,
      title: "Continuous Improvement",
      desc: "Automate and scale",
      categories: ["Collection", "Analysis"],
      leftColumnTitle: "Ongoing collection",
      leftTasks: [
        { id: "s5-1", text: "Schedule quarterly NPS pulse" },
        { id: "s5-2", text: "Monitor feedback volume and drop-offs" }
      ],
      rightColumnTitle: "Automated testing",
      rightTasks: [
        { id: "s5-3", text: "Integrate tests in CI/CD pipeline" },
        { id: "s5-4", text: "Set up nightly test runs with alerts" }
      ]
    },
    {
      id: 6,
      title: "Review and Adaptation",
      desc: "Close the loop",
      categories: ["Communication", "Prioritization"],
      leftColumnTitle: "Feedback loop",
      leftTasks: [
        { id: "s6-1", text: "Close loop with users (changelog + in-app notes)" },
        { id: "s6-2", text: "Publish feedback response rate and SLAs" }
      ],
      rightColumnTitle: "Review testing strategies",
      rightTasks: [
        { id: "s6-3", text: "Audit test coverage quarterly" },
        { id: "s6-4", text: "Update playbook based on operational incidents" }
      ]
    }
  ];

  // Flat task IDs for counting
  const totalTaskCount = 27;

  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>(() => {
    const saved: Record<number, boolean> = {};
    stages.forEach((stage, idx) => {
      const val = localStorage.getItem(`observx-stage-${idx}`);
      saved[stage.id] = val ? val === 'open' : idx === 0;
    });
    return saved;
  });

  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved: Record<string, boolean> = {};
    stages.forEach(stage => {
      [...stage.leftTasks, ...stage.rightTasks].forEach(t => {
        const key = `observx-task-${t.id}`;
        saved[t.id] = localStorage.getItem(key) === 'true';
      });
    });
    return saved;
  });

  const [schemaCopied, setSchemaCopied] = useState<boolean>(false);

  const toggleStage = (id: number, idx: number) => {
    setExpandedStages(prev => {
      const nextVal = !prev[id];
      localStorage.setItem(`observx-stage-${idx}`, nextVal ? 'open' : 'closed');
      return { ...prev, [id]: nextVal };
    });
  };

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => {
      const nextChecked = !prev[taskId];
      localStorage.setItem(`observx-task-${taskId}`, String(nextChecked));
      return { ...prev, [taskId]: nextChecked };
    });
  };

  const isStageComplete = (stage: Stage) => {
    const allTasks = [...stage.leftTasks, ...stage.rightTasks];
    return allTasks.every(t => checkedTasks[t.id]);
  };

  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = totalTaskCount ? Math.round((completedCount / totalTaskCount) * 100) : 0;

  const handleCopySchema = async () => {
    const code = `-- Cloudflare D1 schema for ObservX feedback pipeline
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY, -- ulid
  workspace_id TEXT NOT NULL,
  user_hash TEXT,
  type TEXT NOT NULL CHECK(type IN ('bug','feature','nps','survey','general')),
  severity TEXT CHECK(severity IN ('low','medium','high','critical')),
  message TEXT NOT NULL,
  rating INTEGER, -- 1-5 or 0-10
  url TEXT,
  component TEXT, -- 'dashboard','query-editor'
  app_version TEXT DEFAULT '1.0.0',
  meta_json TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','triaged','planned','shipped','closed')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_feedback_status_created ON feedback(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

CREATE TABLE IF NOT EXISTS test_runs (
  id TEXT PRIMARY KEY,
  suite TEXT NOT NULL, -- 'unit','integration','e2e'
  framework TEXT NOT NULL, -- 'jest','cypress'
  status TEXT NOT NULL, -- 'passed','failed'
  duration_ms INTEGER,
  commit_sha TEXT,
  branch TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);`;

    try {
      await navigator.clipboard.writeText(code);
      setSchemaCopied(true);
      setTimeout(() => setSchemaCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Progress Overview Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-200">Overall Progress Progression</span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/80 text-zinc-300">
              <Activity className="size-3 text-cyan-400 stroke-[3px]" /> Live sync • localStorage
            </span>
          </div>
          <span className="text-sm font-mono text-zinc-300 font-bold bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
            {progressPercent}% Completed • {completedCount}/{totalTaskCount} Tasks
          </span>
        </div>
        
        {/* Progress bar container */}
        <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 p-[1px]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(139,92,246,0.35)]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Phase Categories */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20">
            Collection
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
            Form Design
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Analysis
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/15">
            Prioritization
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Communication
          </span>
        </div>
      </div>

      {/* Checklist Chronology Timeline */}
      <div className="relative pl-1 md:pl-3">
        {/* Timeline structural line element */}
        <div className="absolute left-[21px] sm:left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-violet-500/60 via-slate-700/40 to-transparent" />

        <div className="space-y-6">
          {stages.map((stage, idx) => {
            const isCompleted = isStageComplete(stage);
            const isExpanded = expandedStages[stage.id];

            return (
              <article key={stage.id} className="relative pl-12 sm:pl-16">
                
                {/* Timeline visual node marker */}
                <div className="absolute left-0 top-3 z-10">
                  <div className={`relative h-11 w-11 sm:h-14 sm:w-14 rounded-2xl border transition-all duration-300 flex items-center justify-center shadow-lg ${
                    isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="size-6 text-emerald-400 stroke-[2.5px]" />
                    ) : (
                      <span className="text-lg sm:text-2xl font-bold font-mono tracking-tight">{stage.id}</span>
                    )}

                    {/* Badge absolute completion ring overlays */}
                    <div className={`absolute -bottom-1 -right-1 h-5.5 w-5.5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center transition-all ${
                      isCompleted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}>
                      <Check className="size-3 text-white stroke-[3px]" />
                    </div>
                  </div>
                </div>

                {/* Collapsible Panel Card */}
                <div className={`group rounded-2xl bg-zinc-900/40 border backdrop-blur-xl transition-all ${
                  isExpanded ? 'border-zinc-800' : 'border-zinc-800/60 hover:border-zinc-700/60'
                }`}>
                  <button 
                    onClick={() => toggleStage(stage.id, idx)}
                    className="w-full px-4 sm:px-6 py-4 flex items-start justify-between gap-4 text-left cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{stage.title}</h3>
                        {stage.categories.map(cat => (
                          <span key={cat} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700/80 text-zinc-300">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 leading-normal">{stage.desc}</p>
                    </div>
                    <ChevronDown className={`size-5 text-zinc-500 shrink-0 transition-transform duration-300 mt-1 ${isExpanded ? 'transform rotate-180' : ''}`} />
                  </button>

                  {/* Panel Internal Content */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 border-t border-zinc-900 pt-5 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Column Tasks */}
                        <div className="space-y-3.5">
                          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-violet-400" /> {stage.leftColumnTitle}
                          </h4>
                          <div className="space-y-2">
                            {stage.leftTasks.map(task => (
                              <label key={task.id} className="flex items-start gap-2.5 cursor-pointer py-1 block group">
                                <button 
                                  onClick={() => toggleTask(task.id)}
                                  className="mt-0.5 shrink-0 transition-colors focus:outline-none"
                                >
                                  {checkedTasks[task.id] ? (
                                    <CheckSquare className="size-4.5 text-violet-400 fill-violet-500/10" />
                                  ) : (
                                    <Square className="size-4.5 text-zinc-600 hover:text-zinc-400" />
                                  )}
                                </button>
                                <span className={`text-xs sm:text-sm transition-colors ${
                                  checkedTasks[task.id] 
                                    ? 'text-zinc-500 line-through decoration-zinc-700 decoration-1' 
                                    : 'text-zinc-300 group-hover:text-white'
                                }`}>
                                  {task.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Right Column Tasks */}
                        <div className="space-y-3.5">
                          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-cyan-400" /> {stage.rightColumnTitle}
                          </h4>
                          <div className="space-y-2">
                            {stage.rightTasks.map(task => (
                              <label key={task.id} className="flex items-start gap-2.5 cursor-pointer py-1 block group">
                                <button 
                                  onClick={() => toggleTask(task.id)}
                                  className="mt-0.5 shrink-0 transition-colors focus:outline-none"
                                >
                                  {checkedTasks[task.id] ? (
                                    <CheckSquare className="size-4.5 text-cyan-400 fill-cyan-500/10" />
                                  ) : (
                                    <Square className="size-4.5 text-zinc-600 hover:text-zinc-400" />
                                  )}
                                </button>
                                <span className={`text-xs sm:text-sm transition-colors ${
                                  checkedTasks[task.id] 
                                    ? 'text-zinc-500 line-through decoration-zinc-700 decoration-1' 
                                    : 'text-zinc-300 group-hover:text-white'
                                }`}>
                                  {task.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Extra context content specifically for Stage 1 */}
                      {stage.hasExtra === "schema" && (
                        <div className="space-y-4 pt-4 border-t border-zinc-900/80">
                          
                          {/* D1 code replica container block */}
                          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80">
                            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 bg-zinc-900/60">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                <Database className="size-3 text-violet-400" /> D1 Schema • feedback.sql
                              </span>
                              <button 
                                onClick={handleCopySchema}
                                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 transition"
                              >
                                {schemaCopied ? (
                                  <Check className="size-3 text-emerald-400" />
                                ) : (
                                  <ClipboardCheck className="size-3" />
                                )}
                                <span>{schemaCopied ? "Copied!" : "Copy"}</span>
                              </button>
                            </div>
                            
                            <div className="p-4 overflow-x-auto max-h-72 custom-scrollbar">
                              <pre className="text-[11px] font-mono text-zinc-300 leading-relaxed font-mono">
                                {`-- Cloudflare D1 schema for ObservX feedback pipeline
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY, -- ulid
  workspace_id TEXT NOT NULL,
  user_hash TEXT,
  type TEXT NOT NULL CHECK(type IN ('bug','feature','nps','survey','general')),
  severity TEXT CHECK(severity IN ('low','medium','high','critical')),
  message TEXT NOT NULL,
  rating INTEGER, -- 1-5 or 0-10
  url TEXT,
  component TEXT, -- 'dashboard','query-editor'
  app_version TEXT DEFAULT '1.0.0',
  meta_json TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','triaged','planned','shipped','closed')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_feedback_status_created ON feedback(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

CREATE TABLE IF NOT EXISTS test_runs (
  id TEXT PRIMARY KEY,
  suite TEXT NOT NULL, -- 'unit','integration','e2e'
  framework TEXT NOT NULL, -- 'jest','cypress'
  status TEXT NOT NULL, -- 'passed','failed'
  duration_ms INTEGER,
  commit_sha TEXT,
  branch TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);`}
                              </pre>
                            </div>
                          </div>

                          {/* Framework index visual badges */}
                          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850">
                            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                              Configured Framework Environment indexs
                            </span>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 font-mono text-zinc-300">jest</span>
                              <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 font-mono text-zinc-300">cypress</span>
                              <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 font-mono text-zinc-300">vitest</span>
                              <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800/80 font-mono text-zinc-300">testing-library</span>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  )}
                </div>

              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Bottom Block */}
      <footer className="mt-8 pt-6 border-t border-zinc-900">
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-violet-950/20 via-zinc-900/30 to-cyan-950/15 border border-zinc-800/80">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-400" /> Progression Synthesis
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            This pipeline transforms raw user signals into robust, validated product improvements. By pairing continuous qualitative feedback collection with Jest and Cypress automation harnesses, ObservX guarantees that every release stays deeply aligned with real-world user metrics and rigorous quality testing.
          </p>
          <div className="mt-4 pt-3.5 border-t border-zinc-800/60 flex flex-col sm:flex-row justify-between gap-3 text-xs font-mono text-zinc-500">
            <span>observx@aetheriumnexus.store</span>
            <span className="text-zinc-650 sm:block hidden">•</span>
            <span className="text-cyan-400">Feedback → Continuous Testing → Active Learning Loops</span>
          </div>
        </div>
        <p className="text-center text-[11px] font-mono text-zinc-600 mt-6">
          © ObservX • Designed for Sovereign System Calibration • Powered by Tailwind CSS
        </p>
      </footer>

    </div>
  );
};

export default FeedbackTestingMechanics;
