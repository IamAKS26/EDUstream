"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

interface Creator {
  _id: string;
  name: string;
  bio?: string;
  avatarColor?: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  rating: number;
  ratingsCount: number;
  views: number;
  enrolledCount: number;
  lessonsCount?: number;
  tags?: string[];
  createdBy?: Creator;
  createdAt?: string;
}

interface TrendingData {
  topCourses: Course[];
  topCreators: { _id: string; name: string; xp: number; avatarColor?: string; bio?: string }[];
}

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const SORTS: { label: string; value: string }[] = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Most Enrolled", value: "enrolled" },
];

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "text-lg" : "text-xs";
  return (
    <div className={`flex items-center gap-0.5 ${sz}`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-slate-200 dark:text-slate-600"}>★</span>
      ))}
    </div>
  );
}

function AvatarBubble({ name, colorClass, size = 10 }: { name?: string; colorClass?: string; size?: number }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-sm ${colorClass || "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
      {initials}
    </div>
  );
}

function CourseCard({ course, onRate }: { course: Course; onRate: (courseId: string, val: number) => void }) {
  const [hoverStar, setHoverStar] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const { user } = useAuth();

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || enrolling || enrolled) return;
    setEnrolling(true);
    try {
      await apiClient.post(`/community/enroll/${course._id}`);
      setEnrolled(true);
    } catch { } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-200 flex flex-col overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-primary/70 to-primary/30" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {course.level && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              course.level === "Beginner" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" :
              course.level === "Intermediate" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600" :
              "bg-purple-50 dark:bg-purple-500/10 text-purple-600"
            }`}>{course.level}</span>
          )}
          {course.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">{course.category}</span>
          )}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{course.description}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            {course.views.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">school</span>
            {course.enrolledCount} enrolled
          </span>
          {course.lessonsCount ? (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">menu_book</span>
              {course.lessonsCount} lessons
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <StarDisplay rating={course.rating} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course.rating > 0 ? course.rating.toFixed(1) : "No ratings"}</span>
          {course.ratingsCount > 0 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">({course.ratingsCount})</span>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-1">Rate:</span>
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => onRate(course._id, s)}
                className={`text-base transition-colors ${s <= (hoverStar || 0) ? "text-amber-400" : "text-slate-200 dark:text-slate-600"}`}
              >★</button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5 dark:border-white/10">
          {course.createdBy ? (
            <Link
              href={`/community/profile/${course.createdBy._id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={e => e.stopPropagation()}
            >
              <AvatarBubble name={course.createdBy.name} colorClass={course.createdBy.avatarColor} size={7} />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{course.createdBy.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Course Creator</p>
              </div>
            </Link>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={handleEnroll}
              title={enrolled ? "Enrolled!" : "Enroll in course"}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
                enrolled
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-slate-900"
              }`}
            >
              {enrolling ? "..." : enrolled ? "✓ Enrolled" : "Enroll"}
            </button>
            <Link
              href={`/module/${course._id}`}
              onClick={async () => {
                try { await apiClient.post(`/community/view/${course._id}`); } catch {}
              }}
              className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-white/90 transition-all"
            >
              Open →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [trending, setTrending] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All Levels");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort, page: String(page) });
      if (search) params.set("search", search);
      if (level !== "All Levels") params.set("level", level);
      const res = await apiClient.get(`/community/feed?${params}`);
      setCourses(res.data.courses || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Failed to fetch community feed", err);
    } finally {
      setLoading(false);
    }
  }, [search, level, sort, page]);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await apiClient.get("/community/trending");
      setTrending(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);
  useEffect(() => { fetchTrending(); }, [fetchTrending]);

  const handleRate = async (courseId: string, value: number) => {
    if (!user) return;
    try {
      await apiClient.post(`/community/rate/${courseId}`, { value });
      fetchFeed();
    } catch {}
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6 max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Explore Courses</h2>
            <p className="text-slate-500 dark:text-slate-400">Discover courses published by fellow students. Learn from the community.</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search courses by title..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  level === l
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-black/5 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                }`}
              >{l}</button>
            ))}
          </div>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="text-sm bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 outline-none font-medium"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 h-72 animate-pulse" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 p-16 text-center shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 block mb-4">search_off</span>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No courses found</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} onRate={handleRate} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >← Prev</button>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl border border-black/5 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >Next →</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span> Trending
              </h3>
              {trending?.topCourses.length ? (
                <div className="space-y-4">
                  {trending.topCourses.map((c, i) => (
                    <Link href={`/module/${c._id}`} key={c._id} className="flex items-center gap-3 group"
                      onClick={async () => { try { await apiClient.post(`/community/view/${c._id}`); } catch {} }}>
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        i === 0 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                      }`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{c.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{c.views} views · ⭐ {c.rating > 0 ? c.rating.toFixed(1) : "–"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No data yet</p>
              )}
            </section>

            <section className="bg-white dark:bg-[#141414] rounded-2xl border border-black/5 dark:border-white/10 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">leaderboard</span> Top Creators
              </h3>
              {trending?.topCreators.length ? (
                <div className="space-y-4">
                  {trending.topCreators.map((creator, i) => (
                    <Link href={`/community/profile/${creator._id}`} key={creator._id} className="flex items-center gap-3 group">
                      <AvatarBubble name={creator.name} colorClass={creator.avatarColor} size={9} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{creator.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{creator.xp.toLocaleString()} XP</p>
                      </div>
                      <span className={`text-sm ${i === 0 ? "text-primary" : "text-slate-300 dark:text-slate-600"}`}>{i === 0 ? "🏆" : `#${i + 1}`}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No data yet</p>
              )}
            </section>

            <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10 p-5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">lightbulb</span> How it works
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Browse & enroll in any published course</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Rate courses after studying them (1–5 stars)</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Click creator names to view their profile</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Publish your own AI course via My Courses</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
