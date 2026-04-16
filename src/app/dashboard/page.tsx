"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { DynamicCalendar } from "@/components/DynamicCalendar";
import { NewFeaturesSection } from "@/components/NewFeaturesSection";

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  instructor?: string;
  instructorEmail?: string;
  createdByEmail?: string;
  hours?: number;
  progress?: number;
  isFree?: boolean;
  isAIGenerated?: boolean;
  isPublished?: boolean;
  lessonsCount?: number;
  completedModules?: number;
  totalModules?: number;
  createdAt?: string;
  thumbnail?: string;
}

// Deterministic gradient / icon per course id (avoids duplicate-looking cards)
const BANNER_GRADIENTS = [
  "from-violet-500/30 to-purple-400/5",
  "from-blue-500/30 to-cyan-400/5",
  "from-emerald-500/30 to-teal-400/5",
  "from-orange-500/30 to-amber-400/5",
  "from-rose-500/30 to-pink-400/5",
  "from-indigo-500/30 to-blue-400/5",
];
const BANNER_ICONS = ["menu_book","code","science","design_services","psychology","analytics"];

function getBannerVariant(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    gradient: BANNER_GRADIENTS[hash % BANNER_GRADIENTS.length],
    icon: BANNER_ICONS[hash % BANNER_ICONS.length],
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    xp: 0, badges: 0, certificates: 0, streak: 0, learningHours: 0,
  });
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/stats/overview");
        setStats({
          xp: res.data.xp || 0,
          badges: res.data.badges || 0,
          certificates: res.data.certificates || 0,
          streak: res.data.streak || 0,
          learningHours: res.data.learningHours || 0,
        });
        setMyCourses(res.data.courses || []);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStats();
  }, [user]);

  // Deduplicate courses by _id
  const uniqueCourses = useMemo(
    () => [...new Map(myCourses.map(c => [c._id, c])).values()],
    [myCourses]
  );

  // Build calendar events from courses (use createdAt as milestone proxy)
  const calendarEvents = useMemo(() =>
    uniqueCourses.flatMap(c => {
      if (!c.createdAt) return [];
      const date = c.createdAt.slice(0, 10);
      return [{ date, label: c.title, type: "milestone" as const }];
    }),
    [uniqueCourses]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
              <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
            </div>
            <div className="flex items-center gap-8 bg-white dark:bg-[#141414] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
              {[1,2,3].map(i => (
                <div key={i} className="text-center px-4 border-r border-slate-100 dark:border-white/10 last:border-0 flex flex-col items-center">
                  <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse mx-auto" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-3xl h-80 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2].map(i => <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-3xl h-48 animate-pulse" />)}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-3xl h-32 animate-pulse" />
              <div className="bg-slate-200 dark:bg-slate-700 rounded-3xl h-64 animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* ── Welcome ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl md:text-[2.5rem] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! <span className="text-3xl md:text-4xl">👋</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
              Keep learning and earn 50 XP today! You're on a{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.streak}-day streak!</span>
            </p>
          </div>

          <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-around md:justify-center gap-4 sm:gap-8 bg-white dark:bg-[#141414] p-4 sm:p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm w-full md:w-auto mt-4 md:mt-0">
            {[
              { val: stats.xp, label: "Total XP" },
              { val: stats.badges, label: "Badges" },
              { val: stats.certificates, label: "Certs" },
            ].map(({ val, label }, i, arr) => (
              <div key={label} className={`text-center px-2 sm:px-4 flex-1 md:flex-none ${i < arr.length - 1 ? "border-r border-slate-100 dark:border-white/10" : ""}`}>
                <h3 className="text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white">{val}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Learning Hours Chart */}
            <div className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm h-72 flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Learning Hours</h3>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> UI/UX <span className="text-slate-900 dark:text-white ml-1">82%</span></span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" /> Dev <span className="text-slate-900 dark:text-white ml-1">12%</span></span>
                  </div>
                </div>
                <select className="text-sm bg-transparent border-none text-slate-500 dark:text-slate-400 font-medium outline-none cursor-pointer self-end sm:self-auto">
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 pt-4 relative overflow-x-auto no-scrollbar">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-500 pb-6 hidden sm:flex">
                  <span>180</span><span>120</span><span>80</span><span>40</span><span>20</span><span>0</span>
                </div>
                <div className="flex-1 flex items-end justify-around pl-0 sm:pl-8 h-full pb-6 relative z-10 min-w-[300px]">
                  {[40,60,50,80,70,90,100,60,50,40,20,10].map((h,i) => (
                    <div key={i} className="flex flex-col gap-1 items-center justify-end h-full w-full px-0.5 sm:px-1 group">
                      <div className="w-full max-w-[1.5rem] bg-slate-100 dark:bg-slate-700 rounded-t-md relative flex items-end overflow-hidden h-full group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                        <div style={{ height: `${h}%` }} className="w-full bg-primary rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[8px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1 sm:mt-2">
                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 pl-0 sm:pl-8 pb-6 flex flex-col justify-between pointer-events-none hidden sm:flex">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="border-b border-dashed border-slate-100 dark:border-white/5 w-full h-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Courses</h3>
                <Link href="/module" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uniqueCourses.length > 0 ? (
                  uniqueCourses.slice(0, 4).map(course => {
                    const { gradient, icon } = getBannerVariant(course._id);
                    const progress = course.progress ?? 0;
                    return (
                      <Link
                        href={`/module/${course._id}`}
                        key={course._id}
                        className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
                      >
                        {/* Mini banner */}
                        <div className={`h-20 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-3xl text-white/20">{icon}</span>
                          )}
                          <div className="absolute top-2 left-2 flex gap-1">
                            {course.isFree && (
                              <span className="px-1.5 py-0.5 bg-green-500/90 text-white text-[9px] font-bold rounded-full uppercase">Free</span>
                            )}
                            {course.isAIGenerated && (
                              <span className="px-1.5 py-0.5 bg-primary/90 text-slate-900 text-[9px] font-bold rounded-full uppercase">AI</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 flex flex-col gap-2 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight flex-1">{course.title}</h4>
                            <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                              <span className="material-symbols-outlined text-[14px] -rotate-45">arrow_forward</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">person</span>
                            {course.instructor || "AI Instructor"}
                            {(course.instructorEmail || course.createdByEmail) && (
                              <span className="text-slate-400 dark:text-slate-500 truncate max-w-[100px]" title={course.instructorEmail || course.createdByEmail}>
                                · {course.instructorEmail || course.createdByEmail}
                              </span>
                            )}
                          </p>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-slate-900 dark:text-white font-bold">{course.hours ?? "—"}</span>
                            <span className="text-slate-500 dark:text-slate-400">hrs</span>
                            <span className="text-slate-900 dark:text-white font-bold">{course.lessonsCount ?? "—"}</span>
                            <span className="text-slate-500 dark:text-slate-400">lessons</span>
                            {course.completedModules != null && course.totalModules != null && (
                              <span className="ml-auto text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{course.completedModules}</span>/{course.totalModules} mod
                              </span>
                            )}
                          </div>

                          <div className="flex gap-1.5 flex-wrap">
                            {course.level && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                                {course.level}
                              </span>
                            )}
                            {course.category && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                                {course.category}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto pt-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                              <span className="text-slate-500 dark:text-slate-400">Progress</span>
                              <span className="text-slate-900 dark:text-white">{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="col-span-2 bg-white dark:bg-[#141414] rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No courses enrolled yet.</p>
                    <Link href="/module" className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-full text-sm inline-block shadow-sm hover:shadow-md transition-all">
                      Explore Catalog
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* New Features Section */}
            <NewFeaturesSection />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Dynamic Calendar */}
            <DynamicCalendar events={calendarEvents} />



            {/* Quick stats */}
            <div className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">This Week</h3>
              {[
                { icon: "local_fire_department", label: "Day streak", val: stats.streak, color: "text-orange-400" },
                { icon: "stars", label: "XP earned", val: stats.xp, color: "text-primary" },
                { icon: "emoji_events", label: "Badges", val: stats.badges, color: "text-blue-400" },
              ].map(({ icon, label, val, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${color}`}>{icon}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{label}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
