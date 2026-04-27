<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-E910E2?style=for-the-badge&logo=framer&logoColor=white" />
</p>

# 🎓 EDUstream — AI-Powered Learning Platform

> **The frontend for [EDUstream](https://ed-ustream.vercel.app)** — a premium, personalized AI tutoring platform with adaptive lessons, an in-browser coding workspace, smart notes, dynamic quizzes, and a community hub.

<p align="center">
  <a href="https://ed-ustream.vercel.app" target="_blank"><strong>🌐 Live Demo</strong></a> &nbsp;•&nbsp;
  <a href="https://github.com/IamAKS26/ai-learning-backend"><strong>🔧 Backend Repo</strong></a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Course Generation** | Generate full courses from a single topic — the AI builds modules, lessons, quizzes, and tasks |
| 📖 **Adaptive Learning** | The engine dynamically picks the next unit type (read, quiz, video, task) based on your style |
| 💻 **Live Coding Workspace** | Write, run, and debug code in Python, JavaScript, and C++ directly in the browser via Piston API |
| 🔍 **AI Code Review** | Submit code snippets and receive instant AI-powered feedback from a simulated senior dev |
| 💬 **AI Tutor Chat** | Conversational AI assistant for instant help while studying |
| 📓 **Smart Notes** | Create, edit, sync, and manage personal learning notes from anywhere in the app |
| 🎥 **Video Lessons** | Curated YouTube tutorials from trusted channels embedded right in your learning flow |
| ❓ **Dynamic Quizzes** | AI-generated quizzes with instant scoring and explanations |
| 🏆 **Gamification** | XP, daily streaks, badges, certificates, and leaderboards to keep you motivated |
| 👥 **Community Hub** | Browse, rate, review, and enroll in courses created by other learners |
| 📊 **Analytics Dashboard** | Real-time progress tracking, activity calendar, and learning stats |
| 🌗 **Dark / Light Mode** | System-aware theme toggle with smooth transitions |
| 📱 **Fully Responsive** | Pixel-perfect experience on mobile, tablet, and desktop |
| 🔐 **Auth** | Email/password + Google OAuth 2.0 with JWT token management |
| 📚 **Interactive Tutorial** | Guided onboarding walkthrough for new users |

---

## 📸 Pages & Screens

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing Page** | Animated hero with typing effect, feature cards, how-it-works section, CTA |
| `/login` | **Login** | Email/password + Google OAuth sign-in |
| `/register` | **Register** | New account creation |
| `/dashboard` | **Dashboard** | Overview stats (XP, streak, badges), active courses, progress bars |
| `/learn` | **Course Catalog** | Browse all published courses with search & filters |
| `/learn/[moduleId]` | **Module View** | Module details with unit list and adaptive "Next Unit" |
| `/module/[moduleId]` | **Module Player** | Full-screen module experience with lesson/quiz/video/task units |
| `/unit/[unitId]` | **Unit Viewer** | Individual unit content (lesson, quiz, video, or coding task) |
| `/community` | **Community Feed** | Browse, search, sort, and paginate published courses |
| `/community/profile/[userId]` | **Public Profile** | Student's public profile, published courses, stats |
| `/profile` | **My Profile** | Personal profile with bio, avatar, website, and achievements |
| `/notes` | **Notes** | Full-page notes management (create, edit, delete, sync) |
| `/analytics` | **Analytics** | Detailed learning analytics and progress visualizations |
| `/progress` | **Progress** | Course-level progress tracking with completed unit breakdowns |
| `/settings` | **Settings** | Account preferences and configuration |
| `/tutorial` | **Tutorial** | Interactive guided walkthrough for platform features |

---

## 🏗️ Project Structure

```
EDUstream/
├── public/                          # Static assets (favicon, images)
├── src/
│   ├── app/                         # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx               # Root layout (fonts, providers, theme)
│   │   ├── page.tsx                 # Landing page (hero, features, CTA)
│   │   ├── globals.css              # Global styles, design tokens, utilities
│   │   ├── not-found.tsx            # Custom 404 page
│   │   ├── login/page.tsx           # Login page
│   │   ├── register/page.tsx        # Registration page
│   │   ├── dashboard/page.tsx       # User dashboard
│   │   ├── learn/
│   │   │   ├── page.tsx             # Course catalog
│   │   │   └── [moduleId]/page.tsx  # Module detail view
│   │   ├── module/
│   │   │   ├── page.tsx             # Module player
│   │   │   └── [moduleId]/          # Dynamic module routes
│   │   ├── unit/[unitId]/           # Unit viewer
│   │   ├── community/
│   │   │   ├── page.tsx             # Community feed
│   │   │   └── profile/             # Public profiles
│   │   ├── profile/page.tsx         # Personal profile
│   │   ├── notes/page.tsx           # Notes manager
│   │   ├── analytics/page.tsx       # Learning analytics
│   │   ├── progress/page.tsx        # Progress tracker
│   │   ├── settings/page.tsx        # Settings page
│   │   └── tutorial/page.tsx        # Onboarding tutorial
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── TopNav.tsx               # Top navigation bar
│   │   ├── Sidebar.tsx              # Dashboard sidebar navigation
│   │   ├── DashboardLayout.tsx      # Dashboard layout wrapper
│   │   ├── LessonViewer.tsx         # Markdown lesson renderer
│   │   ├── QuizViewer.tsx           # Interactive quiz component
│   │   ├── VideoViewer.tsx          # YouTube embed viewer
│   │   ├── TaskViewer.tsx           # Coding task instructions viewer
│   │   ├── CodeEditor.tsx           # Monaco-style code editor
│   │   ├── CodingWorkspace.tsx      # Full coding workspace (editor + output)
│   │   ├── OutputConsole.tsx        # Code execution output display
│   │   ├── NotesPanel.tsx           # Floating notes side panel
│   │   ├── GlobalNotesWrapper.tsx   # Notes provider wrapper
│   │   ├── DynamicCalendar.tsx      # Activity streak calendar
│   │   ├── NewFeaturesSection.tsx   # What's new section
│   │   ├── Skeleton.tsx             # Loading skeleton components
│   │   ├── ThemeProvider.tsx        # Dark/light mode provider
│   │   └── ThemeToggle.tsx          # Theme toggle button
│   │
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context (JWT + user state)
│   │
│   ├── lib/
│   │   └── apiClient.ts            # Axios instance (base URL, JWT interceptors, 401 redirect)
│   │
│   └── utils/
│       └── pistonClient.ts         # Piston API client for code execution (Python, JS, C++)
│
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── postcss.config.mjs               # PostCSS config (Tailwind)
├── eslint.config.mjs                # ESLint configuration
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React + Material Symbols |
| **Typography** | Plus Jakarta Sans (Google Fonts) |
| **HTTP Client** | Axios (with JWT interceptors) |
| **Auth** | JWT + Google OAuth 2.0 (`@react-oauth/google`) |
| **Theme** | next-themes (system-aware dark/light) |
| **Markdown** | react-markdown + remark-gfm |
| **Syntax Highlighting** | react-syntax-highlighter |
| **Code Execution** | Piston API (Python, JavaScript, C++) |
| **Utilities** | clsx, tailwind-merge |
| **Deployment** | Vercel |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** or **yarn**
- Running instance of the [AI Learning Backend](https://github.com/<your-username>/ai-learning-backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/EDUstream.git
cd EDUstream

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# ✏️ Fill in your credentials (see below)

# Start development server (runs on port 5000)
npm run dev
```

The app will be available at `http://localhost:5000`.

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL (include trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Google OAuth 2.0 Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the AI Learning Backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Cloud OAuth client ID for sign-in |

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start dev server on port 5000 with hot reload |
| **Build** | `npm run build` | Production build |
| **Start** | `npm start` | Start production server |
| **Lint** | `npm run lint` | Run ESLint |

---

## 🎨 Design System

EDUstream uses a custom design system built on Tailwind CSS 4:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#FFB300` | Primary accent (buttons, highlights, CTA) |
| `--color-accent` | `#FFD700` | Secondary accent |
| `--font-display` | Plus Jakarta Sans | All typography |
| Light BG | `#FBF9F1` | Warm off-white background |
| Dark BG | `#0A0A0A` | Pure dark background |

### Utility Classes

| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphism card (white in light, dark glass in dark mode) |
| `.nav-item` | Navigation pill styling with hover states |
| `.nav-item-active` | Active navigation state (amber highlight) |
| `.slide-up` | Smooth content entry animation |
| `.no-scrollbar` | Hide scrollbar while keeping scroll functionality |

---

## 🧩 Key Components

### Content Viewers
- **`LessonViewer`** — Renders AI-generated markdown lessons with syntax highlighting
- **`QuizViewer`** — Interactive quiz with option selection, scoring, and explanations
- **`VideoViewer`** — YouTube embed with video metadata display
- **`TaskViewer`** — Coding task instructions with difficulty badge

### Coding Workspace
- **`CodingWorkspace`** — Full-featured coding environment (editor + console + AI review)
- **`CodeEditor`** — Syntax-highlighted code editor with language selector
- **`OutputConsole`** — Execution output display with stdout/stderr/timing

### Navigation & Layout
- **`TopNav`** — Responsive top navigation with search, theme toggle, profile menu
- **`Sidebar`** — Dashboard sidebar with route links and active indicators
- **`DashboardLayout`** — Sidebar + main content wrapper

### Notes
- **`NotesPanel`** — Floating side panel for quick note access from any page
- **`GlobalNotesWrapper`** — Ensures notes panel is available globally

---

## 🔌 API Integration

The frontend communicates with the backend via `apiClient.ts`:

- **Base URL**: Configured via `NEXT_PUBLIC_API_URL` env variable
- **Auth**: JWT token auto-attached to every request via Axios interceptor
- **401 Handling**: Automatic redirect to `/login` on token expiry (with dedup guard)
- **Code Execution**: Piston API called directly from the browser (no backend proxy needed)

---

## 🚀 Deployment

The app is deployed on **Vercel** with zero configuration:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy 🎉

**Live URL**: [https://ed-ustream.vercel.app](https://ed-ustream.vercel.app)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved.

---

<p align="center">
  Built with ❤️ for the future of AI-powered education
</p>
