"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { CodeEditor } from "./CodeEditor";

// Lazy-load the full coding workspace to keep initial bundle small
const CodingWorkspace = lazy(() =>
  import("./CodingWorkspace").then((m) => ({ default: m.CodingWorkspace }))
);

interface Props {
  unit: any;
  moduleId: string;
  onComplete: (payload: { timeSpent: number }) => void;
}

export function TaskViewer({ unit, moduleId, onComplete }: Props) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [submission, setSubmission] = useState("");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const content = unit.content || {};
  const isProgrammingTask = true; // Always show code editor for tasks as per requirements

  // Build the task info object that CodingWorkspace needs
  const taskInfo = {
    title: content.title,
    description: content.description,
    instructions: content.instructions,
    sampleInput: content.sampleInput,
    sampleOutput: content.sampleOutput,
    expectedOutput: content.expectedOutput || content.sampleOutput,
    language: content.language,
    starterCode: content.starterCode,
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">{content.title || "Interactive Task"}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Complete the assignment below.</p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl">code_blocks</span>
        </div>

        {/* Task description / instructions */}
        <div className="bg-slate-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-black/5 dark:border-white/5 mb-8 whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-sm">
          {content.instructions || content.description || "Write a simple function that implements binary search. Paste the code below when finished."}
        </div>

        {/* Sample I/O Preview (if available) */}
        {(content.sampleInput || content.sampleOutput) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {content.sampleInput && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">input</span>
                  Sample Input
                </p>
                <div className="bg-[#1e1e1e] rounded-xl p-3 border border-black dark:border-white/5">
                  <pre className="text-green-400 font-mono text-xs leading-relaxed">{content.sampleInput}</pre>
                </div>
              </div>
            )}
            {content.sampleOutput && (
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">output</span>
                  Expected Output
                </p>
                <div className="bg-[#1e1e1e] rounded-xl p-3 border border-black dark:border-white/5">
                  <pre className="text-blue-400 font-mono text-xs leading-relaxed">{content.sampleOutput}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coding task: Solve Task button + existing AI review editor */}
        {isProgrammingTask ? (
          <div className="space-y-6">
            {/* ── Primary CTA: Open the live coding workspace ── */}
            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-400/5 border border-primary/20">
              <div>
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
                  Solve in Online Compiler
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Write, run, and test your code with real-time execution
                </p>
              </div>
              <button
                id="solve-task-btn"
                onClick={() => setWorkspaceOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(255,179,0,0.3)] text-sm whitespace-nowrap"
              >
                Solve Task
                <span className="material-symbols-outlined text-base">open_in_full</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">or submit for AI review</span>
              <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
            </div>

            {/* ── Existing AI review editor (untouched) ── */}
            <CodeEditor
              language={content.language}
              starterCode={content.starterCode || ""}
              taskDescription={content.instructions || content.description || ""}
              onSubmit={() => onComplete({ timeSpent })}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-200 uppercase tracking-wider">Your Solution</label>
            <textarea
              rows={6}
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Type or paste your answer here..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-xl p-4 text-slate-700 dark:text-slate-300 font-mono text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-y placeholder:text-slate-400"
            />
            <div className="mt-4 flex justify-end pt-4 border-t border-black/5">
              <button
                onClick={() => onComplete({ timeSpent })}
                disabled={submission.length < 5}
                className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(255,179,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Task <span className="material-symbols-outlined text-lg">publish</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Coding Workspace Modal (lazy loaded) ─── */}
      {workspaceOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f]">
              <div className="flex flex-col items-center gap-4 text-primary">
                <div className="w-12 h-12 rounded-full border-t-2 border-primary border-r-2 animate-spin" />
                <p className="text-sm font-medium animate-pulse">Loading workspace...</p>
              </div>
            </div>
          }
        >
          <CodingWorkspace
            task={taskInfo}
            onClose={() => setWorkspaceOpen(false)}
            onSubmitComplete={() => {
              setWorkspaceOpen(false);
              onComplete({ timeSpent });
            }}
          />
        </Suspense>
      )}
    </>
  );
}
