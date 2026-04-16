"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { SkeletonCourseCard } from "@/components/Skeleton";

/* ─── Types ─── */
interface Course {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  lessonsCount?: number;
  instructor?: string;
  instructorEmail?: string;
  createdByEmail?: string;
  hours?: number;
  progress?: number;
  completedModules?: number;
  totalModules?: number;
  isAIGenerated?: boolean;
  isPublished?: boolean;
  isFree?: boolean;
  createdBy?: string;
  thumbnail?: string;
}

/* ─── Deterministic banner gradient from course _id ─── */
const BANNER_GRADIENTS = [
  "from-violet-500/30 to-purple-400/10",
  "from-blue-500/30 to-cyan-400/10",
  "from-emerald-500/30 to-teal-400/10",
  "from-orange-500/30 to-amber-400/10",
  "from-rose-500/30 to-pink-400/10",
  "from-indigo-500/30 to-blue-400/10",
];
const BANNER_ICONS = ["menu_book", "code", "science", "design_services", "psychology", "analytics"];

function getBannerVariant(id: string) {
  // Use char codes of the id for stable, deterministic selection
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    gradient: BANNER_GRADIENTS[hash % BANNER_GRADIENTS.length],
    icon: BANNER_ICONS[hash % BANNER_ICONS.length],
  };
}

