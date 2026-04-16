"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  executeCode,
  STARTER_CODE,
  LANGUAGE_LABELS,
  type SupportedLanguage,
  type ExecutionResult,
} from "@/utils/pistonClient";
import { OutputConsole } from "./OutputConsole";

interface TaskInfo {
  title?: string;
  description?: string;
  instructions?: string;
  sampleInput?: string;
  sampleOutput?: string;
  expectedOutput?: string;
  language?: string;
  starterCode?: string;
}

interface Props {
  task: TaskInfo;
  onClose: () => void;
  onSubmitComplete?: () => void;
}

const LANGUAGES: SupportedLanguage[] = ["python", "javascript", "cpp"];

function normalizeOutput(s: string) {
  return s.trim().replace(/\r\n/g, "\n");
}

export function CodingWorkspace({ task, onClose, onSubmitComplete }: Props) {
  // Prefer task's language if it maps to a supported one
  const getInitialLang = (): SupportedLanguage => {
    const l = task.language?.toLowerCase() ?? "";
    if (l.includes("python")) return "python";
    if (l.includes("javascript") || l.includes("js")) return "javascript";
    if (l.includes("cpp") || l.includes("c++")) return "cpp";
    return "python";
  };

  const [language, setLanguage] = useState<SupportedLanguage>(getInitialLang);
  const [code, setCode] = useState<string>(() => {
    const lang = getInitialLang();
    return task.starterCode || STARTER_CODE[lang];
  });
  const [stdin, setStdin] = useState(task.sampleInput ?? "");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [verdict, setVerdict] = useState<"passed" | "failed" | null>(null);
  const [activePanel, setActivePanel] = useState<"problem" | "io">("problem");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync line numbers scroll with textarea
  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // When language changes, replace code with starter template
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(task.starterCode || STARTER_CODE[lang]);
    setResult(null);
    setVerdict(null);
  };

  // Tab key support in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  const handleRun = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setVerdict(null);
    const res = await executeCode(language, code, stdin);
    setResult(res);
    setRunning(false);
  }, [running, language, code, stdin]);

  const handleSubmit = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setVerdict(null);

    const res = await executeCode(language, code, stdin);
    setResult(res);
    setRunning(false);

    // Frontend-only comparison
    const expected = task.expectedOutput ?? task.sampleOutput ?? "";
    if (expected.trim() !== "") {
      const actual = normalizeOutput(res.stdout);
      const expectedNorm = normalizeOutput(expected);
      setVerdict(actual === expectedNorm ? "passed" : "failed");
    } else {
      // No expected output to compare — pass if exit code 0
      setVerdict(res.exitCode === 0 && !res.error ? "passed" : "failed");
    }

    if (onSubmitComplete && res.exitCode === 0 && !res.error) {
      onSubmitComplete();
    }
  }, [running, language, code, stdin, task, onSubmitComplete]);

  const lines = code.split("\n");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#0f0f0f]"
      style={{ fontFamily: "var(--font-display, Inter, sans-serif)" }}
    >
      {/* ─── Top Bar ─── */}
      <header className="flex items-center justify-between px-4 h-12 bg-[#1a1a1a] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-sm"
            title="Close workspace (Esc)"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="hidden sm:inline font-medium">Back</span>
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="material-symbols-outlined text-primary text-sm">code_blocks</span>
            <span className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">
              {task.title || "Coding Task"}
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="appearance-none bg-[#252525] border border-white/10 text-white text-xs font-semibold rounded-lg pl-3 pr-7 py-1.5 outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{LANGUAGE_LABELS[l]}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 text-[14px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleRun}
            disabled={running || !code.trim()}
            id="coding-run-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {running ? (
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            )}
            Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={running || !code.trim()}
            id="coding-submit-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-slate-900 text-xs font-bold rounded-lg transition-all shadow-[0_2px_8px_rgba(255,179,0,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {running ? (
              <span className="material-symbols-outlined text-sm animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">publish</span>
            )}
            Submit
          </button>
        </div>
      </header>

      {/* ─── Verdict Banner ─── */}
      {verdict && (
        <div
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold flex-shrink-0 animate-in slide-in-from-top-2 ${
            verdict === "passed"
              ? "bg-green-500/15 text-green-400 border-b border-green-500/20"
              : "bg-red-500/15 text-red-400 border-b border-red-500/20"
          }`}
        >
          <span className="material-symbols-outlined text-base">
            {verdict === "passed" ? "check_circle" : "cancel"}
          </span>
          {verdict === "passed"
            ? "✅ All tests passed! Great work."
            : "❌ Output doesn't match expected. Keep trying!"}
          <button
            onClick={() => setVerdict(null)}
            className="ml-auto text-xs opacity-50 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── Main Content: Split Layout ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL: Problem ── */}
        <div className="w-[38%] min-w-[280px] max-w-[480px] flex flex-col border-r border-white/5 bg-[#141414] overflow-hidden">
          {/* Left panel tabs */}
          <div className="flex border-b border-white/5 flex-shrink-0">
            {(["problem", "io"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePanel(tab)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activePanel === tab
                    ? "text-primary border-b-2 border-primary -mb-px"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab === "problem" ? "Problem" : "Test I/O"}
              </button>
            ))}
          </div>

          {/* Left panel content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activePanel === "problem" && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    {task.title || "Coding Challenge"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Complete the task in the editor →
                  </p>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">description</span>
                    Description
                  </p>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {task.instructions || task.description || "Implement a solution for this task. Read the problem carefully and write clean, efficient code."}
                  </div>
                </div>

                {(task.sampleInput || task.sampleOutput) && (
                  <div className="space-y-3">
                    {task.sampleInput && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">input</span>
                          Sample Input
                        </p>
                        <div className="bg-[#0d0d0d] rounded-lg p-3 border border-white/5">
                          <pre className="text-green-400 font-mono text-xs leading-relaxed">{task.sampleInput}</pre>
                        </div>
                      </div>
                    )}
                    {task.sampleOutput && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">output</span>
                          Expected Output
                        </p>
                        <div className="bg-[#0d0d0d] rounded-lg p-3 border border-white/5">
                          <pre className="text-blue-400 font-mono text-xs leading-relaxed">{task.sampleOutput}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tips */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                    Tips
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1 leading-relaxed">
                    <li>• Use <kbd className="bg-white/10 px-1 rounded text-[10px]">Tab</kbd> to indent your code</li>
                    <li>• Press <strong className="text-slate-300">Run</strong> to test your solution</li>
                    <li>• Press <strong className="text-primary">Submit</strong> to check against expected output</li>
                    <li>• Press <kbd className="bg-white/10 px-1 rounded text-[10px]">Esc</kbd> to return to the lesson</li>
                  </ul>
                </div>
              </>
            )}

            {activePanel === "io" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">input</span>
                    Stdin (Custom Input)
                  </label>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    rows={6}
                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl p-3 font-mono text-xs text-green-300 placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-primary/40 resize-y"
                  />
                </div>

                {result?.stdout && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">output</span>
                      Last stdout
                    </label>
                    <div className="bg-[#0d0d0d] border border-white/5 rounded-xl p-3">
                      <pre className="font-mono text-xs text-green-300 whitespace-pre-wrap">{result.stdout}</pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Editor + Console ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Code Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-black/40 flex-shrink-0">
              <div className="flex gap-1.5 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                {LANGUAGE_LABELS[language]}
              </span>
            </div>

            {/* Editor area — line numbers + textarea */}
            <div className="flex flex-1 overflow-hidden bg-[#1e1e1e]">
              {/* Line numbers */}
              <div
                ref={lineNumbersRef}
                className="py-4 px-3 text-right text-[#444] font-mono text-xs leading-5 border-r border-[#2a2a2a] select-none bg-[#1e1e1e] overflow-hidden flex-shrink-0 min-w-[40px]"
                style={{ lineHeight: "1.5rem" }}
              >
                {lines.map((_, i) => (
                  <div key={i} style={{ height: "1.5rem" }}>{i + 1}</div>
                ))}
              </div>

              {/* The editor */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="flex-1 bg-transparent py-4 px-4 font-mono text-xs text-[#d4d4d4] outline-none resize-none leading-6"
                style={{
                  whiteSpace: "pre",
                  overflowWrap: "normal",
                  overflowX: "auto",
                  tabSize: 2,
                  lineHeight: "1.5rem",
                }}
                placeholder={`Write your ${LANGUAGE_LABELS[language]} code here...`}
              />
            </div>
          </div>

          {/* Output Console — fixed height */}
          <div className="h-52 flex flex-col border-t border-white/5 flex-shrink-0 overflow-hidden">
            <OutputConsole result={result} loading={running} />
          </div>
        </div>
      </div>
    </div>
  );
}
