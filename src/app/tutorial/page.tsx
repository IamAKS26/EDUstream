"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

export default function TutorialPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12 pb-20 fade-in slide-up hidden-scrollbar">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/20 text-primary mb-4 shadow-[0_0_20px_rgba(255,179,0,0.3)]">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How to use EDU<span className="text-primary">stream</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Read this quick guide to maximize your AI-powered learning experience.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-[#141414] p-8 md:p-12 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Generate AI Courses</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Navigate to the <Link href="/module" className="text-primary hover:underline font-semibold">Catalog (My Courses)</Link> and click <b>Generate</b>. Enter any topic (e.g. "React Hooks" or "Advanced Machine Learning"), select a difficulty, and Edustream will automatically plan an entire curriculum, writing lessons, auto-generating quizzes, and composing coding tasks in under 60 seconds!
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-black p-6 rounded-3xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5 mx-4 mb-4 transform rotate-[-2deg]">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <span className="font-semibold text-sm">"Learn GoLang Basics"</span>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5 mx-4 mb-4 transform rotate-[1deg]">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <span className="font-semibold text-sm text-slate-500">Outline Created</span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-[#141414] p-8 md:p-12 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="order-2 md:order-1 bg-slate-50 dark:bg-black p-6 rounded-3xl border border-slate-100 dark:border-white/5">
            <div className="flex flex-col gap-3">
              <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-xl border-l-[3px] border-primary">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Task Unit</span>
                <p className="font-semibold text-sm">Implement Binary Search</p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 shadow-inner">
                <p>def binary_search(arr, val):</p>
                <p>&nbsp;&nbsp;pass # write your code here</p>
                <div className="mt-4 pt-2 border-t border-white/10 text-right">
                  <span className="px-3 py-1 bg-primary text-black rounded font-bold">Run Code</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">terminal</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Interactive Code Compiler</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When encountering a <b>"Task"</b> unit inside your course, simply click the <b>Solve Task</b> button in the corner! A fully-functional, built-in code editor will slide up, supporting Javascript, Python, C++, and more. Run your answers instantly within the platform without leaving your flow.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-[#141414] p-8 md:p-12 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">public</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Community & Sharing</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Want to share your custom AI-generated curriculum? Open your course overview page and click <b>Publish</b>. Head over to the <Link href="/community" className="text-primary hover:underline font-semibold">Community</Link> tab to browse, clone, and enroll in high-quality courses crafted by other developers within the ecosystem.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-black p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-center">
             <div className="text-center">
               <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">forum</span>
             </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/dashboard" className="px-8 py-4 bg-primary text-slate-900 font-bold rounded-full hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,179,0,0.4)] text-lg">
            Head to Dashboard
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
