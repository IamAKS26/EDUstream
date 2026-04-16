"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "My Courses", href: "/module" },
  { name: "AI Tutor", href: "/learn" },
  { name: "Notes", href: "/notes" },
  { name: "Progress", href: "/progress" },
  { name: "Community", href: "/community" },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 sticky top-0 z-40 transition-colors duration-300">
        
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="lg:hidden flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center p-1">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-primary">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" opacity="0.3" />
                <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              EduStream
            </h1>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white dark:bg-[#1A1A1A] px-2 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-sm transition-colors duration-300">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item flex-shrink-0 text-sm px-4 py-1.5 ${isActive ? "nav-item-active" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">

          <button className="relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1A1A]" />
          </button>

          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 pr-2 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-700 border border-black/5 dark:border-white/10 overflow-hidden flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold group-hover:border-primary/30 transition-colors">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight block">{user?.name || "Student User"}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight block">Student</span>
              </div>
              <span className={`material-symbols-outlined text-slate-400 text-sm hidden xl:block transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
                expand_more
              </span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-black/5 dark:border-white/10 shadow-xl dark:shadow-black/50 overflow-hidden py-2 animate-in slide-in-from-top-2 fade-in">
                <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 xl:hidden">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white block truncate">{user?.name || "Student User"}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">{user?.email || "user@edustream.com"}</span>
                </div>

                <div className="py-1">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person</span> My Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                  </Link>

                  {/* Theme Toggle Row */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">
                        {isDark ? "light_mode" : "dark_mode"}
                      </span>
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </div>
                    <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${isDark ? "bg-primary" : "bg-slate-200"}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isDark ? "translate-x-4" : "translate-x-0"}`}></div>
                    </div>
                  </button>

                  <Link href="/support" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">help</span> Help & Support
                  </Link>
                </div>

                <div className="border-t border-black/5 dark:border-white/10 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                      window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] md:top-[72px] bg-white dark:bg-[#0A0A0A] z-30 animate-in slide-in-from-top-2 fade-in duration-200 overflow-y-auto">
          <nav className="flex flex-col p-4 gap-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
                    isActive 
                    ? "bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-white" 
                    : "text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{item.name}</span>
                  <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                    arrow_forward_ios
                  </span>
                </Link>
              );
            })}
          </nav>
          
          <div className="px-4 py-6 border-t border-slate-100 dark:border-white/10 mt-2">
             <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/30">
                 <span className="material-symbols-outlined">rocket_launch</span>
               </div>
               <h4 className="font-bold text-slate-900 dark:text-white">Upgrade to Pro</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Unlock advanced AI tutoring features.</p>
               <button className="w-full py-3 bg-primary text-slate-900 font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all">
                 View Plans
               </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