/* ─── Course Card ─── */
function CourseCard({
  course,
  onDelete,
}: {
  course: Course;
  onDelete: (c: Course) => void;
}) {
  const { gradient, icon } = getBannerVariant(course._id);
  const progress = course.progress ?? 0;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-[1.5rem] border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
      {/* Delete button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(course); }}
          className="p-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 shadow-sm"
          title="Delete Course"
        >
          <span className="material-symbols-outlined text-sm block">delete</span>
        </button>
      </div>

      {/* Banner */}
      <Link href={`/module/${course._id}`} className="block">
        <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-5xl text-white/20">{icon}</span>
          )}
          {/* Badge overlay */}
          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
            {course.isFree && (
              <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-bold rounded-full uppercase">
                Free
              </span>
            )}
            {course.isAIGenerated && (
              <span className="px-2 py-0.5 bg-primary/90 text-slate-900 text-[10px] font-bold rounded-full uppercase">
                AI
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <div className="flex items-start gap-2 justify-between">
              <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight pr-2">
                {course.title}
              </h4>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-[16px] -rotate-45">arrow_forward</span>
              </div>
            </div>
            {course.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Instructor */}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">person</span>
            {course.instructor || "AI Instructor"}
            {(course.instructorEmail || course.createdByEmail) && (
              <span className="text-slate-400 dark:text-slate-500 font-normal truncate max-w-[120px]" title={course.instructorEmail || course.createdByEmail}>
                · {course.instructorEmail || course.createdByEmail}
              </span>
            )}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            {course.hours != null && (
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{course.hours}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">hrs</span>
              </div>
            )}
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{course.lessonsCount ?? "—"}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">lessons</span>
            </div>
            {course.completedModules != null && course.totalModules != null && (
              <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">{course.completedModules}</span>/{course.totalModules} modules
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {course.level && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                {course.level}
              </span>
            )}
            {course.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                {course.category}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-auto pt-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-slate-900 dark:text-white">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ─── Generation animation overlay ─── */
function GeneratingOverlay({ topic }: { topic: string }) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-3xl p-8 border border-primary/20 shadow-lg text-center space-y-5 slide-up">
      {/* Animated rings */}
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        <div className="absolute inset-1 rounded-full border-2 border-primary/50 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl animate-spin" style={{ animationDuration: "2s" }}>
            auto_awesome
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Generating Course
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          AI is building <span className="text-primary font-semibold">"{topic}"</span>…
        </p>
        <p className="text-xs text-slate-400 mt-1">This usually takes 30–60 seconds</p>
      </div>

      {/* Animated steps */}
      <div className="space-y-2 text-left max-w-xs mx-auto">
        {["Planning course structure", "Generating lessons & quizzes", "Adding coding tasks", "Finalizing content"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div
              className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary block" />
            </div>
            {step}
          </div>
        ))}
      </div>

      {/* Skeleton cards */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-100 dark:bg-white/5 rounded-xl h-16 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ModuleCatalogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingTopic, setGeneratingTopic] = useState("");
  const [generatedCourseId, setGeneratedCourseId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [showForm, setShowForm] = useState(false);
  const [genError, setGenError] = useState("");
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("My Courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const [res, statsRes] = await Promise.allSettled([
          apiClient.get("/courses"),
          apiClient.get("/stats/overview")
        ]);

        let rawCourses = [];
        if (res.status === 'fulfilled') {
          rawCourses = res.value.data || [];
        } else {
          throw new Error("Failed to load courses");
        }

        let progressMap: Record<string, number> = {};
        if (statsRes.status === 'fulfilled') {
          const statsCourses = statsRes.value.data?.courses || [];
          statsCourses.forEach((c: any) => {
            progressMap[c._id.toString()] = c.progress || 0;
          });
        }

        const mergedCourses = rawCourses.map((c: any) => ({
          ...c,
          progress: progressMap[c._id.toString()] || 0
        }));

        setCourses(mergedCourses);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    const t = topic.trim();
    setGeneratingTopic(t);
    setGenerating(true);
    setGenError("");
    setShowForm(false);
    setGeneratedCourseId(null);
    try {
      const res = await apiClient.post("/courses/generate", { topic: t, level });
      setTopic("");
      // Refresh courses
      const refreshed = await apiClient.get("/courses");
      setCourses(refreshed.data || []);
      // Try to get the newly generated course id
      if (res.data?._id) setGeneratedCourseId(res.data._id);
    } catch (err: any) {
      setGenError(err.response?.data?.message || "Course generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/courses/${deletingCourse._id}`);
      setCourses(prev => prev.filter(c => c._id !== deletingCourse._id));
      setDeletingCourse(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Deduplicate by _id to prevent repeat renders
  const uniqueCourses = useMemo(
    () => [...new Map(courses.map(c => [c._id, c])).values()],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    let list = uniqueCourses;
    if (activeTab === "Available") list = list.filter(c => c.isPublished);
    if (activeTab === "Free") list = list.filter(c => c.isFree);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [uniqueCourses, activeTab, searchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Search */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search courses…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-black/5 dark:border-white/10 shadow-sm rounded-full pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Tabs & Generate */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 px-2 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["My Courses", "Available", "Free"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-[#FEF3C7] dark:bg-primary/20 text-slate-900 dark:text-primary"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-white/90 transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate
          </button>
        </div>

        {/* AI Generate Form */}
        {showForm && (
          <div className="bg-white dark:bg-[#141414] rounded-3xl p-6 border border-primary/20 shadow-lg space-y-4 slide-up">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-primary text-2xl">magic_button</span>
              Generate a New Course
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The AI will plan a full course outline, then generate lessons and quizzes for every topic.
              <span className="text-primary font-semibold"> This takes ~30–60 seconds.</span>
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder='e.g. "Python for Data Science"'
                className="flex-1 bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-inner"
              />
              <select
                value={level}
                onChange={e => setLevel(e.target.value as typeof level)}
                className="bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm cursor-pointer"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 min-w-[140px]"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                Generate
              </button>
            </form>
            {genError && (
              <p className="text-red-500 text-sm font-semibold flex items-center gap-1 mt-2">
                <span className="material-symbols-outlined text-sm">error</span> {genError}
              </p>
            )}
          </div>
        )}

        {/* Generation animation */}
        {generating && <GeneratingOverlay topic={generatingTopic} />}

        {/* After generation — "View Course" CTA */}
        {!generating && generatedCourseId && (
          <div className="bg-green-50 dark:bg-green-500/10 rounded-3xl p-6 border border-green-200 dark:border-green-500/20 shadow-sm flex items-center justify-between gap-4 slide-up">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Course generated! 🎉</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your new course is ready to explore.</p>
              </div>
            </div>
            <Link
              href={`/module/${generatedCourseId}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-sm text-sm whitespace-nowrap"
            >
              View Course
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCourseCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 rounded-3xl p-6 border border-red-100 dark:border-red-500/20 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-red-500 block">cloud_off</span>
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={() => setError("")} className="px-4 py-2 bg-white dark:bg-white/10 text-sm text-red-600 font-bold border border-red-200 dark:border-red-500/30 rounded-lg shadow-sm">
              Dismiss
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <>
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-white dark:bg-[#141414] rounded-3xl border border-black/5 dark:border-white/10 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 block">menu_book</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {searchQuery ? `No results for "${searchQuery}"` : "No courses yet. Generate your first one with AI!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map(course => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onDelete={setDeletingCourse}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Course?</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-slate-900 dark:text-white font-semibold">"{deletingCourse.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setDeletingCourse(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-semibold rounded-full transition-colors text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-colors text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-red-500/20"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
