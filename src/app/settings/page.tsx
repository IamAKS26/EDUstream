"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { SkeletonBar, SkeletonBlock } from "@/components/Skeleton";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [initializing, setInitializing] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [notifications, setNotifications] = useState({
    emailDigests: true,
    studyReminders: true,
    newCourseAlerts: false,
  });

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setInitializing(false), 800);
    return () => clearTimeout(t);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  if (initializing) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="space-y-2">
            <SkeletonBar className="h-8 w-36" />
            <SkeletonBar className="h-4 w-72" />
          </div>
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
            <SkeletonBar className="h-6 w-40" />
            <div className="flex items-center gap-6">
              <SkeletonBlock className="w-20 h-20 rounded-full" />
              <SkeletonBar className="h-9 w-32 rounded-xl" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
            <SkeletonBar className="h-6 w-32" />
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <SkeletonBar className="h-4 w-40" />
                  <SkeletonBar className="h-3 w-64" />
                </div>
                <SkeletonBlock className="w-11 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto space-y-8 pb-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile, preferences, and notifications.</p>
        </div>

        {/* Profile */}
        <section className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary">person</span> Profile Information
          </h3>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary shadow-inner">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <button className="px-4 py-2 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-sm font-semibold text-slate-900 dark:text-white rounded-xl transition-all border border-black/5 dark:border-white/10 shadow-sm">
                Change Avatar
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || "Student User"}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || "student@edustream.io"}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-white/10 transition-all outline-none"
                />
              </div>
            </div>
            <button className="mt-4 px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-[0_4px_12px_rgba(255,179,0,0.2)]">
              Save Changes
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary">palette</span> Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between light and dark theme.</p>
            </div>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isDark ? "bg-primary" : "bg-slate-200"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDark ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            {(["light", "system", "dark"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  theme === t
                    ? "bg-primary text-slate-900"
                    : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary">notifications</span> Notifications
          </h3>
          <div className="space-y-6">
            {[
              { key: "emailDigests" as const, label: "Weekly Activity Digest", desc: "Receive a weekly email summarizing your learning progress." },
              { key: "studyReminders" as const, label: "Study Reminders", desc: "Get notified when you haven't logged in for 3 days." },
              { key: "newCourseAlerts" as const, label: "New Course Recommendations", desc: "Get alerts when AI generates new personalized module paths." },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[item.key]}
                    onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:shadow-[0_0_12px_rgba(255,179,0,0.4)]"></div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl p-8 border border-red-500/20 bg-red-50/50 dark:bg-red-500/5">
          <h3 className="text-xl font-bold mb-2 text-red-500 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span> Danger Zone
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 font-bold rounded-xl transition-all text-sm">
            Delete Account
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
}
