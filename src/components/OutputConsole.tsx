"use client";

import React from "react";
import type { ExecutionResult } from "@/utils/pistonClient";

interface Props {
  result: ExecutionResult | null;
  loading: boolean;
}

export function OutputConsole({ result, loading }: Props) {
  const hasError = result && (result.error || result.stderr);
  const hasOutput = result && result.stdout;
  const isEmpty = !loading && !result;

  return (
    <div className="flex flex-col h-full">
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-slate-500">terminal</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output Console</span>
        </div>
        {result?.executionTime !== undefined && !loading && (
          <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">timer</span>
            {result.executionTime}ms
          </span>
        )}
      </div>

      {/* Console body */}
      <div className="flex-1 bg-[#0d0d0d] overflow-y-auto font-mono text-sm p-4 relative min-h-[120px]">

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-slate-500 text-xs animate-pulse">Running code...</span>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2 opacity-30">
              <span className="material-symbols-outlined text-4xl text-slate-500 block">play_circle</span>
              <p className="text-slate-500 text-xs">Run your code to see output here</p>
            </div>
          </div>
        )}

        {/* Fatal error (network/timeout) */}
        {!loading && result?.error && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-2 text-red-400">
              <span className="material-symbols-outlined text-base mt-0.5 flex-shrink-0">error_outline</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Error</p>
                <pre className="whitespace-pre-wrap text-red-400 text-xs leading-relaxed">{result.error}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Compile / runtime stderr */}
        {!loading && !result?.error && result?.stderr && (
          <div className="mb-3 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">bug_report</span>
              Stderr
            </p>
            <pre className="whitespace-pre-wrap text-red-400 text-xs leading-relaxed border-l-2 border-red-500/30 pl-3">{result.stderr}</pre>
          </div>
        )}

        {/* Stdout */}
        {!loading && !result?.error && result?.stdout && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            {result.stderr && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check</span>
                Stdout
              </p>
            )}
            <pre className="whitespace-pre-wrap text-green-300 text-xs leading-relaxed">{result.stdout}</pre>
          </div>
        )}

        {/* No output case */}
        {!loading && result && !result.error && !result.stdout && !result.stderr && (
          <div className="text-slate-600 text-xs italic animate-in fade-in">
            (No output — code ran successfully with exit code {result.exitCode})
          </div>
        )}
      </div>

      {/* Exit code badge */}
      {!loading && result && !result.error && (
        <div className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 border-t ${
          result.exitCode === 0
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          <span className="material-symbols-outlined text-[12px]">
            {result.exitCode === 0 ? "check_circle" : "cancel"}
          </span>
          {result.exitCode === 0 ? "Exited successfully" : `Exited with code ${result.exitCode}`}
        </div>
      )}
    </div>
  );
}
