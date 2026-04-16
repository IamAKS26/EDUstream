"use client";

import React from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

const FEATURES: Feature[] = [
  {
    icon: "code_blocks",
    title: "Live Coding Workspace",
    description: "Solve coding tasks directly in the browser with real-time execution powered by Piston API.",
    badge: "New",
  },
  {
    icon: "auto_awesome",
    title: "AI Adaptive Learning",
    description: "The AI engine serves the optimal next unit — lesson, quiz, video, or task — based on your pace.",
    badge: "Core",
  },
  {
    icon: "insights",
    title: "AI Code Review",
    description: "Submit code for instant feedback from a simulated senior developer reviewer powered by Groq.",
  },
  {
    icon: "sticky_note_2",
    title: "Smart Notes",
    description: "Capture, search, and star notes across all modules. Synced to your learning session.",
  },
  {
    icon: "local_fire_department",
    title: "Streak & XP System",
    description: "Stay motivated with daily streaks, XP points, badges, and certificate milestones.",
    badge: "Updated",
  },
  {
    icon: "forum",
    title: "Community Feed",
    description: "Share knowledge, ask questions, and rate posts in the peer learning community.",
  },
];

export function NewFeaturesSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">new_releases</span>
            New Features
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Recently added to your learning platform
          </p>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
          v2.0
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group bg-white dark:bg-[#141414] border border-black/5 dark:border-white/5 rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-default relative overflow-hidden"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

            <div className="flex items-start gap-3 relative">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-[18px]">{f.icon}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                    {f.title}
                  </p>
                  {f.badge && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      f.badge === "New"
                        ? "bg-green-500/15 text-green-500"
                        : f.badge === "Updated"
                        ? "bg-blue-500/15 text-blue-400"
                        : "bg-primary/15 text-primary"
                    }`}>
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
