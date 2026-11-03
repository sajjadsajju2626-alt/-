import {
  MORNING_ADHKAR,
  EVENING_ADHKAR,
  PRAYER_ADHKAR,
  SLEEP_ADHKAR,
  CATEGORIES_CONFIG,
  TASBIH_PRESETS,
} from '../data/adhkarData.ts';
import { DEFAULT_DAILY_TASKS } from '../data/defaultTasks.ts';

export function generateSingleFileHtml(): string {
  const payloadData = {
    morning: MORNING_ADHKAR,
    evening: EVENING_ADHKAR,
    prayer: PRAYER_ADHKAR,
    sleep: SLEEP_ADHKAR,
    categories: CATEGORIES_CONFIG,
    tasbihPresets: TASBIH_PRESETS,
    dailyTasks: DEFAULT_DAILY_TASKS,
  };

  const jsonString = JSON.stringify(payloadData);

  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Daily Adhkar (مداومة) - Morning, Evening & Daily Remembrances</title>
  <meta name="description" content="Authentic daily morning and evening adhkar, after-prayer remembrances, sleep adhkar, daily Islamic tasks with weekly/monthly audit, and digital tasbih with Arabic text, transliteration, English & Malayalam translations. Single-file offline version.">
  <meta name="theme-color" content="#064e3b">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Daily Adhkar">
  <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='128' fill='%23064e3b'/%3E%3Cpath d='M 280 140 A 120 120 0 1 0 380 340 A 100 100 0 1 1 280 140 Z' fill='%23ffffff'/%3E%3C/svg%3E">
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,700;1,700&family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Malayalam:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS v4 Browser Build -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <style>
    body, button, input, select, textarea {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Malayalam', 'Scheherazade New', system-ui, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .font-arabic {
      font-family: 'Scheherazade New', 'Amiri', 'Traditional Arabic', serif;
    }
    .app-arabic-title {
      font-family: 'Scheherazade New', 'Amiri', 'Aref Ruqaa', serif;
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 1.45;
      padding-top: 0.1em;
      letter-spacing: 0;
      text-shadow: 0 2px 6px rgba(4, 47, 46, 0.35);
      margin: 0;
      direction: rtl;
    }
    .font-malayalam {
      font-family: 'Noto Sans Malayalam', system-ui, -apple-system, sans-serif;
    }
    .theme-transition {
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(13, 92, 58, 0.35);
      border-radius: 9999px;
    }
    .theme-midnight {
      --bg-main: #000000;
      --bg-card: #09090b;
      --border-card: #27272a;
      --text-main: #fafafa;
      --text-muted: #a1a1aa;
    }
    .theme-dark {
      --bg-main: #041d15;
      --bg-card: #082f23;
      --border-card: #115e59;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    .theme-emerald {
      --bg-main: #f4f9f6;
      --bg-card: #ffffff;
      --border-card: #a7f3d0;
      --text-main: #0f172a;
      --text-muted: #334155;
    }
    @keyframes streakFreezeShiver {
      0%, 100% {
        transform: translateX(0) rotate(0deg);
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.45);
      }
      20% {
        transform: translateX(-1px) rotate(-1deg);
        box-shadow: 0 0 14px rgba(0, 229, 255, 0.72);
      }
      40% {
        transform: translateX(1px) rotate(1deg);
        box-shadow: 0 0 12px rgba(0, 229, 255, 0.55);
      }
      60% {
        transform: translateX(-1px) rotate(-1deg);
        box-shadow: 0 0 16px rgba(0, 229, 255, 0.78);
      }
      80% {
        transform: translateX(1px) rotate(1deg);
        box-shadow: 0 0 11px rgba(0, 229, 255, 0.52);
      }
    }
    .streak-freeze-badge {
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.45);
      animation: streakFreezeShiver 2.2s ease-in-out infinite;
    }
    @keyframes streakFlamePulse {
      0%, 100% {
        transform: scale(1) translateY(0);
        filter: drop-shadow(0 0 18px rgba(255, 122, 0, 0.55));
      }
      50% {
        transform: scale(1.06) translateY(-3px);
        filter: drop-shadow(0 0 26px rgba(255, 160, 0, 0.85));
      }
    }
    @keyframes streakParticleFloat {
      0%, 100% {
        transform: translateY(0) scale(0.9);
        opacity: 0.65;
      }
      50% {
        transform: translateY(-6px) scale(1.2);
        opacity: 1;
      }
    }
    .streak-flame-svg {
      animation: streakFlamePulse 2.4s ease-in-out infinite;
    }
    .streak-particle {
      animation: streakParticleFloat 2s ease-in-out infinite;
    }
    .completion-free-overlay {
      backdrop-filter: blur(5px) brightness(0.6);
      -webkit-backdrop-filter: blur(5px) brightness(0.6);
      background: rgba(0, 0, 0, 0.28);
      opacity: 1;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .completion-free-overlay.overlay-fading-out {
      opacity: 0;
      pointer-events: none;
    }
    .completion-free-text-glow {
      text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5);
    }
    @keyframes freeFlameIgniteBounce {
      0% {
        transform: scale(0.35) translateY(24px);
        opacity: 0;
        filter: drop-shadow(0 0 12px rgba(255, 165, 0, 0.6));
      }
      45% {
        transform: scale(1.18) translateY(-10px);
        opacity: 1;
        filter: drop-shadow(0 0 32px rgba(255, 215, 0, 0.95)) drop-shadow(0 0 60px rgba(255, 120, 0, 0.75));
      }
      70% {
        transform: scale(0.96) translateY(2px);
        filter: drop-shadow(0 0 24px rgba(255, 200, 0, 0.85));
      }
      100% {
        transform: scale(1.04) translateY(-4px);
        opacity: 1;
        filter: drop-shadow(0 0 28px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 48px rgba(255, 140, 0, 0.65));
      }
    }
    .completion-free-flame {
      animation: freeFlameIgniteBounce 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes freeGoldStarScatter {
      0% {
        transform: translate(0, 0) scale(0.2) rotate(0deg);
        opacity: 0;
      }
      25% {
        opacity: 1;
      }
      100% {
        transform: translate(var(--tx, 0px), var(--ty, -60px)) scale(1.15) rotate(var(--rot, 45deg));
        opacity: 0;
      }
    }
    .completion-gold-particle {
      position: absolute;
      pointer-events: none;
      text-shadow: 0 0 12px rgba(255, 215, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.8);
      animation: freeGoldStarScatter 1.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes freeTextRiseIn {
      0% {
        transform: translateY(14px) scale(0.92);
        opacity: 0;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    .completion-free-text-enter {
      animation: freeTextRiseIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
  </style>
</head>
<body class="bg-[#f4f9f6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-full flex flex-col theme-transition pb-12 select-none" id="appBody">

  <!-- ================= TOP APP HEADER (Curved Emerald Green Gradient Banner) ================= -->
  <header class="sticky top-0 z-30 bg-gradient-to-b from-[#064e3b] via-[#0d5c3a] to-[#115e59] dark:from-[#042f2e] dark:via-[#064e3b] dark:to-[#0d5c3a] text-white rounded-b-[2rem] shadow-lg border-b border-emerald-400/20 backdrop-blur-md">
    <div class="max-w-xl mx-auto px-4 pt-3.5 pb-4">
      <div class="flex items-center justify-between gap-2">
        <!-- Left: Streak Badge -->
        <div class="flex items-center">
          <button id="streakBtn" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition-all border cursor-pointer active:scale-95 bg-white/15 text-white border-white/25 hover:bg-white/25" title="Daily Streak">
            <span>🔥</span>
            <span id="streakCount">0d</span>
          </button>
        </div>

        <!-- Right: 3 Clean White Action Icons (Sound, Daylight/Night, Settings) -->
        <div class="flex items-center gap-1.5">
          <!-- Sound Mute/Unmute -->
          <button id="soundToggleBtn" aria-label="Toggle Sound" title="Sound" class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95">
            <span id="soundIcon" class="text-sm">🔊</span>
          </button>

          <!-- Theme Toggle -->
          <button id="themeToggleBtn" aria-label="Toggle Theme" title="Theme" class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95">
            <span id="themeIcon" class="text-sm">🌙</span>
          </button>

          <!-- Settings -->
          <button id="openSettingsBtn" aria-label="Open Settings" title="Settings" class="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Center: White Title & Calligraphy Banner -->
      <div class="text-center mt-1 mb-1">
        <h1 class="app-arabic-title" dir="rtl">مُدَاوَمَةٌ</h1>
        <div class="text-xs sm:text-sm font-extrabold tracking-tight text-white/95 font-malayalam mt-1">
          Daily Adhkar • പ്രതിദിന ദിക്റുകൾ
        </div>
        <p class="text-xs text-emerald-100/95 flex items-center justify-center gap-1.5 mt-0.5">
          <span id="headerCategoryLabel" class="font-bold">Morning</span>
          <span class="opacity-60">•</span>
          <span id="headerCategoryArabic" class="font-arabic text-xs sm:text-sm">أذكار الصباح</span>
        </p>
      </div>

      <!-- Progress Section inside Header -->
      <div id="headerProgressContainer" class="mt-2.5 pt-2 border-t border-white/20">
        <div class="flex items-center justify-between text-xs text-emerald-50 mb-1">
          <span id="progressStatusText" class="font-semibold">Progress: 0 of 25 Completed</span>
          <span id="progressPercentText" class="font-extrabold text-amber-300">0%</span>
        </div>
        <div class="w-full bg-emerald-950/50 h-2 rounded-full overflow-hidden p-0.5">
          <div id="progressBarFill" class="h-full rounded-full transition-all duration-300 bg-amber-300" style="width: 0%"></div>
        </div>
        <div id="headerTimeHint" class="text-[11px] text-emerald-100/90 mt-1 text-center italic">After Fajr prayer until sunrise</div>
      </div>
    </div>
  </header>

  <!-- ================= MAIN CONTAINER ================= -->
  <main class="flex-1 max-w-xl w-full mx-auto px-4 py-4 space-y-4">

    <!-- ================= HOME DASHBOARD: SINGLE TIME-BASED RECOMMENDATION + 2-COLUMN EMERALD CARD GRID ================= -->
    <nav aria-label="Adhkar Categories" class="space-y-3.5" id="categoryGridSection">
      <!-- Single Time-Based Recommendation Card (Displayed ONLY on Home Dashboard) -->
      <div id="featuredCategoryBanner" data-testid="time-based-recommendation-card" class="rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#0d5c3a] to-[#115e59] dark:from-[#042f2e] dark:to-[#0d5c3a] text-white p-4 shadow-md border border-emerald-400/30 flex items-center justify-between gap-3 cursor-pointer transition-all hover:brightness-105 active:scale-[0.99]">
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span id="featuredBadgeNum" class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-[#064e3b] shadow-2xs">TIME-BASED RECOMMENDATION</span>
            <span id="featuredArabicTitle" class="font-arabic text-sm font-bold text-emerald-100">أذكار الصباح</span>
          </div>
          <h2 id="featuredMainTitle" class="text-base sm:text-lg font-extrabold tracking-tight text-white font-malayalam truncate">
            Morning • പ്രഭാത ദിക്റുകൾ
          </h2>
          <p id="featuredSubText" class="text-xs text-emerald-100/90 font-medium truncate">
            25 Contents • Tap to open recommended remembrances
          </p>
        </div>
        <div class="flex flex-col items-end gap-1.5 shrink-0">
          <div class="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"></circle>
              <path stroke-linecap="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636"></path>
            </svg>
          </div>
          <span class="text-[10px] font-extrabold text-amber-200 flex items-center gap-0.5">Open →</span>
        </div>
      </div>

      <!-- 2-Column Rounded Emerald Green Card Grid -->
      <div class="grid grid-cols-2 gap-3">
        <!-- ① Morning -->
        <button data-tab="morning" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#064e3b] text-white ring-2 ring-emerald-300 shadow-md flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">①</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">الصباح</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Morning • പ്രഭാതം</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0/25</span> • 25 Contents
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"></circle>
            <path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
        </button>

        <!-- ② Evening -->
        <button data-tab="evening" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">②</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">المساء</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Evening • പ്രദോഷം</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0/24</span> • 24 Contents
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
          </svg>
        </button>

        <!-- ③ After Prayer -->
        <button data-tab="prayer" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">③</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">الصلاة</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">After Prayer • നമസ്കാരം</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0/7</span> • 7 Contents
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3z"></path>
          </svg>
        </button>

        <!-- ④ Sleep -->
        <button data-tab="sleep" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">④</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">النوم</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Sleep • ഉറക്കം</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0/12</span> • 12 Contents
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13h18M5 13V8a2 2 0 012-2h10a2 2 0 012 2v5M3 17h18M5 17v2m14-2v2"></path>
          </svg>
        </button>

        <!-- ⑤ Tasks -->
        <button data-tab="tasks" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">⑤</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">المهام</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Tasks • കർമ്മങ്ങൾ</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0/11</span> • Daily Checklist
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>

        <!-- ⑥ Favorites -->
        <button data-tab="favorites" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">⑥</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">المفضلة</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Favorites • പ്രിയപ്പെട്ടവ</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              <span class="tab-badge">0</span> • Saved Adhkar
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </button>

        <!-- ⑦ Tasbih -->
        <button data-tab="tasbih" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">⑦</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">التسبيح</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Tasbih • തസ്ബീഹ്</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              Digital Counter
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8"></circle>
            <circle cx="12" cy="4" r="1.5" fill="currentColor"></circle>
            <circle cx="18" cy="7" r="1.5" fill="currentColor"></circle>
            <circle cx="6" cy="7" r="1.5" fill="currentColor"></circle>
          </svg>
        </button>

        <!-- ⑧ Progress Audit -->
        <button type="button" data-tab="progress" class="tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#064e3b] text-white shadow-sm border border-emerald-400/25 flex flex-col justify-between min-h-[104px] overflow-hidden">
          <div class="flex items-start justify-between gap-1 w-full">
            <span class="text-base font-black leading-none text-white/95">⑧</span>
            <span class="font-arabic text-xs font-bold text-emerald-100">التقييم</span>
          </div>
          <div class="mt-2 pr-8">
            <div class="font-extrabold text-sm sm:text-base text-white leading-tight font-malayalam">Progress • പുരോഗതി</div>
            <div class="text-[11px] font-semibold text-emerald-100 mt-0.5">
              Weekly &amp; Monthly Audit
            </div>
          </div>
          <svg class="w-7 h-7 text-emerald-200/85 absolute bottom-2.5 right-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </button>
      </div>
    </nav>

    <!-- ================= OPENED CATEGORY PAGE / MODAL VIEW ================= -->
    <div id="categoryDetailView" class="hidden space-y-4">
      <!-- Top Back Navigation Bar for Opened Category -->
      <div class="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-emerald-200 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          id="backToCategoriesBtn"
          data-testid="back-to-categories-btn"
          class="px-3.5 py-2 rounded-xl bg-[#0d5c3a] hover:bg-[#064e3b] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          <span class="font-malayalam">← തിരികെ (Back)</span>
          <span class="text-[11px] text-emerald-100 hidden sm:inline">• Back to Categories</span>
        </button>
        <div class="text-right min-w-0">
          <div id="openedCategoryTitle" class="text-xs sm:text-sm font-extrabold text-[#064e3b] dark:text-emerald-300 font-malayalam truncate">
            Morning • പ്രഭാത ദിക്റുകൾ
          </div>
          <div id="openedCategoryArabic" class="font-arabic text-xs font-bold text-slate-600 dark:text-slate-400">
            أذكار الصباح
          </div>
        </div>
      </div>

      <!-- Search & Filter Controls (for list views) -->
      <div id="searchFilterSection" class="space-y-2.5">
        <div class="relative">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Search Arabic, English, or Malayalam..." 
            class="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 font-semibold shadow-xs text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0d5c3a] focus:border-transparent"
          >
          <div class="absolute left-3 top-3 text-[#0d5c3a] dark:text-emerald-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button id="clearSearchBtn" class="hidden absolute right-2.5 top-2.5 p-1 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            ✕
          </button>
        </div>

        <!-- Filter tabs & Autoplay All -->
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-1.5">
            <button data-filter="all" class="filter-btn px-3 py-1.5 rounded-xl font-extrabold bg-[#0d5c3a] text-white border border-[#0d5c3a] shadow-2xs">All</button>
            <button data-filter="incomplete" class="filter-btn px-3 py-1.5 rounded-xl font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-emerald-50">Incomplete</button>
            <button data-filter="completed" class="filter-btn px-3 py-1.5 rounded-xl font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-emerald-50">Completed</button>
          </div>
          <button
            type="button"
            id="autoplayAllBtn"
            data-testid="autoplay-all-btn"
            class="px-3 py-1.5 rounded-xl font-extrabold bg-emerald-800 hover:bg-emerald-900 text-amber-200 border border-amber-400/50 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <span id="autoplayAllBtnIcon">▶</span>
            <span id="autoplayAllBtnLabel">Autoplay All</span>
          </button>
        </div>
      </div>

      <!-- Adhkar Cards Container -->
      <div id="adhkarList" class="space-y-4">
        <!-- Cards rendered via JS -->
      </div>

      <!-- Bottom Category Actions: Reset Counters & Complete All -->
      <div id="adhkarBottomActions" class="pt-2 border-t border-emerald-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          id="resetCurrentCategoryBtn"
          data-testid="reset-current-category-btn"
          class="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 shadow-2xs active:scale-98"
        >
          <span>↺</span>
          <span class="font-malayalam">Reset Counters • പുനഃക്രമീകരിക്കുക</span>
        </button>
        <button
          type="button"
          id="completeAllCategoryBtn"
          data-testid="complete-all-current-tab-btn"
          class="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border bg-[#0d5c3a] hover:bg-[#064e3b] text-white border-emerald-500/40 shadow-xs active:scale-98"
        >
          <span>✓✓</span>
          <span id="completeAllCategoryBtnLabel" class="font-malayalam">Complete All • എല്ലാം പൂർത്തിയാക്കുക</span>
        </button>
      </div>

      <!-- ================= DAILY TASKS & WEEKLY/MONTHLY AUDIT CONTAINER (Visible when Tab is 'tasks') ================= -->
      <div id="tasksView" class="hidden space-y-5 pb-12" data-testid="daily-tasks-tracker">

        <!-- Top Summary & Progress Header -->
        <div class="rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#0d5c3a] to-[#115e59] text-white p-5 sm:p-6 shadow-md border border-emerald-400/30">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-2xl">📋</span>
                <h2 class="text-lg sm:text-xl font-extrabold tracking-tight">
                  Daily Islamic Tasks &amp; Checklist
                </h2>
              </div>
              <p class="text-xs sm:text-sm text-emerald-100/90 mt-1 font-medium font-malayalam">
                المهام اليومية والسنن الراتبة • പ്രതിദിന സുന്നത്തുകളും കർമ്മങ്ങളും
              </p>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                id="openAddTaskModalBtn"
                class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>➕</span>
                <span>Add Task</span>
              </button>
              <button
                type="button"
                id="completeAllTasksBtn"
                class="px-3 py-1.5 rounded-xl bg-teal-700/80 hover:bg-teal-600 text-white font-bold text-xs border border-teal-500/40 transition-all cursor-pointer"
              >
                ✓ Complete All
              </button>
              <button
                type="button"
                id="resetAllTasksBtn"
                class="px-3 py-1.5 rounded-xl bg-teal-950/60 hover:bg-rose-900/80 text-teal-200 hover:text-white font-bold text-xs border border-teal-700/50 transition-all cursor-pointer"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-4 pt-3 border-t border-teal-700/50">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span id="tasksProgressText" class="font-bold text-teal-100">
                Today’s Consistency: 0 of 11 (0%)
              </span>
              <span id="tasksPercentText" class="font-extrabold text-amber-300">0%</span>
            </div>
            <div class="w-full bg-teal-950/60 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                id="tasksProgressBarFill"
                class="h-full rounded-full transition-all duration-500 bg-amber-300"
                style="width: 0%"
              ></div>
            </div>
          </div>
        </div>

        <!-- Search & Category Filter Bar -->
        <div class="space-y-2.5">
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="relative flex-1">
              <input
                type="text"
                id="taskSearchInput"
                placeholder="Search tasks in English, Arabic, or Malayalam..."
                class="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white placeholder-slate-500 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
              <button
                type="button"
                id="clearTaskSearchBtn"
                class="hidden absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <!-- Completion status filter -->
          <div class="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-800 self-start">
            <button type="button" data-task-status="all" class="task-status-btn px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-teal-800 text-white">All</button>
            <button type="button" data-task-status="remaining" class="task-status-btn px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Remaining</button>
            <button type="button" data-task-status="completed" class="task-status-btn px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">Done</button>
          </div>
        </div>

        <!-- Category Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button type="button" data-task-cat="all" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-teal-800 text-white border-teal-800 shadow-xs">
            <span>📋</span><span>All Tasks</span>
          </button>
          <button type="button" data-task-cat="prayer" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>🕌</span><span>Prayers</span>
          </button>
          <button type="button" data-task-cat="sunnah" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>🌙</span><span>Sunnah</span>
          </button>
          <button type="button" data-task-cat="quran" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>📖</span><span>Quran</span>
          </button>
          <button type="button" data-task-cat="dhikr" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>📿</span><span>Dhikr</span>
          </button>
          <button type="button" data-task-cat="charity" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>🤝</span><span>Charity</span>
          </button>
          <button type="button" data-task-cat="custom" class="task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800">
            <span>✨</span><span>Personal</span>
          </button>
        </div>
      </div>

      <!-- 11 Individual Tasks Checklist Container -->
      <div id="dailyTasksList" class="space-y-3">
        <!-- Rendered via JS -->
      </div>
    </div>

    <!-- ================= DEDICATED PROGRESS TRACKER & ANALYTICS VIEW (Visible ONLY when Tab is 'progress') ================= -->
    <div id="progressView" class="hidden space-y-5 pb-12" data-testid="progress-analytics-section">
      <!-- Top Progress Tracker Dashboard (പുരോഗതി വിലയിരുത്തൽ • Progress Tracker) -->
      <section class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/90 text-[#064e3b] dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700/60 flex items-center justify-center font-black">
              📈
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-malayalam">
                പുരോഗതി വിലയിരുത്തൽ • Progress Tracker
              </h2>
              <p class="text-xs font-bold text-slate-700 dark:text-slate-300 font-malayalam">
                പ്രതിവാര &amp; പ്രതിമാസ ദിക്ർ കണക്കുകൾ (Weekly &amp; Monthly Analytics)
              </p>
            </div>
          </div>

          <div
            id="progressStreakPill"
            data-testid="weekly-streak-pill"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-700/60"
          >
            <span>🔥 0 Day Streak</span>
          </div>
        </div>

        <!-- 4 KPI Summary Stats Grid -->
        <div data-testid="summary-stats-card" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Total Recitations</span>
              <span>✨</span>
            </div>
            <div id="statTotalRecitations" data-testid="stat-total-recitations" class="text-xl sm:text-2xl font-black tabular-nums text-slate-900 dark:text-white">0</div>
            <div class="text-[11px] font-bold mt-0.5 text-[#064e3b] dark:text-emerald-300 font-malayalam">ആകെ ചൊല്ലിയവ</div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Active Days</span>
              <span>📅</span>
            </div>
            <div id="statActiveDays" data-testid="stat-active-days" class="text-xl sm:text-2xl font-black tabular-nums text-slate-900 dark:text-white">1</div>
            <div class="text-[11px] font-bold mt-0.5 text-[#0d5c3a] dark:text-teal-300 font-malayalam">സജീവ ദിനങ്ങൾ</div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Best Streak</span>
              <span>🏆</span>
            </div>
            <div id="statBestStreak" data-testid="stat-best-streak" class="text-xl sm:text-2xl font-black tabular-nums text-slate-900 dark:text-white">0 days</div>
            <div class="text-[11px] font-bold mt-0.5 text-amber-800 dark:text-amber-300 font-malayalam">മികച്ച തുടർച്ച</div>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Current Streak</span>
              <span>🔥</span>
            </div>
            <div id="statCurrentStreak" data-testid="stat-current-streak" class="text-xl sm:text-2xl font-black tabular-nums text-slate-900 dark:text-white">0 days</div>
            <div class="text-[11px] font-bold mt-0.5 text-orange-800 dark:text-orange-300 font-malayalam">നിലവിലെ തുടർച്ച</div>
          </div>
        </div>

        <!-- Weekly Tracker (Last 7 Days) -->
        <div data-testid="weekly-tracker-card" class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-black text-slate-900 dark:text-white font-malayalam">
                Weekly Tracker • കഴിഞ്ഞ 7 ദിവസങ്ങൾ
              </h3>
              <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 font-malayalam">
                ദിവസേനയുള്ള പൂർത്തീകരണ ശതമാനം (Mon–Sun)
              </p>
            </div>
            <div id="weeklyAdhkarAvgBadge" data-testid="weekly-average-badge" class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 dark:bg-emerald-950/90 text-[#064e3b] dark:text-emerald-300 border border-emerald-400 dark:border-emerald-700">
              Weekly Avg: 0%
            </div>
          </div>
          <div id="weeklyAdhkarTrackerGrid" class="grid grid-cols-7 gap-1.5 sm:gap-2">
            <!-- Rendered via JS -->
          </div>
        </div>
      </section>

      <!-- ================= WEEKLY & MONTHLY TASK AUDIT (ടാസ്ക് പുരോഗതി) ================= -->
      <div
        class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4"
        data-testid="weekly-monthly-task-audit"
      >
        <!-- Header & Period Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-lg">📊</span>
              <h3 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Weekly &amp; Monthly Task Audit
              </h3>
            </div>
            <p class="text-xs font-bold text-teal-800 dark:text-teal-300 font-malayalam mt-0.5">
              ടാസ്‌ക് പുരോഗതി • 7-Day &amp; 30-Day Breakdown
            </p>
          </div>

          <!-- Period Switcher: [ This Week (ഈ ആഴ്ച) ] | [ This Month (ഈ മാസം) ] -->
          <div
            class="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-300 dark:border-slate-700 self-start sm:self-auto"
            role="group"
            aria-label="Audit Period Switcher"
          >
            <button
              type="button"
              id="auditPeriodWeekBtn"
              data-testid="audit-period-week"
              class="px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-teal-800 text-white shadow-xs"
            >
              This Week (ഈ ആഴ്ച)
            </button>
            <button
              type="button"
              id="auditPeriodMonthBtn"
              data-testid="audit-period-month"
              class="px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white"
            >
              This Month (ഈ മാസം)
            </button>
          </div>
        </div>

        <!-- Encouraging Summary Note at Top of Tasks Report -->
        <div
          class="rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50/70 dark:from-teal-950/50 dark:via-slate-900 dark:to-amber-950/30 border border-teal-300 dark:border-teal-800/70 p-3.5 space-y-2"
          data-testid="task-audit-summary-note"
        >
          <div class="flex items-start gap-2 text-xs sm:text-sm font-malayalam">
            <span class="text-emerald-600 dark:text-emerald-400 font-black shrink-0">🌟</span>
            <p class="font-bold text-slate-900 dark:text-slate-100 leading-snug">
              <span class="text-emerald-800 dark:text-emerald-300 font-extrabold">
                ഏറ്റവും കൃത്യമായി ചെയ്തത്:
              </span>
              <span id="mostCompletedTaskNote" class="ml-1" data-testid="most-completed-task-note">
                പ്രഭാത ദിക്റുകൾ (Morning Adhkar) (0/7)
              </span>
            </p>
          </div>
          <div class="flex items-start gap-2 text-xs sm:text-sm font-malayalam">
            <span class="text-amber-600 dark:text-amber-400 font-black shrink-0">💡</span>
            <p class="font-bold text-slate-900 dark:text-slate-100 leading-snug">
              <span class="text-amber-800 dark:text-amber-300 font-extrabold">
                ശ്രദ്ധിക്കേണ്ട ടാസ്ക്:
              </span>
              <span id="mostSkippedTaskNote" class="ml-1" data-testid="most-skipped-task-note">
                വൈകുന്നേരത്തെ ദിക്റുകൾ (Evening Adhkar) (0/7)
              </span>
            </p>
          </div>
        </div>

        <!-- Quick Filter Chips: All (എല്ലാം) | Completed (പൂർത്തിയായവ) | Missed (നഷ്ടപ്പെട്ടവ) -->
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Audit Task Filter">
            <button
              type="button"
              data-audit-filter="all"
              data-testid="audit-filter-all"
              class="audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-teal-800 text-white border-teal-800 shadow-xs"
            >
              All (എല്ലാം) • <span id="auditCountAll">11</span>
            </button>
            <button
              type="button"
              data-audit-filter="completed"
              data-testid="audit-filter-completed"
              class="audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50"
            >
              Completed (പൂർത്തിയായവ) • <span id="auditCountCompleted">0</span>
            </button>
            <button
              type="button"
              data-audit-filter="missed"
              data-testid="audit-filter-missed"
              class="audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-50"
            >
              Missed (നഷ്ടപ്പെട്ടവ) • <span id="auditCountMissed">11</span>
            </button>
          </div>

          <div class="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex-wrap">
            <span class="inline-flex items-center gap-1">
              <span class="text-[10px]">🟢</span> Completed
            </span>
            <span class="inline-flex items-center gap-1">
              <span class="text-[10px]">🟡</span> Partial
            </span>
            <span class="inline-flex items-center gap-1">
              <span class="text-[10px]">🔴</span> Missed
            </span>
          </div>
        </div>

        <!-- Itemized Task-by-Task List (All 11 Tasks Row-by-Row) -->
        <div id="auditItemizedList" class="space-y-2.5 pt-1" data-testid="task-audit-itemized-list">
          <!-- Rendered via JS -->
        </div>
      </div>

    </div>

    <!-- Digital Tasbih Counter Container (Visible when Tab is 'tasbih') -->
    <div id="tasbihView" class="hidden flex flex-col items-center justify-center py-6 space-y-6">
      
      <!-- Preset Selectors -->
      <div class="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button data-tasbih-preset="subhanallah" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-teal-700 text-white border border-teal-600 shadow-xs cursor-pointer">
          سُبْحَانَ اللَّهِ (33)
        </button>
        <button data-tasbih-preset="alhamdulillah" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
          الْحَمْدُ لِلَّهِ (33)
        </button>
        <button data-tasbih-preset="allahuakbar" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
          اللَّهُ أَكْبَرُ (34)
        </button>
        <button data-tasbih-preset="astaghfirullah" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
          أَسْتَغْفِرُ اللَّهَ (100)
        </button>
        <button data-tasbih-preset="lailahaillallah" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
          لَا إِلَهَ إِلَّا اللَّهُ (100)
        </button>
        <button data-tasbih-preset="salawat" class="tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
          الصَّلَاةُ عَلَى النَّبِيِّ (10)
        </button>
      </div>

      <!-- Current Dhikr Display -->
      <div class="w-full bg-white rounded-3xl p-6 text-center border border-teal-100 shadow-sm space-y-2 card-surface">
        <p id="tasbihArabic" class="text-2xl font-bold font-arabic text-teal-900 leading-relaxed">سُبْحَانَ اللَّهِ</p>
        <p id="tasbihTranslit" class="text-xs font-medium text-slate-500">Subhanallah</p>
        <p id="tasbihTrans" class="text-xs text-slate-600">Glory be to Allah • അല്ലാഹു എത്ര പരിശുദ്ധൻ</p>
      </div>

        <!-- Huge Tactile Counter Circle -->
        <div class="relative flex items-center justify-center">
          <!-- Target indicator ring -->
          <svg class="w-64 h-64 -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="6" fill="transparent" class="text-slate-100 dark:text-slate-800" />
            <circle id="tasbihRingCircle" cx="50" cy="50" r="44" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="276.46" class="text-[#0d5c3a] transition-all duration-150" />
          </svg>

          <!-- Tap Button -->
          <button id="tasbihLargeBtn" class="absolute w-52 h-52 rounded-full bg-gradient-to-b from-[#115e59] via-[#0d5c3a] to-[#064e3b] text-white shadow-xl shadow-emerald-900/30 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform border-4 border-emerald-400/30 select-none">
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-100">Count</span>
            <span id="tasbihCurrentCount" class="text-5xl font-black font-mono tracking-tight my-1">0</span>
            <span id="tasbihTargetDisplay" class="text-xs text-emerald-100/90 font-medium">Target: 33</span>
          </button>
        </div>

        <!-- Tasbih Controls -->
        <div class="flex items-center gap-3">
          <button id="tasbihMinusBtn" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer">
            -1 Step
          </button>
          <button id="tasbihResetBtn" class="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 cursor-pointer">
            Reset (0)
          </button>
          <button id="tasbihChangeTargetBtn" class="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] text-xs font-bold transition-all border border-emerald-200 cursor-pointer">
            Change Target
          </button>
        </div>

      </div>

      <!-- Empty state (Search or Favorites) -->
      <div id="emptyState" class="hidden text-center py-12 px-4 space-y-3">
        <div class="text-4xl">🔍</div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">No Remembrances Found</h3>
        <p id="emptyStateMsg" class="text-xs text-slate-500 max-w-xs mx-auto">No adhkar match your active filter or search terms. Try clearing your search.</p>
      </div>
    </div>

  </main>

  <!-- ================= ADD CUSTOM TASK MODAL ================= -->
  <div id="addTaskModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-emerald-500/40 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-extrabold text-[#064e3b] dark:text-emerald-300 flex items-center gap-1.5">
          <span>✨</span>
          <span>Create Custom Daily Task (പുതിയ കർമ്മം ചേർക്കുക)</span>
        </h3>
        <button type="button" id="closeAddTaskModalBtn" class="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold p-1">✕</button>
      </div>
      <div class="space-y-2.5">
        <input
          type="text"
          id="customTaskTitleInput"
          placeholder="Task Title (e.g., Read 2 pages of Tafsir) *"
          class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d5c3a]"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            id="customTaskMalayalamInput"
            placeholder="മലയാളം പേര് (Optional)"
            class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-malayalam font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d5c3a]"
          />
          <input
            type="text"
            id="customTaskArabicInput"
            placeholder="الاسم بالعربية (Optional)"
            dir="rtl"
            class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-arabic font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d5c3a]"
          />
        </div>
        <div class="flex items-center justify-end gap-2 pt-2">
          <button type="button" id="cancelAddTaskBtn" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Cancel</button>
          <button type="button" id="saveCustomTaskBtn" class="px-4 py-2 rounded-xl bg-[#0d5c3a] hover:bg-[#064e3b] text-white text-xs font-extrabold cursor-pointer shadow-xs">Save Task</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= SETTINGS MODAL ================= -->
  <div id="settingsModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto card-surface">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span> Display &amp; Preferences
        </h2>
        <button id="closeSettingsBtn" class="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
      </div>

      <div class="py-4 space-y-5 text-sm">
        
        <!-- Arabic Font Size -->
        <div>
          <label class="block font-semibold text-slate-800 dark:text-slate-200 mb-2">Arabic Font Size</label>
          <div class="grid grid-cols-3 gap-2">
            <button data-fontsize="medium" class="font-size-opt py-2 px-3 rounded-xl border border-slate-200 text-center text-xs">
              <div>Medium</div>
              <div class="font-arabic text-base">بِسْمِ اللَّهِ</div>
            </button>
            <button data-fontsize="large" class="font-size-opt py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-2 ring-teal-600/20 text-center text-xs">
              <div>Large</div>
              <div class="font-arabic text-lg">بِسْمِ اللَّهِ</div>
            </button>
            <button data-fontsize="xlarge" class="font-size-opt py-2 px-3 rounded-xl border border-slate-200 text-center text-xs">
              <div>Extra Large</div>
              <div class="font-arabic text-xl">بِسْمِ اللَّهِ</div>
            </button>
          </div>
        </div>

        <!-- Translation Language -->
        <div>
          <label class="block font-semibold text-slate-800 dark:text-slate-200 mb-2">Translation Language</label>
          <div class="grid grid-cols-3 gap-2">
            <button data-lang="both" class="lang-opt py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold text-xs">
              Both (EN + ML)
            </button>
            <button data-lang="ml" class="lang-opt py-2 px-3 rounded-xl border border-slate-200 text-xs">
              Malayalam Only
            </button>
            <button data-lang="en" class="lang-opt py-2 px-3 rounded-xl border border-slate-200 text-xs">
              English Only
            </button>
          </div>
        </div>

        <!-- Display Toggles -->
        <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Show Transliteration (Pronunciation)</span>
            <input type="checkbox" id="toggleTranslit" class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Show Translations</span>
            <input type="checkbox" id="toggleTrans" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Show Hadith Virtues &amp; Rewards</span>
            <input type="checkbox" id="toggleVirtues" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Audio Tap Sounds</span>
            <input type="checkbox" id="toggleSoundSetting" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Haptic Vibration on Tap</span>
            <input type="checkbox" id="toggleVibrate" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Tap anywhere on card to count</span>
            <input type="checkbox" id="toggleCardTap" class="w-4 h-4 text-teal-600 rounded">
          </label>

          <!-- Focus Timer Toggle (OFF by default) -->
          <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div class="pr-3">
              <div class="text-sm font-semibold text-slate-900 dark:text-white font-malayalam">
                Focus Timer (ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ടൈമർ)
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-malayalam mt-0.5">
                Show countdown timer on adhkar cards / ദിക്റുകൾക്ക് ടൈമർ കാണിക്കുക
              </div>
            </div>
            <button
              type="button"
              id="toggleFocusTimerBtn"
              data-testid="toggle-focus-timer-switch"
              role="switch"
              aria-checked="false"
              aria-label="Focus Timer (ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ടൈമർ)"
              class="w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 bg-slate-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span id="toggleFocusTimerKnob" class="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150 translate-x-0.5"></span>
            </button>
          </div>
        </div>

        <!-- Daily Reminders & Clean Consumer Notification Settings -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🔔</span>
              <span>Daily Adhkar Reminders</span>
            </label>
            <button
              type="button"
              id="toggleRemindersSwitchBtn"
              data-testid="toggle-daily-reminders-switch"
              role="switch"
              aria-checked="false"
              aria-label="Toggle Daily Adhkar Reminders"
              class="w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 bg-slate-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span id="toggleRemindersSwitchKnob" class="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150 translate-x-0.5"></span>
            </button>
          </div>

          <!-- Direct Google Calendar Daily Alarm Buttons -->
          <div class="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/80 space-y-2">
            <div class="text-xs font-extrabold text-amber-950 dark:text-amber-200 font-malayalam">
              📅 Direct Google Calendar Alarms (ഫോൺ കലണ്ടർ അലാറം)
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" id="googleCalMorningBtn" class="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <span>📅</span>
                <span>Add Morning Alarm to Calendar</span>
              </button>
              <button type="button" id="googleCalEveningBtn" class="py-2 px-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <span>📅</span>
                <span>Add Evening Alarm to Calendar</span>
              </button>
            </div>
          </div>

          <!-- Clean Notification Schedule Pickers & Test Buttons -->
          <div id="remindersConfigPanel" class="hidden space-y-3 p-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-800/50 border border-teal-500/60 dark:border-slate-700">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <!-- Morning / പ്രഭാതം -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 font-malayalam">☀️ Morning / പ്രഭാതം</span>
                  <span id="morningFormattedTime" class="text-[11px] font-mono font-bold text-teal-800 dark:text-teal-300">5:30 AM</span>
                </div>
                <input type="time" id="morningReminderInput" value="05:30" aria-label="Morning Reminder Time" class="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white">
                <div class="flex gap-1 pt-0.5">
                  <button type="button" data-reminder-preset="morning" data-time="05:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">05:30</button>
                  <button type="button" data-reminder-preset="morning" data-time="06:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">06:00</button>
                  <button type="button" data-reminder-preset="morning" data-time="07:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">07:00</button>
                </div>
              </div>

              <!-- Evening / പ്രദോഷം -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 font-malayalam">🌙 Evening / പ്രദോഷം</span>
                  <span id="eveningFormattedTime" class="text-[11px] font-mono font-bold text-teal-800 dark:text-teal-300">5:30 PM</span>
                </div>
                <input type="time" id="eveningReminderInput" value="17:30" aria-label="Evening Reminder Time" class="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white">
                <div class="flex gap-1 pt-0.5">
                  <button type="button" data-reminder-preset="evening" data-time="16:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">16:30</button>
                  <button type="button" data-reminder-preset="evening" data-time="17:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">17:30</button>
                  <button type="button" data-reminder-preset="evening" data-time="18:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">18:30</button>
                </div>
              </div>

              <!-- Sleep / ഉറക്കം -->
              <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 font-malayalam">🌌 Sleep / ഉറക്കം</span>
                  <span id="sleepFormattedTime" class="text-[11px] font-mono font-bold text-teal-800 dark:text-teal-300">10:00 PM</span>
                </div>
                <input type="time" id="sleepReminderInput" value="22:00" aria-label="Sleep Reminder Time" class="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white">
                <div class="flex gap-1 pt-0.5">
                  <button type="button" data-reminder-preset="sleep" data-time="21:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">21:30</button>
                  <button type="button" data-reminder-preset="sleep" data-time="22:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">22:00</button>
                  <button type="button" data-reminder-preset="sleep" data-time="22:30" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">22:30</button>
                </div>
              </div>
            </div>

            <!-- Daily Goal Completion Reminder -->
            <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/60 dark:border-slate-800 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-extrabold text-slate-900 dark:text-white">🎯 Daily Goal Completion Reminder</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">Sends a reminder if daily goal progress is &lt; 100%</div>
                </div>
                <button
                  type="button"
                  id="toggleGoalReminderBtn"
                  role="switch"
                  aria-checked="false"
                  aria-label="Toggle Daily Goal Completion Reminder"
                  class="w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 bg-slate-300 dark:bg-slate-700"
                >
                  <span id="toggleGoalReminderKnob" class="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 translate-x-0.5"></span>
                </button>
              </div>
              <div id="goalReminderTimeBox" class="hidden pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Reminder Scheduled Time:</span>
                  <span id="goalFormattedTime" class="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-400">8:00 PM</span>
                </div>
                <input type="time" id="goalReminderInput" value="20:00" aria-label="Daily Goal Reminder Time" class="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white">
                <div class="flex gap-1 pt-0.5">
                  <button type="button" data-reminder-preset="goal" data-time="19:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">19:00</button>
                  <button type="button" data-reminder-preset="goal" data-time="20:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">20:00</button>
                  <button type="button" data-reminder-preset="goal" data-time="21:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">21:00</button>
                  <button type="button" data-reminder-preset="goal" data-time="22:00" class="reminder-preset-btn flex-1 py-1 text-[10px] font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer">22:00</button>
                </div>
              </div>
            </div>

            <!-- Clean User-Friendly Test Buttons -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                id="sendTestNotificationBtn"
                data-testid="send-test-notification-btn"
                class="py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>🔔</span>
                <span id="sendTestNotificationLabel" class="font-malayalam">Send Test Notification / ടെസ്റ്റ് ചെയ്യുക</span>
              </button>
              <button
                type="button"
                id="testCatchUpBtn"
                data-testid="simulate-catchup-alert-btn"
                class="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-500 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Test Catch-Up</span>
              </button>
            </div>
            <div id="testNotificationFeedback" class="hidden p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-600 text-xs font-extrabold text-emerald-950 dark:text-emerald-200 text-center font-malayalam">
              നോട്ടിഫിക്കേഷൻ അയച്ചു! ✓
            </div>
          </div>
        </div>

        <!-- Theme Options -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label class="block font-semibold text-slate-800 dark:text-slate-200 mb-2">Theme Mode</label>
          <div class="grid grid-cols-3 gap-2">
            <button data-theme="emerald" class="theme-choice py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold text-xs">
              Emerald Light
            </button>
            <button data-theme="dark" class="theme-choice py-2 px-3 rounded-xl border border-slate-200 text-xs">
              Slate Dark
            </button>
            <button data-theme="midnight" class="theme-choice py-2 px-3 rounded-xl border border-slate-200 text-xs">
              OLED Black
            </button>
          </div>
        </div>

        <!-- Offline Standalone Download Action -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button id="modalDownloadBtn" class="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <span>💾</span>
            <span>Download Standalone Single-File (.html)</span>
          </button>
          <p class="text-[11px] text-slate-500 text-center mt-1.5">Saves this complete app as a single .html file that runs 100% offline with zero dependencies on any phone or computer.</p>
        </div>

      </div>
    </div>
  </div>

  <!-- ================= IN-APP NOTIFICATION TOAST ================= -->
  <div id="inAppNotificationToast" class="hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md rounded-2xl bg-[#064e3b] text-white p-4 shadow-2xl border border-emerald-400/40 flex items-start justify-between gap-3">
    <div class="space-y-1 min-w-0">
      <div id="inAppToastTitle" class="text-xs sm:text-sm font-extrabold text-amber-300 font-malayalam">Daily Adhkar</div>
      <div id="inAppToastBody" class="text-xs text-emerald-50 font-malayalam leading-relaxed">രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅</div>
    </div>
    <button type="button" id="closeInAppToastBtn" class="text-emerald-200 hover:text-white text-xs font-bold p-1 shrink-0 cursor-pointer">✕</button>
  </div>

  <!-- ================= DUOLINGO-STYLE STREAK MODAL ================= -->
  <div id="streakModal" data-testid="streak-modal" role="dialog" aria-modal="true" aria-labelledby="modalCurrentStreak" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-500/30 dark:border-slate-800 text-center space-y-4 max-h-[92vh] overflow-y-auto card-surface">
      <button type="button" id="closeStreakModalTopBtn" aria-label="Close Streak Modal" class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-bold">✕</button>

      <!-- 1. Centerpiece Visuals: Animated Orange Flame SVG with Glowing Particles + Large Streak Number + Subtitle -->
      <div class="pt-1 pb-1">
        <div class="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div class="absolute inset-2 rounded-full bg-gradient-to-tr from-orange-500/30 via-amber-400/25 to-yellow-300/10 blur-xl pointer-events-none"></div>
          <span class="streak-particle absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" style="animation-delay: 0s;"></span>
          <span class="streak-particle absolute top-4 right-3 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]" style="animation-delay: 0.5s;"></span>
          <span class="streak-particle absolute bottom-4 left-2 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047]" style="animation-delay: 1.1s;"></span>
          <span class="streak-particle absolute bottom-5 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]" style="animation-delay: 0.8s;"></span>

          <svg class="streak-flame-svg w-20 h-20 overflow-visible" viewBox="0 0 120 135" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="duolingoFlameOuter" x1="60" y1="6" x2="60" y2="128" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FF9800" />
                <stop offset="55%" stop-color="#FF6D00" />
                <stop offset="100%" stop-color="#E65100" />
              </linearGradient>
              <linearGradient id="duolingoFlameInner" x1="60" y1="36" x2="60" y2="122" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#FFF176" />
                <stop offset="60%" stop-color="#FFB300" />
                <stop offset="100%" stop-color="#FF8F00" />
              </linearGradient>
            </defs>
            <path d="M64.5 8C64.5 8 106 42.5 106 82C106 108.5 85.4 128 60 128C34.6 128 14 108.5 14 82C14 59.5 29.5 41.2 41.5 29.5C40.2 42 46.8 50.5 52 54C49.5 34.5 56.5 18.5 64.5 8Z" fill="url(#duolingoFlameOuter)" />
            <path d="M61.5 42C61.5 42 86 63.5 86 87.5C86 104.5 74.4 118 60 118C45.6 118 34 104.5 34 87.5C34 73.5 44 62 52.5 54.5C52.5 63.5 57.5 68 61 70.5C59 58 60 48.5 61.5 42Z" fill="url(#duolingoFlameInner)" />
            <ellipse cx="60" cy="101" rx="13" ry="15" fill="#FFFDE7" fill-opacity="0.9" />
          </svg>
        </div>

        <div id="modalCurrentStreak" data-testid="streak-modal-number" class="text-5xl sm:text-6xl font-black tracking-tight text-orange-500 dark:text-orange-400 leading-none mt-1">0</div>
        <p id="streakModalSubtitle" data-testid="streak-modal-subtitle" class="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-200 font-malayalam mt-1.5">
          day streak / തുടർച്ചയായ ദിവസങ്ങൾ
        </p>
        <p class="text-[11px] font-bold text-amber-700 dark:text-amber-300 mt-0.5">
          🏆 Best Record: <span id="modalBestStreak">0</span> days
        </p>
      </div>

      <!-- 2. 7-Day Week Row (Su, Mo, Tu, We, Th, Fr, Sa) & Streak Freeze Banner -->
      <div data-testid="streak-week-card" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div id="streakWeekRow" data-testid="streak-week-row" class="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          <!-- Rendered dynamically via renderStreakModal() -->
        </div>
        <div id="streakFreezeBanner" data-testid="streak-freeze-banner" class="hidden px-3 py-2 rounded-xl bg-cyan-50/90 dark:bg-cyan-950/60 border border-cyan-400/70 dark:border-cyan-500/50 text-cyan-900 dark:text-cyan-200 text-xs font-extrabold font-malayalam flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
          <span>❄️ Streak Freeze / വിട്ടുപോയ ദിവസം സംരക്ഷിച്ചു</span>
        </div>
      </div>

      <!-- 3. 4-Pillar Daily Qualification Checklist -->
      <div data-testid="streak-pillars-checklist" class="space-y-2 text-left">
        <div class="flex items-center justify-between px-1">
          <span id="streakPillarsHeader" class="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-malayalam">
            Today’s 4 Required Adhkar Pillars (0/4)
          </span>
          <span id="streakPillarsStatusNote" class="text-[11px] font-bold text-[#0d5c3a] dark:text-emerald-400 font-malayalam">
            4 വിഭാഗവും പൂർത്തിയാക്കുക
          </span>
        </div>
        <div id="streakPillarsList" class="grid grid-cols-1 gap-1.5">
          <!-- Rendered dynamically via renderStreakModal() -->
        </div>
      </div>

      <!-- 4. Bottom Emerald Green "തുടരുക / Continue" Button -->
      <div class="pt-1">
        <button type="button" id="closeStreakModalBtn" data-testid="streak-continue-btn" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0d5c3a] via-[#115e59] to-[#064e3b] hover:from-[#064e3b] hover:to-[#0d5c3a] text-white font-extrabold text-sm shadow-lg shadow-emerald-900/25 transition-all cursor-pointer active:scale-98 font-malayalam">
          തുടരുക / Continue
        </button>
      </div>
    </div>
  </div>

  <!-- ================= BOXLESS FREE-FLOAT COMPLETION CELEBRATION OVERLAY ================= -->
  <div id="completionOverlay" data-testid="completion-free-overlay" style="backdrop-filter: blur(5px) brightness(0.6); -webkit-backdrop-filter: blur(5px) brightness(0.6);" class="hidden fixed inset-0 z-50 flex flex-col items-center justify-center select-none cursor-pointer completion-free-overlay px-4">
    <!-- Free-floating Bouncing/Igniting Fire & Scattering Gold Stars/Particles (NO card background or border box) -->
    <div class="relative flex items-center justify-center mb-3 pointer-events-none">
      <span class="completion-gold-particle text-amber-300 text-2xl" style="--tx: -74px; --ty: -66px; --rot: -35deg; animation-delay: 0.02s;">✨</span>
      <span class="completion-gold-particle text-yellow-300 text-xl" style="--tx: 76px; --ty: -60px; --rot: 40deg; animation-delay: 0.05s;">★</span>
      <span class="completion-gold-particle text-amber-200 text-lg" style="--tx: -92px; --ty: -10px; --rot: -60deg; animation-delay: 0.09s;">✦</span>
      <span class="completion-gold-particle text-yellow-400 text-2xl" style="--tx: 94px; --ty: -14px; --rot: 55deg; animation-delay: 0.07s;">✨</span>
      <span class="completion-gold-particle text-amber-300 text-base" style="--tx: -58px; --ty: 50px; --rot: -25deg; animation-delay: 0.11s;">★</span>
      <span class="completion-gold-particle text-yellow-200 text-lg" style="--tx: 62px; --ty: 46px; --rot: 30deg; animation-delay: 0.13s;">✦</span>
      <span class="completion-gold-particle text-amber-400 text-xl" style="--tx: 0px; --ty: -92px; --rot: 15deg; animation-delay: 0.04s;">✨</span>
      <span class="completion-gold-particle text-yellow-300 text-sm" style="--tx: -36px; --ty: -82px; --rot: -20deg; animation-delay: 0.08s;">●</span>
      <span class="completion-gold-particle text-amber-300 text-sm" style="--tx: 40px; --ty: -80px; --rot: 20deg; animation-delay: 0.10s;">●</span>

      <div id="completionFlameIcon" class="completion-free-flame text-7xl sm:text-8xl leading-none select-none" style="text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 165, 0, 0.85);">
        🔥
      </div>
    </div>

    <!-- Glowing Large Golden Arabic Calligraphy Centered Directly Below Fire -->
    <div id="completionArabicText" dir="rtl" class="completion-free-text-enter pointer-events-none font-arabic text-4xl sm:text-5xl font-bold text-amber-300 text-center tracking-wide mb-2 completion-free-text-glow" style="text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5);">
      مَا شَاءَ اللَّه
    </div>

    <!-- Celebratory Category Completion Text in Bold Glowing White and Gold -->
    <div id="completionSubText" class="completion-free-text-enter pointer-events-none text-center space-y-1.5" style="animation-delay: 0.05s;">
      <div id="completionDynamicCategoryText" class="font-malayalam text-xl sm:text-2xl font-extrabold text-white tracking-tight completion-free-text-glow" style="text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5);">
        പ്രഭാത ദിക്റുകൾ പൂർത്തിയായി!
      </div>
      <div id="completionFixedSubtitle" class="font-malayalam text-sm sm:text-base font-extrabold text-amber-300 tracking-wide completion-free-text-glow" style="text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5);">
        വിഭാഗം പൂർത്തിയായി! • Category Completed!
      </div>
    </div>
  </div>

  <!-- ================= FADHEELATH SHARE IMAGE PREVIEW MODAL ================= -->
  <div id="fadheelathModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-amber-500/50 space-y-3.5 max-h-[90vh] overflow-y-auto card-surface">
      <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 class="text-sm font-extrabold text-emerald-950 dark:text-amber-300 font-malayalam flex items-center gap-1.5">
          <span>🖼️</span>
          <span>ചിത്രമായി പങ്കുവെക്കുക (9:16 Fadheelath Card)</span>
        </h3>
        <button type="button" id="closeFadheelathModalBtn" class="p-1 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold">✕</button>
      </div>
      <p id="fadheelathStatusMsg" class="text-xs font-malayalam font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-400/60">
        ✓ 9:16 ഫളീലത്ത് കാർഡ് ഡൗൺലോഡ് ചെയ്യുകയും ആപ്പ് ലിങ്ക് ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തുകയും ചെയ്തു!
      </p>
      <div class="flex justify-center">
        <img id="fadheelathPreviewImg" alt="9:16 Fadheelath Card Preview" class="w-56 aspect-[9/16] rounded-2xl border-2 border-amber-500 shadow-lg object-contain bg-[#0d2818]" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <a id="fadheelathDownloadLink" href="#" download="mudaawama-adhkar.png" class="py-2.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-200 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-amber-500/60 shadow-xs">
          <span>📥</span>
          <span>Download PNG Image</span>
        </a>
        <a id="fadheelathWhatsappLink" href="#" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs">
          <span>📲</span>
          <span>Share on WhatsApp</span>
        </a>
      </div>
    </div>
  </div>



  <!-- EMBEDDED COMPLETE DATASET -->
  <script>
    window.ADHKAR_DATA = ${jsonString};
  </script>

  <!-- APP CLIENT SCRIPT -->
  <script>
    (function() {
      // 1. Audio Synthesizer (Zero External Audio Files Required)
      let audioCtx = null;
      function getAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playTapBeep() {
        if (!state.settings.soundEnabled) return;
        try {
          const ctx = getAudioContext();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
      }

      function playCompletionChime() {
        if (!state.settings.soundEnabled) return;
        try {
          const ctx = getAudioContext();
          if (!ctx) return;
          const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
            gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.07);
            osc.stop(ctx.currentTime + idx * 0.07 + 0.35);
          });
        } catch (e) {}
      }

      function triggerVibration(duration = 20) {
        if (!state.settings.vibrateEnabled) return;
        try {
          if ('vibrate' in navigator) {
            navigator.vibrate(duration);
          }
        } catch (e) {}
      }

      // 2. State & Storage
      const DEFAULT_SETTINGS = {
        arabicFontSize: 'large',
        showTransliteration: false,
        showTranslation: true,
        translationLanguage: 'both',
        showVirtues: true,
        soundEnabled: true,
        vibrateEnabled: true,
        theme: 'emerald',
        cardTapToCount: false,
        showFocusTimer: false,
        remindersEnabled: false,
        morningReminderTime: '05:30',
        eveningReminderTime: '17:30',
        sleepReminderTime: '22:00',
        goalReminderEnabled: false,
        dailyGoalReminderTime: '20:00',
      };

      const TASK_CATEGORY_BADGES = {
        prayer: { label: 'Fard & Sunnah Prayers', mlLabel: 'നമസ്കാരങ്ങൾ', icon: '🕌', colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
        sunnah: { label: 'Prophetic Sunnah', mlLabel: 'സുന്നത്തുകൾ', icon: '🌙', colorClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' },
        quran: { label: 'Quran & Surahs', mlLabel: 'ഖുർആൻ പാരായണം', icon: '📖', colorClass: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800' },
        dhikr: { label: 'Daily Dhikr', mlLabel: 'ദിക്റുകൾ', icon: '📿', colorClass: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800' },
        charity: { label: 'Charity & Good Deeds', mlLabel: 'ദാനധർമ്മം / നന്മകൾ', icon: '🤝', colorClass: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' },
        custom: { label: 'Personal Goals', mlLabel: 'വ്യക്തിഗത കർമ്മങ്ങൾ', icon: '✨', colorClass: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' }
      };

      function getTodayString() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }

      function cloneDefaultTasks() {
        return JSON.parse(JSON.stringify(window.ADHKAR_DATA.dailyTasks || []));
      }

      const state = {
        activeTab: 'morning',
        isCategoryOpen: false,
        expandedTranslations: {},
        timers: {},
        searchQuery: '',
        filterMode: 'all',
        counts: {},
        favorites: [],
        streak: { currentStreak: 0, bestStreak: 0, lastCompletedDate: null, completionTimestamps: {}, usedFreezeDates: [] },
        settings: { ...DEFAULT_SETTINGS },
        playingId: null,
        playbackStatus: 'idle',
        autoplayActive: false,
        autoplayIndex: 0,
        lastSelectedCardId: null,
        tasbih: {
          currentDhikrId: 'subhanallah',
          count: 0,
          target: 33
        },
        tasks: cloneDefaultTasks(),
        tasksHistory: {},
        taskCategoryFilter: 'all',
        taskStatusFilter: 'all',
        taskSearchQuery: '',
        expandedTaskVirtueId: null,
        auditPeriod: 'week', // 'week' (7 days) | 'month' (30 days)
        auditFilter: 'all'   // 'all' | 'completed' | 'missed'
      };

      // Load from LocalStorage
      try {
        const savedSettings = localStorage.getItem('adhkar_settings');
        if (savedSettings) state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
        const savedFocusTimer = localStorage.getItem('adhkar_show_focus_timer');
        if (savedFocusTimer !== null) {
          state.settings.showFocusTimer = savedFocusTimer === 'true';
        } else {
          state.settings.showFocusTimer = Boolean(state.settings.showFocusTimer);
        }

        const savedFavs = localStorage.getItem('adhkar_favorites');
        if (savedFavs) state.favorites = JSON.parse(savedFavs);

        const savedStreak = localStorage.getItem('adhkar_streak_data');
        if (savedStreak) {
          const parsedStreak = JSON.parse(savedStreak);
          state.streak = {
            currentStreak: parsedStreak.currentStreak || 0,
            bestStreak: parsedStreak.bestStreak || 0,
            lastCompletedDate: parsedStreak.lastCompletedDate || null,
            completionTimestamps: (parsedStreak.completionTimestamps && typeof parsedStreak.completionTimestamps === 'object') ? parsedStreak.completionTimestamps : {},
            usedFreezeDates: Array.isArray(parsedStreak.usedFreezeDates) ? parsedStreak.usedFreezeDates : []
          };
        }
        const savedCompletionTs = localStorage.getItem('adhkar_completion_timestamps');
        if (savedCompletionTs) {
          const parsedTs = JSON.parse(savedCompletionTs);
          if (parsedTs && typeof parsedTs === 'object') {
            state.streak.completionTimestamps = { ...state.streak.completionTimestamps, ...parsedTs };
          }
        }

        const savedTasksHistory = localStorage.getItem('adhkar_tasks_history');
        if (savedTasksHistory) state.tasksHistory = JSON.parse(savedTasksHistory);

        const today = getTodayString();
        const savedDate = localStorage.getItem('adhkar_last_date');
        const savedCounts = localStorage.getItem('adhkar_counts');
        if (savedDate !== today) {
          state.counts = {};
          localStorage.setItem('adhkar_last_date', today);
          localStorage.setItem('adhkar_counts', '{}');
        } else if (savedCounts) {
          state.counts = JSON.parse(savedCounts);
        }

        const savedTasksRaw = localStorage.getItem('adhkar_daily_tasks');
        const savedTasksDate = localStorage.getItem('adhkar_tasks_date');
        if (savedTasksRaw) {
          const parsedTasks = JSON.parse(savedTasksRaw);
          const taskList = Array.isArray(parsedTasks)
            ? parsedTasks
            : (parsedTasks && Array.isArray(parsedTasks.tasks) ? parsedTasks.tasks : null);
          const effectiveDate = (parsedTasks && parsedTasks.date) || savedTasksDate;

          if (taskList && effectiveDate === today) {
            state.tasks = taskList.map(t => {
              if (!t || typeof t !== 'object') return t;
              const stats = getTaskPortionStats(t);
              return { ...t, completed: stats.isComplete };
            });
          } else if (taskList) {
            const customOnes = taskList
              .filter(t => t && t.isCustom)
              .map(t => ({
                ...t,
                completed: false,
                subtasks: t.subtasks ? t.subtasks.map(s => ({ ...s, completed: false })) : undefined
              }));
            state.tasks = [...cloneDefaultTasks(), ...customOnes];
          }
        }
      } catch (e) {}

      const RAWATIB_RAKAHS = {
        'rawatib-fajr': 2,
        'rawatib-dhuhr-pre': 4,
        'rawatib-dhuhr-post': 2,
        'rawatib-maghrib': 2,
        'rawatib-isha': 2
      };

      function getTaskPortionStats(task) {
        if (!task || typeof task !== 'object') {
          return { hasPortions: false, completedPortions: 0, totalPortions: 0, percent: 0, unit: '', isComplete: false, isPartial: false };
        }
        if (task.id === 'task-fard-prayers' || task.id === 'task-5-prayers') {
          const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
          const totalPortions = subtasks.length > 0 ? subtasks.length : 5;
          const completedPortions = subtasks.filter(s => Boolean(s && s.completed)).length;
          const percent = totalPortions > 0 ? Math.round((completedPortions / totalPortions) * 100) : 0;
          const isComplete = totalPortions > 0 && completedPortions === totalPortions;
          const isPartial = completedPortions > 0 && completedPortions < totalPortions;
          return { hasPortions: true, completedPortions: completedPortions, totalPortions: totalPortions, percent: percent, unit: 'prayers', isComplete: isComplete, isPartial: isPartial };
        }
        if (task.id === 'task-rawatib' || task.id === 'task-12-rawatib') {
          const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
          const totalPortions = 12;
          let completedPortions = 0;
          subtasks.forEach(s => {
            if (s && s.completed) {
              completedPortions += RAWATIB_RAKAHS[s.id] || 2;
            }
          });
          const percent = Math.min(100, Math.round((completedPortions / totalPortions) * 100));
          const isComplete = completedPortions >= totalPortions;
          const isPartial = completedPortions > 0 && completedPortions < totalPortions;
          return { hasPortions: true, completedPortions: completedPortions, totalPortions: totalPortions, percent: percent, unit: "rak'ahs", isComplete: isComplete, isPartial: isPartial };
        }
        if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
          const totalPortions = task.subtasks.length;
          const completedPortions = task.subtasks.filter(s => Boolean(s && s.completed)).length;
          const percent = Math.round((completedPortions / totalPortions) * 100);
          const isComplete = completedPortions === totalPortions;
          const isPartial = completedPortions > 0 && completedPortions < totalPortions;
          return { hasPortions: true, completedPortions: completedPortions, totalPortions: totalPortions, percent: percent, unit: 'steps', isComplete: isComplete, isPartial: isPartial };
        }
        const done = Boolean(task.completed);
        return { hasPortions: false, completedPortions: done ? 1 : 0, totalPortions: 1, percent: done ? 100 : 0, unit: '', isComplete: done, isPartial: false };
      }

      function isTaskEffectivelyCompleted(task) {
        return getTaskPortionStats(task).isComplete;
      }

      // Save Helpers
      function saveState() {
        try {
          localStorage.setItem('adhkar_counts', JSON.stringify(state.counts));
          localStorage.setItem('adhkar_settings', JSON.stringify(state.settings));
          localStorage.setItem('adhkar_show_focus_timer', String(Boolean(state.settings.showFocusTimer)));
          localStorage.setItem('adhkar_favorites', JSON.stringify(state.favorites));
          localStorage.setItem('adhkar_streak_data', JSON.stringify(state.streak));
          localStorage.setItem('adhkar_completion_timestamps', JSON.stringify(state.streak.completionTimestamps || {}));
        } catch (e) {}
      }

      function saveTasksState() {
        try {
          const today = getTodayString();
          localStorage.setItem('adhkar_daily_tasks', JSON.stringify(state.tasks));
          localStorage.setItem('adhkar_tasks_date', today);
          const completedTaskIds = state.tasks.filter(t => isTaskEffectivelyCompleted(t)).map(t => t.id);
          const total = state.tasks.length;
          const completed = completedTaskIds.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const dayRecord = {
            ...(state.tasksHistory[today] || {}),
            date: today,
            completedCount: completed,
            totalCount: total,
            percentage: percent,
            completedTaskIds: completedTaskIds
          };
          state.tasks.forEach(t => {
            const stats = getTaskPortionStats(t);
            dayRecord[t.id] = stats.isComplete;
            if (stats.hasPortions) {
              dayRecord[t.id + '_portion'] = stats.completedPortions;
              dayRecord[t.id + '_percent'] = stats.percent;
              dayRecord[t.id + '_total'] = stats.totalPortions;
            }
          });
          state.tasksHistory[today] = dayRecord;
          localStorage.setItem('adhkar_tasks_history', JSON.stringify(state.tasksHistory));
        } catch (e) {}
      }

      function syncAdhkarCompletionToTasks() {
        const mItems = window.ADHKAR_DATA.morning || [];
        const eItems = window.ADHKAR_DATA.evening || [];
        const mDone = mItems.length > 0 && mItems.every(i => (state.counts[i.id] || 0) >= i.target);
        const eDone = eItems.length > 0 && eItems.every(i => (state.counts[i.id] || 0) >= i.target);
        let changed = false;
        state.tasks = state.tasks.map(t => {
          if ((t.id === 'task-morning-adhkar' || t.id === 'task-adhkar-morning') && mDone && !t.completed) {
            changed = true;
            return { ...t, completed: true };
          }
          if ((t.id === 'task-evening-adhkar' || t.id === 'task-adhkar-evening') && eDone && !t.completed) {
            changed = true;
            return { ...t, completed: true };
          }
          return t;
        });
        if (changed) saveTasksState();
      }

      // Elements
      const els = {
        appBody: document.getElementById('appBody'),
        streakBtn: document.getElementById('streakBtn'),
        streakCount: document.getElementById('streakCount'),
        headerCategoryLabel: document.getElementById('headerCategoryLabel'),
        headerCategoryArabic: document.getElementById('headerCategoryArabic'),
        headerProgressContainer: document.getElementById('headerProgressContainer'),
        progressStatusText: document.getElementById('progressStatusText'),
        progressPercentText: document.getElementById('progressPercentText'),
        progressBarFill: document.getElementById('progressBarFill'),
        headerTimeHint: document.getElementById('headerTimeHint'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        soundIcon: document.getElementById('soundIcon'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        completionOverlay: document.getElementById('completionOverlay'),
        completionDynamicCategoryText: document.getElementById('completionDynamicCategoryText'),
        completionFixedSubtitle: document.getElementById('completionFixedSubtitle'),
        adhkarBottomActions: document.getElementById('adhkarBottomActions'),
        resetCurrentCategoryBtn: document.getElementById('resetCurrentCategoryBtn'),
        completeAllCategoryBtn: document.getElementById('completeAllCategoryBtn'),
        categoryGridSection: document.getElementById('categoryGridSection'),
        featuredCategoryBanner: document.getElementById('featuredCategoryBanner'),
        categoryDetailView: document.getElementById('categoryDetailView'),
        backToCategoriesBtn: document.getElementById('backToCategoriesBtn'),
        openedCategoryTitle: document.getElementById('openedCategoryTitle'),
        openedCategoryArabic: document.getElementById('openedCategoryArabic'),
        searchFilterSection: document.getElementById('searchFilterSection'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        autoplayAllBtn: document.getElementById('autoplayAllBtn'),
        autoplayAllBtnIcon: document.getElementById('autoplayAllBtnIcon'),
        autoplayAllBtnLabel: document.getElementById('autoplayAllBtnLabel'),
        adhkarList: document.getElementById('adhkarList'),
        tasksView: document.getElementById('tasksView'),
        progressView: document.getElementById('progressView'),
        statTotalRecitations: document.getElementById('statTotalRecitations'),
        statActiveDays: document.getElementById('statActiveDays'),
        statBestStreak: document.getElementById('statBestStreak'),
        statCurrentStreak: document.getElementById('statCurrentStreak'),
        progressStreakPill: document.getElementById('progressStreakPill'),
        weeklyAdhkarAvgBadge: document.getElementById('weeklyAdhkarAvgBadge'),
        weeklyAdhkarTrackerGrid: document.getElementById('weeklyAdhkarTrackerGrid'),
        dailyTasksList: document.getElementById('dailyTasksList'),
        tasksProgressText: document.getElementById('tasksProgressText'),
        tasksPercentText: document.getElementById('tasksPercentText'),
        tasksProgressBarFill: document.getElementById('tasksProgressBarFill'),
        taskSearchInput: document.getElementById('taskSearchInput'),
        clearTaskSearchBtn: document.getElementById('clearTaskSearchBtn'),
        openAddTaskModalBtn: document.getElementById('openAddTaskModalBtn'),
        completeAllTasksBtn: document.getElementById('completeAllTasksBtn'),
        resetAllTasksBtn: document.getElementById('resetAllTasksBtn'),
        addTaskModal: document.getElementById('addTaskModal'),
        closeAddTaskModalBtn: document.getElementById('closeAddTaskModalBtn'),
        cancelAddTaskBtn: document.getElementById('cancelAddTaskBtn'),
        saveCustomTaskBtn: document.getElementById('saveCustomTaskBtn'),
        customTaskTitleInput: document.getElementById('customTaskTitleInput'),
        customTaskMalayalamInput: document.getElementById('customTaskMalayalamInput'),
        customTaskArabicInput: document.getElementById('customTaskArabicInput'),
        auditPeriodWeekBtn: document.getElementById('auditPeriodWeekBtn'),
        auditPeriodMonthBtn: document.getElementById('auditPeriodMonthBtn'),
        mostCompletedTaskNote: document.getElementById('mostCompletedTaskNote'),
        mostSkippedTaskNote: document.getElementById('mostSkippedTaskNote'),
        auditCountAll: document.getElementById('auditCountAll'),
        auditCountCompleted: document.getElementById('auditCountCompleted'),
        auditCountMissed: document.getElementById('auditCountMissed'),
        auditItemizedList: document.getElementById('auditItemizedList'),
        tasbihView: document.getElementById('tasbihView'),
        emptyState: document.getElementById('emptyState'),
        emptyStateMsg: document.getElementById('emptyStateMsg'),
        // Modals
        settingsModal: document.getElementById('settingsModal'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        modalDownloadBtn: document.getElementById('modalDownloadBtn'),
        googleCalMorningBtn: document.getElementById('googleCalMorningBtn'),
        googleCalEveningBtn: document.getElementById('googleCalEveningBtn'),
        streakModal: document.getElementById('streakModal'),
        closeStreakModalBtn: document.getElementById('closeStreakModalBtn'),
        closeStreakModalTopBtn: document.getElementById('closeStreakModalTopBtn'),
        modalCurrentStreak: document.getElementById('modalCurrentStreak'),
        modalBestStreak: document.getElementById('modalBestStreak'),
        streakWeekRow: document.getElementById('streakWeekRow'),
        streakFreezeBanner: document.getElementById('streakFreezeBanner'),
        streakPillarsHeader: document.getElementById('streakPillarsHeader'),
        streakPillarsStatusNote: document.getElementById('streakPillarsStatusNote'),
        streakPillarsList: document.getElementById('streakPillarsList'),
        // Toggles in settings
        toggleTranslit: document.getElementById('toggleTranslit'),
        toggleTrans: document.getElementById('toggleTrans'),
        toggleVirtues: document.getElementById('toggleVirtues'),
        toggleSoundSetting: document.getElementById('toggleSoundSetting'),
        toggleVibrate: document.getElementById('toggleVibrate'),
        toggleCardTap: document.getElementById('toggleCardTap'),
        toggleFocusTimerBtn: document.getElementById('toggleFocusTimerBtn'),
        toggleFocusTimerKnob: document.getElementById('toggleFocusTimerKnob'),
        toggleRemindersSwitchBtn: document.getElementById('toggleRemindersSwitchBtn'),
        toggleRemindersSwitchKnob: document.getElementById('toggleRemindersSwitchKnob'),
        remindersConfigPanel: document.getElementById('remindersConfigPanel'),
        morningReminderInput: document.getElementById('morningReminderInput'),
        eveningReminderInput: document.getElementById('eveningReminderInput'),
        sleepReminderInput: document.getElementById('sleepReminderInput'),
        morningFormattedTime: document.getElementById('morningFormattedTime'),
        eveningFormattedTime: document.getElementById('eveningFormattedTime'),
        sleepFormattedTime: document.getElementById('sleepFormattedTime'),
        toggleGoalReminderBtn: document.getElementById('toggleGoalReminderBtn'),
        toggleGoalReminderKnob: document.getElementById('toggleGoalReminderKnob'),
        goalReminderTimeBox: document.getElementById('goalReminderTimeBox'),
        goalReminderInput: document.getElementById('goalReminderInput'),
        goalFormattedTime: document.getElementById('goalFormattedTime'),
        sendTestNotificationBtn: document.getElementById('sendTestNotificationBtn'),
        sendTestNotificationLabel: document.getElementById('sendTestNotificationLabel'),
        testCatchUpBtn: document.getElementById('testCatchUpBtn'),
        testNotificationFeedback: document.getElementById('testNotificationFeedback'),
        inAppNotificationToast: document.getElementById('inAppNotificationToast'),
        inAppToastTitle: document.getElementById('inAppToastTitle'),
        inAppToastBody: document.getElementById('inAppToastBody'),
        closeInAppToastBtn: document.getElementById('closeInAppToastBtn'),
        // Tasbih elements
        tasbihArabic: document.getElementById('tasbihArabic'),
        tasbihTranslit: document.getElementById('tasbihTranslit'),
        tasbihTrans: document.getElementById('tasbihTrans'),
        tasbihCurrentCount: document.getElementById('tasbihCurrentCount'),
        tasbihTargetDisplay: document.getElementById('tasbihTargetDisplay'),
        tasbihRingCircle: document.getElementById('tasbihRingCircle'),
        tasbihLargeBtn: document.getElementById('tasbihLargeBtn'),
        tasbihMinusBtn: document.getElementById('tasbihMinusBtn'),
        tasbihResetBtn: document.getElementById('tasbihResetBtn'),
        tasbihChangeTargetBtn: document.getElementById('tasbihChangeTargetBtn')
      };

      // 3. Tab Routing by Time of Day & History API Support
      function getRecommendedTabByHour() {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 20) return 'evening';
        return 'sleep';
      }
      state.activeTab = getRecommendedTabByHour();

      function openCategoryView(tabKey, scrollTargetSelector, fromPopState) {
        stopAutoplayAll();
        state.activeTab = tabKey;
        state.isCategoryOpen = true;
        state.lastSelectedCardId = null;
        if (!fromPopState) {
          try {
            window.history.pushState({ view: 'category', id: tabKey }, '');
          } catch (e) {}
        }
        if (els.categoryGridSection) els.categoryGridSection.classList.add('hidden');
        if (els.categoryDetailView) els.categoryDetailView.classList.remove('hidden');
        updateTabsUI();
        renderCards();
        if (scrollTargetSelector) {
          setTimeout(() => {
            const targetEl = document.querySelector(scrollTargetSelector);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }

      function closeCategoryView(fromPopState) {
        stopAutoplayAll();
        state.isCategoryOpen = false;
        if (els.categoryDetailView) els.categoryDetailView.classList.add('hidden');
        if (els.categoryGridSection) els.categoryGridSection.classList.remove('hidden');
        updateTabsUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!fromPopState) {
          try {
            if (window.history.state && window.history.state.view === 'category') {
              window.history.back();
            }
          } catch (e) {}
        }
      }

      window.addEventListener('popstate', function(event) {
        if (els.streakModal && !els.streakModal.classList.contains('hidden')) {
          closeStreakModal(true);
          return;
        }
        if (event.state && event.state.view === 'category' && event.state.id) {
          openCategoryView(event.state.id, null, true);
        } else {
          closeCategoryView(true);
        }
      });

      window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && els.streakModal && !els.streakModal.classList.contains('hidden')) {
          closeStreakModal();
        }
      });

      // 4. Renderers & 4-Pillar Streak Engine
      function formatDateObjYYYYMMDD(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }

      function getFourPillarsStatus() {
        const mItems = window.ADHKAR_DATA.morning || [];
        const eItems = window.ADHKAR_DATA.evening || [];
        const pItems = window.ADHKAR_DATA.prayer || [];
        const sItems = window.ADHKAR_DATA.sleep || [];

        const mDone = mItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        const eDone = eItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        const pDone = pItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        const sDone = sItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;

        const morningComplete = mItems.length > 0 && mDone === mItems.length;
        const eveningComplete = eItems.length > 0 && eDone === eItems.length;
        const prayerComplete = pItems.length > 0 && pDone === pItems.length;
        const sleepComplete = sItems.length > 0 && sDone === sItems.length;

        const pillars = [
          {
            key: 'morning',
            label: 'Morning • പ്രഭാതം',
            subLabel: 'പ്രഭാത ദിക്റുകൾ',
            completed: morningComplete,
            doneCount: mDone,
            totalCount: mItems.length
          },
          {
            key: 'evening',
            label: 'Evening • പ്രദോഷം',
            subLabel: 'പ്രദോഷ ദിക്റുകൾ',
            completed: eveningComplete,
            doneCount: eDone,
            totalCount: eItems.length
          },
          {
            key: 'prayer',
            label: 'After Prayer • നമസ്കാരം',
            subLabel: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ',
            completed: prayerComplete,
            doneCount: pDone,
            totalCount: pItems.length
          },
          {
            key: 'sleep',
            label: 'Sleep • ഉറക്കം',
            subLabel: 'ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ',
            completed: sleepComplete,
            doneCount: sDone,
            totalCount: sItems.length
          }
        ];

        const completedPillarsCount = pillars.filter(p => p.completed).length;
        const allFourCompleted = completedPillarsCount === 4;

        return {
          pillars: pillars,
          completedPillarsCount: completedPillarsCount,
          allFourCompleted: allFourCompleted
        };
      }

      function recalculateDynamicStreak() {
        const todayStr = getTodayString();
        const pillarStatus = getFourPillarsStatus();
        if (!state.streak.completionTimestamps || typeof state.streak.completionTimestamps !== 'object') {
          state.streak.completionTimestamps = {};
        }

        // Seed legacy streak into completionTimestamps if present
        if (state.streak.lastCompletedDate && state.streak.currentStreak > 0 && Object.keys(state.streak.completionTimestamps).length === 0) {
          const parts = state.streak.lastCompletedDate.split('-').map(Number);
          if (parts.length === 3) {
            const baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
            for (let i = 0; i < state.streak.currentStreak; i++) {
              const d = new Date(baseDate);
              d.setDate(baseDate.getDate() - i);
              const ds = formatDateObjYYYYMMDD(d);
              state.streak.completionTimestamps[ds] = d.getTime();
            }
          }
        }

        if (pillarStatus.allFourCompleted) {
          if (!state.streak.completionTimestamps[todayStr]) {
            state.streak.completionTimestamps[todayStr] = Date.now();
          }
          state.streak.lastCompletedDate = todayStr;
        } else {
          if (state.streak.completionTimestamps[todayStr]) {
            delete state.streak.completionTimestamps[todayStr];
          }
        }

        // Dynamically calculate consecutive streak from completionTimestamps (allowing 1-day Streak Freeze bridge)
        const tsMap = state.streak.completionTimestamps;
        const todayDate = new Date();
        let streakCount = 0;
        let freezeRemaining = 1;
        const activeFrozenDates = [];

        let cursor = new Date(todayDate);
        const todayKey = formatDateObjYYYYMMDD(cursor);
        if (tsMap[todayKey]) {
          streakCount++;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          cursor.setDate(cursor.getDate() - 1);
          const yesterdayKey = formatDateObjYYYYMMDD(cursor);
          if (!tsMap[yesterdayKey]) {
            const twoDaysAgo = new Date(cursor);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
            const twoDaysAgoKey = formatDateObjYYYYMMDD(twoDaysAgo);
            if (freezeRemaining > 0 && tsMap[twoDaysAgoKey]) {
              freezeRemaining--;
              activeFrozenDates.push(yesterdayKey);
              cursor.setDate(cursor.getDate() - 1);
            }
          }
        }

        for (let step = 0; step < 365; step++) {
          const ds = formatDateObjYYYYMMDD(cursor);
          if (tsMap[ds]) {
            streakCount++;
            cursor.setDate(cursor.getDate() - 1);
          } else if (freezeRemaining > 0) {
            const prevDay = new Date(cursor);
            prevDay.setDate(prevDay.getDate() - 1);
            const prevKey = formatDateObjYYYYMMDD(prevDay);
            if (tsMap[prevKey]) {
              freezeRemaining--;
              activeFrozenDates.push(ds);
              cursor.setDate(cursor.getDate() - 1);
            } else {
              break;
            }
          } else {
            break;
          }
        }

        state.streak.currentStreak = streakCount;
        state.streak.bestStreak = Math.max(state.streak.bestStreak || 0, streakCount);
        state.streak.usedFreezeDates = activeFrozenDates;
        saveState();
        return { streakCount: streakCount, pillarStatus: pillarStatus };
      }

      function renderStreakModal() {
        const { streakCount, pillarStatus } = recalculateDynamicStreak();
        if (els.modalCurrentStreak) {
          els.modalCurrentStreak.textContent = String(streakCount);
        }
        if (els.modalBestStreak) {
          els.modalBestStreak.textContent = String(state.streak.bestStreak || 0);
        }

        // Render 7-Day Week Row (Su, Mo, Tu, We, Th, Fr, Sa)
        const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        const now = new Date();
        const todayIdx = now.getDay();
        const tsMap = state.streak.completionTimestamps || {};
        let hasMissedPastDayInWeek = false;

        if (els.streakWeekRow) {
          els.streakWeekRow.innerHTML = WEEKDAY_LABELS.map((dayLabel, idx) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (todayIdx - idx));
            const dateStr = formatDateObjYYYYMMDD(d);
            let status = 'future';
            if (idx === todayIdx) {
              status = pillarStatus.allFourCompleted ? 'completed' : 'today';
            } else if (idx < todayIdx) {
              if (tsMap[dateStr]) {
                status = 'completed';
              } else {
                status = 'missed';
                hasMissedPastDayInWeek = true;
              }
            }

            const labelColor = idx === todayIdx
              ? 'text-orange-600 dark:text-amber-300'
              : status === 'missed'
                ? 'text-cyan-700 dark:text-cyan-300'
                : 'text-slate-500 dark:text-slate-400';

            let badgeHtml = '';
            if (status === 'completed') {
              badgeHtml = \`<div data-testid="streak-day-badge-\${dayLabel}" title="\${dayLabel} (\${dateStr}): Completed ✓" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/35 border border-orange-300">✓</div>\`;
            } else if (status === 'today') {
              badgeHtml = \`<div data-testid="streak-day-badge-\${dayLabel}" title="Today (\${dateStr}): \${pillarStatus.completedPillarsCount}/4 Pillars Completed" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 dark:border-cyan-400 bg-amber-500/15 dark:bg-cyan-500/15 text-amber-800 dark:text-cyan-200 font-extrabold text-[11px] flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.5)] ring-2 ring-amber-400/30 dark:ring-cyan-400/30">\${pillarStatus.completedPillarsCount}/4</div>\`;
            } else if (status === 'missed') {
              badgeHtml = \`<div data-testid="streak-day-badge-\${dayLabel}" title="\${dayLabel} (\${dateStr}): Streak Freeze Protected ❄️" class="streak-freeze-badge w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-100/80 dark:bg-cyan-950/80 border-2 border-cyan-400 text-cyan-700 dark:text-cyan-200 text-sm flex items-center justify-center">❄️</div>\`;
            } else {
              badgeHtml = \`<div data-testid="streak-day-badge-\${dayLabel}" title="\${dayLabel} (\${dateStr}): Upcoming" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/40 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 text-xs flex items-center justify-center">•</div>\`;
            }

            return \`
              <div data-testid="streak-day-col-\${dayLabel}" data-status="\${status}" class="flex flex-col items-center gap-1.5">
                <span class="text-xs font-extrabold \${labelColor}">\${dayLabel}</span>
                \${badgeHtml}
              </div>
            \`;
          }).join('');
        }

        if (els.streakFreezeBanner) {
          const showFreezeBanner = hasMissedPastDayInWeek || (Array.isArray(state.streak.usedFreezeDates) && state.streak.usedFreezeDates.length > 0);
          els.streakFreezeBanner.classList.toggle('hidden', !showFreezeBanner);
        }

        // Render 4-Pillar Daily Qualification Checklist
        if (els.streakPillarsHeader) {
          els.streakPillarsHeader.textContent = 'Today’s 4 Required Adhkar Pillars (' + pillarStatus.completedPillarsCount + '/4)';
        }
        if (els.streakPillarsStatusNote) {
          els.streakPillarsStatusNote.textContent = pillarStatus.allFourCompleted ? '✓ യോഗ്യത നേടി!' : '4 വിഭാഗവും പൂർത്തിയാക്കുക';
        }
        if (els.streakPillarsList) {
          els.streakPillarsList.innerHTML = pillarStatus.pillars.map(p => \`
            <button
              type="button"
              data-streak-pillar-jump="\${p.key}"
              data-testid="streak-pillar-\${p.key}"
              class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all border cursor-pointer active:scale-99 \${
                p.completed
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              }"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 \${
                  p.completed
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'border-2 border-slate-400 dark:border-slate-500 text-slate-400'
                }">\${p.completed ? '✓' : '○'}</span>
                <div class="min-w-0">
                  <div class="text-xs font-extrabold font-malayalam truncate">\${p.label}</div>
                  <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-malayalam truncate">\${p.subLabel}</div>
                </div>
              </div>
              <span class="font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg shrink-0 \${
                p.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }">\${p.doneCount}/\${p.totalCount}</span>
            </button>
          \`).join('');
        }
      }

      function openStreakModal(fromMilestone) {
        renderStreakModal();
        if (els.streakModal) {
          const wasHidden = els.streakModal.classList.contains('hidden');
          els.streakModal.classList.remove('hidden');
          if (wasHidden) {
            try {
              window.history.pushState({ modal: 'streak' }, '');
            } catch (e) {}
          }
        }
      }

      function closeStreakModal(fromPopState) {
        if (!els.streakModal || els.streakModal.classList.contains('hidden')) return;
        els.streakModal.classList.add('hidden');
        if (!fromPopState) {
          try {
            if (window.history.state && window.history.state.modal === 'streak') {
              window.history.back();
            }
          } catch (e) {}
        }
      }

      function getActiveItems() {
        if (state.activeTab === 'morning') return window.ADHKAR_DATA.morning;
        if (state.activeTab === 'evening') return window.ADHKAR_DATA.evening;
        if (state.activeTab === 'prayer') return window.ADHKAR_DATA.prayer;
        if (state.activeTab === 'sleep') return window.ADHKAR_DATA.sleep;
        if (state.activeTab === 'favorites') {
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep,
          ];
          return all.filter(item => state.favorites.includes(item.id));
        }
        return [];
      }

      function updateCategoryProgress() {
        if (state.activeTab === 'tasks') {
          els.headerProgressContainer.classList.remove('hidden');
          const total = state.tasks.length;
          const completed = state.tasks.filter(t => isTaskEffectivelyCompleted(t)).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const isAllDone = total > 0 && completed === total;
          els.progressStatusText.textContent = isAllDone
            ? 'All Daily Tasks Completed! • മാഷാ അല്ലാഹ്! 🌟'
            : 'Progress: ' + completed + ' of ' + total + ' Completed';
          els.progressPercentText.textContent = percent + '%';
          els.progressBarFill.style.width = percent + '%';
          els.progressBarFill.className = 'h-full rounded-full transition-all duration-300 ' +
            (isAllDone ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50' : 'bg-amber-300');
          return;
        }

        const items = getActiveItems();
        if (state.activeTab === 'tasbih' || items.length === 0) {
          els.headerProgressContainer.classList.add('hidden');
          return;
        }
        els.headerProgressContainer.classList.remove('hidden');

        let completed = 0;
        items.forEach(item => {
          if ((state.counts[item.id] || 0) >= item.target) completed++;
        });

        const total = items.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isAllDone = total > 0 && completed === total;

        els.progressStatusText.textContent = isAllDone
          ? 'Completed All Today! • പൂർത്തിയായി! 🔥'
          : 'Progress: ' + completed + ' of ' + total + ' Completed';
        els.progressPercentText.textContent = percent + '%';
        els.progressBarFill.style.width = percent + '%';
        els.progressBarFill.className = 'h-full rounded-full transition-all duration-300 ' + 
          (isAllDone ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50' : 'bg-amber-300');

        if (isAllDone && total > 0) {
          updateStreakOnCategoryDone();
        }
      }

      const CATEGORY_COMPLETION_TITLES = {
        morning: 'പ്രഭാത ദിക്റുകൾ പൂർത്തിയായി!',
        evening: 'പ്രദോഷ ദിക്റുകൾ പൂർത്തിയായി!',
        prayer: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ പൂർത്തിയായി!',
        sleep: 'ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ പൂർത്തിയായി!',
        tasks: 'പ്രതിദിന കർമ്മങ്ങൾ പൂർത്തിയായി!',
        favorites: 'പ്രിയപ്പെട്ട ദിക്റുകൾ പൂർത്തിയായി!'
      };

      let completionOverlayFadeTimer = null;
      let completionOverlayHideTimer = null;

      function dismissCompletionOverlay(immediate) {
        if (!els.completionOverlay) return;
        if (completionOverlayFadeTimer) {
          clearTimeout(completionOverlayFadeTimer);
          completionOverlayFadeTimer = null;
        }
        if (completionOverlayHideTimer) {
          clearTimeout(completionOverlayHideTimer);
          completionOverlayHideTimer = null;
        }
        if (immediate) {
          els.completionOverlay.classList.add('hidden');
          els.completionOverlay.classList.remove('overlay-fading-out');
        } else {
          els.completionOverlay.classList.add('overlay-fading-out');
          completionOverlayHideTimer = setTimeout(function() {
            if (els.completionOverlay) {
              els.completionOverlay.classList.add('hidden');
              els.completionOverlay.classList.remove('overlay-fading-out');
            }
          }, 300);
        }
      }

      function triggerCompletionOverlay(categoryKey) {
        if (!els.completionOverlay) return;
        const catKey = categoryKey || state.activeTab || 'morning';
        const dynamicMlTitle = CATEGORY_COMPLETION_TITLES[catKey] || CATEGORY_COMPLETION_TITLES.morning;
        if (els.completionDynamicCategoryText) {
          els.completionDynamicCategoryText.textContent = dynamicMlTitle;
        }
        if (els.completionFixedSubtitle) {
          els.completionFixedSubtitle.textContent = 'വിഭാഗം പൂർത്തിയായി! • Category Completed!';
        }

        playCompletionChime();
        triggerVibration([60, 40, 60]);

        if (completionOverlayFadeTimer) {
          clearTimeout(completionOverlayFadeTimer);
          completionOverlayFadeTimer = null;
        }
        if (completionOverlayHideTimer) {
          clearTimeout(completionOverlayHideTimer);
          completionOverlayHideTimer = null;
        }
        els.completionOverlay.classList.remove('hidden', 'overlay-fading-out');
        const animatedNodes = els.completionOverlay.querySelectorAll('.completion-free-flame, .completion-gold-particle, .completion-free-text-enter');
        animatedNodes.forEach(function(node) {
          node.style.animation = 'none';
          void node.offsetWidth;
          node.style.animation = '';
        });

        // Smooth fade-out and auto-dismiss after 2 seconds (2000ms)
        completionOverlayFadeTimer = setTimeout(function() {
          if (els.completionOverlay) {
            els.completionOverlay.classList.add('overlay-fading-out');
          }
        }, 1700);
        completionOverlayHideTimer = setTimeout(function() {
          if (els.completionOverlay) {
            els.completionOverlay.classList.add('hidden');
            els.completionOverlay.classList.remove('overlay-fading-out');
          }
        }, 2000);
      }

      function updateStreakOnCategoryDone() {
        recalculateDynamicStreak();
        renderStreakBadge();
      }

      function renderStreakBadge() {
        const { streakCount, pillarStatus } = recalculateDynamicStreak();
        const doneToday = pillarStatus.allFourCompleted;
        els.streakCount.textContent = (streakCount || 0) + 'd';
        if (doneToday) {
          els.streakBtn.className = 'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition-all border cursor-pointer active:scale-95 bg-amber-400 text-[#064e3b] border-amber-300 shadow-sm';
        } else {
          els.streakBtn.className = 'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold transition-all border cursor-pointer active:scale-95 bg-white/15 text-white border-white/25 hover:bg-white/25';
        }
      }

      function updateTheme(theme) {
        state.settings.theme = theme;
        saveState();
        document.documentElement.className = theme === 'midnight' ? 'theme-midnight dark' : (theme === 'dark' ? 'theme-dark dark' : 'theme-emerald');
        els.themeIcon.textContent = theme === 'emerald' ? '🌙' : '☀️';
        
        document.querySelectorAll('.theme-choice').forEach(b => {
          if (b.dataset.theme === theme) {
            b.className = 'theme-choice py-2 px-3 rounded-xl border border-[#0d5c3a] bg-emerald-50 text-[#064e3b] font-semibold text-xs ring-2 ring-[#0d5c3a]/20';
          } else {
            b.className = 'theme-choice py-2 px-3 rounded-xl border border-slate-200 text-xs';
          }
        });
      }

      function updateTabsUI() {
        syncAdhkarCompletionToTasks();

        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
          const t = tab.dataset.tab;
          if (t === state.activeTab) {
            tab.className = 'tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#064e3b] dark:bg-[#064e3b] text-white ring-2 ring-emerald-300 shadow-md flex flex-col justify-between min-h-[104px] overflow-hidden';
          } else {
            tab.className = 'tab-btn group relative rounded-2xl p-3.5 text-left transition-all cursor-pointer active:scale-95 bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#0d5c3a] text-white shadow-sm flex flex-col justify-between min-h-[104px] overflow-hidden';
          }
        });

        const mItems = window.ADHKAR_DATA.morning;
        let mDone = mItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="morning"] .tab-badge').textContent = (mDone === mItems.length && mItems.length > 0 ? '🔥 ' : '') + mDone + '/' + mItems.length + (mDone === mItems.length && mItems.length > 0 ? ' പൂർത്തിയായി!' : '');

        const eItems = window.ADHKAR_DATA.evening;
        let eDone = eItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="evening"] .tab-badge').textContent = (eDone === eItems.length && eItems.length > 0 ? '🔥 ' : '') + eDone + '/' + eItems.length + (eDone === eItems.length && eItems.length > 0 ? ' പൂർത്തിയായി!' : '');

        const pItems = window.ADHKAR_DATA.prayer;
        let pDone = pItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="prayer"] .tab-badge').textContent = (pDone === pItems.length && pItems.length > 0 ? '🔥 ' : '') + pDone + '/' + pItems.length + (pDone === pItems.length && pItems.length > 0 ? ' പൂർത്തിയായി!' : '');

        const sItems = window.ADHKAR_DATA.sleep;
        let sDone = sItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="sleep"] .tab-badge').textContent = (sDone === sItems.length && sItems.length > 0 ? '🔥 ' : '') + sDone + '/' + sItems.length + (sDone === sItems.length && sItems.length > 0 ? ' പൂർത്തിയായി!' : '');

        const tTotal = state.tasks.length;
        const tDone = state.tasks.filter(t => isTaskEffectivelyCompleted(t)).length;
        const tasksBadge = document.querySelector('[data-tab="tasks"] .tab-badge');
        if (tasksBadge) {
          tasksBadge.textContent = (tDone === tTotal && tTotal > 0 ? '🔥 ' : '') + tDone + '/' + tTotal;
        }

        document.querySelector('[data-tab="favorites"] .tab-badge').textContent = state.favorites.length;

        // Time-Based Recommendation Banner (displayed ONLY once on the home overview grid)
        const recTab = getRecommendedTabByHour();
        const RECOMMENDATION_INFO = {
          morning: { num: '☀️ TIME-BASED RECOMMENDATION', ar: 'أذكار الصباح', title: 'Morning • പ്രഭാത ദിക്റുകൾ', sub: mDone + '/' + mItems.length + ' Completed • Best recited Fajr to Sunrise' },
          evening: { num: '🌙 TIME-BASED RECOMMENDATION', ar: 'أذكار المساء', title: 'Evening • പ്രദോഷ ദിക്റുകൾ', sub: eDone + '/' + eItems.length + ' Completed • Best recited Asr to Maghrib' },
          sleep: { num: '🌌 TIME-BASED RECOMMENDATION', ar: 'أذكار النوم', title: 'Sleep • ഉറങ്ങാൻ നേരം', sub: sDone + '/' + sItems.length + ' Completed • Recite before sleeping for protection' }
        };
        const feat = RECOMMENDATION_INFO[recTab] || RECOMMENDATION_INFO.morning;
        const featNumEl = document.getElementById('featuredBadgeNum');
        const featArEl = document.getElementById('featuredArabicTitle');
        const featTitleEl = document.getElementById('featuredMainTitle');
        const featSubEl = document.getElementById('featuredSubText');
        if (featNumEl) featNumEl.textContent = feat.num;
        if (featArEl) featArEl.textContent = feat.ar;
        if (featTitleEl) featTitleEl.textContent = feat.title;
        if (featSubEl) featSubEl.textContent = feat.sub;

        const OPENED_META = {
          morning: { title: 'Morning • പ്രഭാത ദിക്റുകൾ', ar: 'أذكار الصباح' },
          evening: { title: 'Evening • പ്രദോഷ ദിക്റുകൾ', ar: 'أذكار المساء' },
          prayer: { title: 'After Prayer • നമസ്കാര ശേഷം', ar: 'أذكار بعد الصلاة' },
          sleep: { title: 'Sleep • ഉറങ്ങാൻ നേരം', ar: 'أذكار النوم' },
          tasks: { title: 'Daily Tasks • പ്രതിദിന കർമ്മങ്ങൾ', ar: 'المهام اليومية والسنن' },
          favorites: { title: 'Favorites • പ്രിയപ്പെട്ട ദിക്റുകൾ', ar: 'الأذكار المفضلة' },
          tasbih: { title: 'Digital Tasbih • തസ്ബീഹ് കൗണ്ടർ', ar: 'التسبيح الرقمي' },
          progress: { title: 'Progress • പുരോഗതി വിലയിരുത്തൽ', ar: 'التقييم والإحصائيات' }
        };
        const openedInfo = OPENED_META[state.activeTab] || OPENED_META.morning;
        if (els.openedCategoryTitle) els.openedCategoryTitle.textContent = openedInfo.title;
        if (els.openedCategoryArabic) els.openedCategoryArabic.textContent = openedInfo.ar;

        const catConfig = window.ADHKAR_DATA.categories.find(c => c.key === state.activeTab);
        if (catConfig) {
          els.headerCategoryLabel.textContent = catConfig.label;
          els.headerCategoryArabic.textContent = catConfig.arabicLabel;
          els.headerTimeHint.textContent = catConfig.timeHint;
        } else if (state.activeTab === 'tasks') {
          els.headerCategoryLabel.textContent = 'Daily Tasks';
          els.headerCategoryArabic.textContent = 'المهام اليومية والسنن';
          els.headerTimeHint.textContent = 'Track your daily prayers, sunnah rawatib, adhkar & good deeds';
        } else if (state.activeTab === 'favorites') {
          els.headerCategoryLabel.textContent = 'Favorites';
          els.headerCategoryArabic.textContent = 'الأذكار المفضلة';
          els.headerTimeHint.textContent = 'Your starred supplications for quick access';
        } else if (state.activeTab === 'progress') {
          els.headerCategoryLabel.textContent = 'Progress Tracker';
          els.headerCategoryArabic.textContent = 'التقييم والإحصائيات';
          els.headerTimeHint.textContent = 'Weekly & monthly adhkar and daily tasks consistency';
        }
      }

      const SHORT_DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Compute 7-Day (Weekly) or 30-Day (Monthly) Audit Report
      function buildTaskAuditReport(daysCount) {
        const todayStr = getTodayString();
        const todayDate = new Date();
        const dateItems = [];
        for (let i = daysCount - 1; i >= 0; i--) {
          const d = new Date(todayDate);
          d.setDate(d.getDate() - i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const dateStr = y + '-' + m + '-' + day;
          dateItems.push({
            dateStr: dateStr,
            shortLabel: SHORT_MONTH_NAMES[d.getMonth()] + ' ' + d.getDate(),
            dayOfWeek: SHORT_DAY_NAMES[d.getDay()],
            isToday: i === 0
          });
        }

        const items = state.tasks.map(task => {
          const todayStats = getTaskPortionStats(task);
          const hasPortions = todayStats.hasPortions;
          const unit = todayStats.unit;
          const singleDayPortions = hasPortions ? todayStats.totalPortions : 1;

          const dailyHistory = dateItems.map(item => {
            const dateStr = item.dateStr;
            const isToday = item.isToday;
            let percent = 0;
            let completedPortions = 0;
            const totalPortions = singleDayPortions;

            if (isToday) {
              percent = todayStats.percent;
              completedPortions = hasPortions ? todayStats.completedPortions : (todayStats.isComplete ? 1 : 0);
            } else {
              const entry = state.tasksHistory[dateStr];
              if (entry) {
                if (hasPortions && typeof entry[task.id + '_portion'] === 'number') {
                  completedPortions = Number(entry[task.id + '_portion']);
                  percent = typeof entry[task.id + '_percent'] === 'number'
                    ? Number(entry[task.id + '_percent'])
                    : (totalPortions > 0 ? Math.min(100, Math.round((completedPortions / totalPortions) * 100)) : 0);
                } else if (entry[task.id] === true || (Array.isArray(entry.completedTaskIds) && entry.completedTaskIds.includes(task.id))) {
                  completedPortions = totalPortions;
                  percent = 100;
                } else {
                  completedPortions = 0;
                  percent = 0;
                }
              }
            }

            const completed = percent === 100;
            const status = percent === 100 ? 'completed' : (percent > 0 ? 'partial' : 'missed');
            return {
              date: dateStr,
              shortLabel: item.shortLabel,
              dayOfWeek: item.dayOfWeek,
              isToday: isToday,
              completed: completed,
              status: status,
              percent: percent,
              completedPortions: completedPortions,
              totalPortions: totalPortions
            };
          });

          const completedDays = dailyHistory.filter(d => d.status === 'completed').length;
          const partialDays = dailyHistory.filter(d => d.status === 'partial').length;
          const missedDays = dailyHistory.filter(d => d.status === 'missed').length;

          let percentage;
          let ratioLabel;
          let totalPortionsCompleted;
          let totalPortionsPossible;

          if (hasPortions) {
            totalPortionsCompleted = dailyHistory.reduce((acc, d) => acc + d.completedPortions, 0);
            totalPortionsPossible = daysCount * singleDayPortions;
            percentage = totalPortionsPossible > 0 ? Math.round((totalPortionsCompleted / totalPortionsPossible) * 100) : 0;
            ratioLabel = totalPortionsCompleted + '/' + totalPortionsPossible + ' ' + unit;
          } else {
            totalPortionsCompleted = completedDays;
            totalPortionsPossible = daysCount;
            percentage = Math.round((completedDays / daysCount) * 100);
            ratioLabel = completedDays + '/' + daysCount + ' days';
          }

          return {
            task: task,
            completedDays: completedDays,
            partialDays: partialDays,
            missedDays: missedDays,
            totalDays: daysCount,
            percentage: percentage,
            ratioLabel: ratioLabel,
            hasPortions: hasPortions,
            unit: unit,
            dailyHistory: dailyHistory
          };
        });

        let mostCompletedTask = null;
        let mostSkippedTask = null;
        if (items.length > 0) {
          const sortedByCompleted = [...items].sort((a, b) => {
            if (b.percentage !== a.percentage) return b.percentage - a.percentage;
            return b.completedDays - a.completedDays;
          });
          mostCompletedTask = sortedByCompleted[0];

          const sortedByMissed = [...items].sort((a, b) => {
            if (a.percentage !== b.percentage) return a.percentage - b.percentage;
            return a.completedDays - b.completedDays;
          });
          mostSkippedTask = sortedByMissed.find(i => i.task.id !== mostCompletedTask?.task.id) || sortedByMissed[0];
        }

        return {
          daysCount: daysCount,
          items: items,
          mostCompletedTask: mostCompletedTask,
          mostSkippedTask: mostSkippedTask
        };
      }

      function renderTasksView() {
        syncAdhkarCompletionToTasks();
        saveTasksState();

        const total = state.tasks.length;
        const completed = state.tasks.filter(t => isTaskEffectivelyCompleted(t)).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const isAllDone = total > 0 && completed === total;

        els.tasksProgressText.textContent = isAllDone
          ? 'All Daily Tasks Completed! • മാഷാ അല്ലാഹ്! എല്ലാം പൂർത്തിയായി 🌟'
          : 'Today’s Consistency: ' + completed + ' of ' + total + ' (' + percent + '%)';
        els.tasksPercentText.textContent = percent + '%';
        els.tasksProgressBarFill.style.width = percent + '%';
        els.tasksProgressBarFill.className = 'h-full rounded-full transition-all duration-500 ' +
          (isAllDone ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-300');

        // Filter tasks for checklist
        const q = state.taskSearchQuery.trim().toLowerCase();
        const filteredTasks = state.tasks.filter(task => {
          const taskDone = isTaskEffectivelyCompleted(task);
          if (state.taskCategoryFilter !== 'all' && task.category !== state.taskCategoryFilter) return false;
          if (state.taskStatusFilter === 'completed' && !taskDone) return false;
          if (state.taskStatusFilter === 'remaining' && taskDone) return false;
          if (!q) return true;
          return (
            (task.title && task.title.toLowerCase().includes(q)) ||
            (task.malayalamTitle && task.malayalamTitle.toLowerCase().includes(q)) ||
            (task.arabicTitle && task.arabicTitle.toLowerCase().includes(q)) ||
            (task.description && task.description.toLowerCase().includes(q))
          );
        });

        if (filteredTasks.length === 0) {
          els.dailyTasksList.innerHTML = '<div class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2"><div class="text-3xl">📋</div><h3 class="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Matching Tasks</h3><p class="text-xs text-slate-500">Try switching the category filter or clearing your search query.</p></div>';
        } else {
          els.dailyTasksList.innerHTML = filteredTasks.map(task => {
            const catMeta = TASK_CATEGORY_BADGES[task.category] || TASK_CATEGORY_BADGES.custom;
            const hasSubtasks = Array.isArray(task.subtasks) && task.subtasks.length > 0;
            const subtasksDone = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;
            const subtasksTotal = hasSubtasks ? task.subtasks.length : 0;
            const isVirtueOpen = state.expandedTaskVirtueId === task.id;
            const portionStats = getTaskPortionStats(task);

            return \`
              <article data-testid="task-card-\${task.id}" class="rounded-3xl p-4 sm:p-5 border transition-all duration-200 shadow-xs \${
                portionStats.isComplete
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-500/80 dark:border-emerald-700/70'
                  : portionStats.isPartial
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-400/80 dark:border-amber-700/60'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'
              }">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      data-toggle-task="\${task.id}"
                      data-testid="toggle-task-\${task.id}"
                      aria-label="Toggle \${task.title}"
                      class="mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center font-black text-sm transition-all cursor-pointer shrink-0 active:scale-90 \${
                        portionStats.isComplete
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                          : portionStats.isPartial
                          ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-800 dark:text-amber-300 font-mono text-[9px] font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-transparent border-2 border-slate-400 dark:border-slate-600 hover:border-teal-600'
                      }"
                    >
                      \${portionStats.isComplete ? '✓' : portionStats.isPartial ? portionStats.percent + '%' : '✓'}
                    </button>

                    <div class="flex-1 min-w-0 space-y-1">
                      <div class="flex flex-wrap items-center gap-1.5">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border \${catMeta.colorClass}">
                          <span>\${catMeta.icon}</span>
                          <span>\${catMeta.label}</span>
                        </span>
                        \${task.targetTimeHint ? \`
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            ⏰ \${task.targetTimeHint}
                          </span>
                        \` : ''}
                        \${portionStats.hasPortions ? \`
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold \${
                            portionStats.isComplete
                              ? 'bg-emerald-700 text-white'
                              : portionStats.isPartial
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }">
                            \${portionStats.percent}% (\${portionStats.completedPortions}/\${portionStats.totalPortions} \${portionStats.unit})
                          </span>
                        \` : (hasSubtasks ? \`
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold \${
                            subtasksDone === subtasksTotal
                              ? 'bg-emerald-700 text-white'
                              : 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300'
                          }">
                            \${subtasksDone}/\${subtasksTotal} Steps
                          </span>
                        \` : '')}
                      </div>

                      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 class="text-sm sm:text-base font-extrabold leading-snug \${
                          portionStats.isComplete
                            ? 'line-through text-emerald-900 dark:text-emerald-300 opacity-85'
                            : 'text-slate-900 dark:text-white'
                        }">
                          \${task.title}
                        </h3>
                        \${task.arabicTitle ? \`
                          <span class="font-arabic text-base sm:text-lg font-bold text-teal-900 dark:text-teal-300 shrink-0" dir="rtl">
                            \${task.arabicTitle}
                          </span>
                        \` : ''}
                      </div>

                      \${portionStats.hasPortions ? \`
                        <div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div
                            class="h-full rounded-full transition-all duration-300 \${
                              portionStats.isComplete
                                ? 'bg-emerald-600'
                                : portionStats.isPartial
                                ? 'bg-amber-500'
                                : 'bg-transparent'
                            }"
                            style="width: \${portionStats.percent}%"
                          ></div>
                        </div>
                      \` : ''}

                      \${task.malayalamTitle ? \`
                        <p class="font-malayalam text-xs sm:text-sm font-bold text-teal-950 dark:text-teal-200">
                          \${task.malayalamTitle}
                        </p>
                      \` : ''}

                      \${task.description ? \`
                        <p class="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          \${task.description}
                        </p>
                      \` : ''}
                    </div>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    \${(task.virtue || task.malayalamVirtue || task.source) ? \`
                      <button
                        type="button"
                        data-toggle-virtue="\${task.id}"
                        title="View Hadith Virtue & Reward"
                        class="px-2 py-1 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer \${
                          isVirtueOpen
                            ? 'bg-teal-800 text-white border-teal-800'
                            : 'bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-300 border-teal-300 dark:border-slate-700 hover:bg-teal-100'
                        }"
                      >
                        📖 Virtue
                      </button>
                    \` : ''}

                    \${task.isCustom ? \`
                      <button
                        type="button"
                        data-delete-task="\${task.id}"
                        title="Delete Custom Task"
                        class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-bold cursor-pointer"
                      >
                        🗑️
                      </button>
                    \` : ''}
                  </div>
                </div>

                \${hasSubtasks ? \`
                  <div class="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    \${task.subtasks.map(sub => \`
                      <button
                        type="button"
                        data-toggle-subtask="\${task.id}"
                        data-subtask-id="\${sub.id}"
                        data-testid="subtask-\${task.id}-\${sub.id}"
                        class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer active:scale-98 \${
                          sub.completed
                            ? 'bg-emerald-600/15 dark:bg-emerald-950/50 border-emerald-500/70 text-emerald-950 dark:text-emerald-200 font-extrabold'
                            : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 font-bold hover:border-teal-500'
                        }"
                      >
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 \${
                            sub.completed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-600 text-transparent'
                          }">
                            ✓
                          </span>
                          <div class="truncate">
                            <div class="text-xs truncate">\${sub.label}</div>
                            \${sub.malayalamLabel ? \`<div class="text-[10px] font-malayalam text-slate-500 dark:text-slate-400 truncate">\${sub.malayalamLabel}</div>\` : ''}
                          </div>
                        </div>
                        \${sub.arabicLabel ? \`<span class="font-arabic text-xs font-bold text-teal-800 dark:text-teal-300 shrink-0" dir="rtl">\${sub.arabicLabel}</span>\` : ''}
                      </button>
                    \`).join('')}
                  </div>
                \` : ''}

                \${isVirtueOpen && (task.virtue || task.malayalamVirtue || task.source) ? \`
                  <div class="mt-3 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-1.5 text-xs animate-fade-in">
                    \${task.source ? \`<div class="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1"><span>📜</span><span>Reference: \${task.source}</span></div>\` : ''}
                    \${task.virtue ? \`<p class="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">\${task.virtue}</p>\` : ''}
                    \${task.malayalamVirtue ? \`<p class="font-malayalam text-teal-950 dark:text-emerald-200 font-bold leading-relaxed pt-1 border-t border-amber-200/70 dark:border-amber-800/40">\${task.malayalamVirtue}</p>\` : ''}
                  </div>
                \` : ''}
              </article>
            \`;
          }).join('');
        }

        updateCategoryProgress();
      }

      function renderProgressView() {
        syncAdhkarCompletionToTasks();
        saveTasksState();

        // Update 4 KPI Summary Stats
        const totalRecsToday = Object.values(state.counts).reduce((acc, v) => acc + (Number(v) || 0), 0) +
          state.tasks.filter(t => isTaskEffectivelyCompleted(t)).length +
          (Number(state.tasbih.count) || 0);
        const historyKeys = Object.keys(state.tasksHistory || {});
        const activeDaysCount = Math.max(1, historyKeys.filter(k => {
          const rec = state.tasksHistory[k];
          return rec && (rec.completedCount > 0 || rec.percentage > 0);
        }).length || (totalRecsToday > 0 ? 1 : 0));

        if (els.statTotalRecitations) els.statTotalRecitations.textContent = String(totalRecsToday);
        if (els.statActiveDays) els.statActiveDays.textContent = String(activeDaysCount);
        if (els.statBestStreak) els.statBestStreak.textContent = (state.streak.bestStreak || 0) + ' days';
        if (els.statCurrentStreak) els.statCurrentStreak.textContent = (state.streak.currentStreak || 0) + ' days';
        if (els.progressStreakPill) els.progressStreakPill.textContent = '🔥 ' + (state.streak.currentStreak || 0) + ' Day Streak';

        // Render 7-Day Weekly Tracker Grid
        const weekReportForTop = buildTaskAuditReport(7);
        const todayDate = new Date();
        const sevenDays = [];
        let sumDayPct = 0;
        for (let i = 6; i >= 0; i--) {
          const d = new Date(todayDate);
          d.setDate(d.getDate() - i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dayNum = String(d.getDate()).padStart(2, '0');
          const dateStr = y + '-' + m + '-' + dayNum;
          const isToday = i === 0;
          let pct = 0;
          if (isToday) {
            const totalT = state.tasks.length;
            const doneT = state.tasks.filter(t => isTaskEffectivelyCompleted(t)).length;
            pct = totalT > 0 ? Math.round((doneT / totalT) * 100) : 0;
          } else if (state.tasksHistory[dateStr] && typeof state.tasksHistory[dateStr].percentage === 'number') {
            pct = Number(state.tasksHistory[dateStr].percentage);
          }
          sumDayPct += pct;
          sevenDays.push({
            dateStr: dateStr,
            dayName: SHORT_DAY_NAMES[d.getDay()],
            dayNumber: d.getDate(),
            pct: pct,
            isToday: isToday
          });
        }
        const weeklyAvg = Math.round(sumDayPct / 7);
        if (els.weeklyAdhkarAvgBadge) {
          els.weeklyAdhkarAvgBadge.textContent = 'Weekly Avg: ' + weeklyAvg + '%';
        }
        if (els.weeklyAdhkarTrackerGrid) {
          els.weeklyAdhkarTrackerGrid.innerHTML = sevenDays.map(d => \`
            <div class="flex flex-col items-center justify-between py-2 px-1 rounded-xl border \${
              d.isToday
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-[#0d5c3a] ring-1 ring-[#0d5c3a]'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
            }">
              <span class="text-[10px] font-extrabold text-slate-600 dark:text-slate-400">\${d.dayName}</span>
              <div class="my-1.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black \${
                d.pct === 100
                  ? 'bg-emerald-600 text-white'
                  : d.pct > 0
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }">
                \${d.pct === 100 ? '✓' : d.pct + '%'}
              </div>
              <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">\${d.dayNumber}</span>
            </div>
          \`).join('');
        }

        // Render Weekly & Monthly Task Audit (ടാസ്ക് പുരോഗതി)
        const periodDays = state.auditPeriod === 'week' ? 7 : 30;
        const auditReport = periodDays === 7 ? weekReportForTop : buildTaskAuditReport(periodDays);

        // Update Period Switcher Buttons
        if (state.auditPeriod === 'week') {
          els.auditPeriodWeekBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-[#0d5c3a] text-white shadow-xs';
          els.auditPeriodMonthBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white';
        } else {
          els.auditPeriodMonthBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-[#0d5c3a] text-white shadow-xs';
          els.auditPeriodWeekBtn.className = 'px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white';
        }

        // Update Encouraging Summary Note
        if (auditReport.mostCompletedTask) {
          const mc = auditReport.mostCompletedTask;
          els.mostCompletedTaskNote.textContent = (mc.task.malayalamTitle || mc.task.title) + ' (' + mc.task.title + ') — ' + mc.ratioLabel + ' (' + mc.percentage + '%)';
        }
        if (auditReport.mostSkippedTask) {
          const ms = auditReport.mostSkippedTask;
          els.mostSkippedTaskNote.textContent = (ms.task.malayalamTitle || ms.task.title) + ' (' + ms.task.title + ') — ' + ms.ratioLabel + ' (' + ms.percentage + '%)';
        }

        // Compute counts for All / Completed / Missed filter chips
        const completedAuditItems = auditReport.items.filter(item => item.percentage === 100 || (item.completedDays > 0 && isTaskEffectivelyCompleted(item.task)) || item.percentage > 0);
        const missedAuditItems = auditReport.items.filter(item => item.percentage < 100 || (item.missedDays > 0 && !isTaskEffectivelyCompleted(item.task)));

        els.auditCountAll.textContent = String(auditReport.items.length);
        els.auditCountCompleted.textContent = String(completedAuditItems.length);
        els.auditCountMissed.textContent = String(missedAuditItems.length);

        document.querySelectorAll('.audit-filter-chip').forEach(btn => {
          const f = btn.dataset.auditFilter;
          if (f === state.auditFilter) {
            if (f === 'all') {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-[#0d5c3a] text-white border-[#0d5c3a] shadow-xs';
            } else if (f === 'completed') {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-emerald-700 text-white border-emerald-700 shadow-xs';
            } else {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-rose-700 text-white border-rose-700 shadow-xs';
            }
          } else {
            if (f === 'all') {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100';
            } else if (f === 'completed') {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50';
            } else {
              btn.className = 'audit-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-50';
            }
          }
        });

        const visibleAuditItems = auditReport.items.filter(item => {
          const taskDone = isTaskEffectivelyCompleted(item.task);
          if (state.auditFilter === 'completed') return item.percentage === 100 || (item.completedDays > 0 && taskDone) || item.percentage > 0;
          if (state.auditFilter === 'missed') return item.percentage < 100 || (item.missedDays > 0 && !taskDone);
          return true;
        });

        if (visibleAuditItems.length === 0) {
          els.auditItemizedList.innerHTML = '<div class="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-5 text-center text-xs font-bold text-slate-500">' +
            (state.auditFilter === 'completed'
              ? 'No completed tasks recorded in this period yet. Check off tasks above to build your record! (പൂർത്തിയായ ടാസ്കുകൾ നിലവിലില്ല)'
              : 'Alhamdulillah! No missed tasks in this filter. (വിട്ടുപോയ ടാസ്കുകൾ ഇല്ല)') +
            '</div>';
        } else {
          els.auditItemizedList.innerHTML = visibleAuditItems.map(item => {
            const catMeta = TASK_CATEGORY_BADGES[item.task.category] || TASK_CATEGORY_BADGES.custom;
            const hasSubtasks = Array.isArray(item.task.subtasks) && item.task.subtasks.length > 0;
            const subtasksDone = hasSubtasks ? item.task.subtasks.filter(s => s.completed).length : 0;
            const subtasksTotal = hasSubtasks ? item.task.subtasks.length : 0;

            const dotsHtml = state.auditPeriod === 'week'
              ? \`<div class="grid grid-cols-7 gap-1.5 w-full">\` + item.dailyHistory.map(day => \`
                  <button
                    type="button"
                    data-toggle-audit-day="\${item.task.id}"
                    data-audit-date="\${day.date}"
                    data-testid="audit-day-pill-\${item.task.id}-\${day.date}"
                    data-status="\${day.status}"
                    title="\${day.shortLabel} (\${day.dayOfWeek}): \${day.status === 'completed' ? '🟢 Completed (Tap to toggle)' : day.status === 'partial' ? '🟡 Partial ' + day.percent + '% (Tap to toggle)' : '🔴 Missed (Tap to toggle)'}"
                    class="flex flex-col items-center justify-center py-1 px-1 rounded-xl border text-[10px] font-extrabold transition-all cursor-pointer active:scale-95 \${
                      day.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-600 dark:border-emerald-500/80 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-200'
                        : day.status === 'partial'
                          ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-600 dark:border-amber-500/80 text-amber-950 dark:text-amber-200 hover:bg-amber-200'
                          : 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-700/80 text-rose-950 dark:text-rose-200 hover:bg-rose-100'
                    } \${day.isToday ? 'ring-2 ring-teal-500' : ''}"
                  >
                    <span class="text-[9px] uppercase tracking-tight font-mono">\${day.dayOfWeek}</span>
                    <span class="w-4 h-4 rounded-full mt-0.5 flex items-center justify-center text-[9px] font-black text-white \${
                      day.status === 'completed' ? 'bg-emerald-500' : day.status === 'partial' ? 'bg-amber-500' : 'bg-rose-500'
                    }">\${day.status === 'completed' ? '✓' : day.status === 'partial' ? '~' : '✕'}</span>
                  </button>
                \`).join('') + \`</div>\`
              : \`<div class="flex flex-wrap items-center gap-1 w-full">\` + item.dailyHistory.map(day => \`
                  <button
                    type="button"
                    data-toggle-audit-day="\${item.task.id}"
                    data-audit-date="\${day.date}"
                    data-testid="audit-day-pill-\${item.task.id}-\${day.date}"
                    data-status="\${day.status}"
                    title="\${day.shortLabel} (\${day.dayOfWeek}): \${day.status === 'completed' ? '🟢 Completed' : day.status === 'partial' ? '🟡 Partial ' + day.percent + '%' : '🔴 Missed'} (Tap to toggle)"
                    class="w-4 h-4 text-[8px] rounded-full flex items-center justify-center font-black transition-transform hover:scale-125 cursor-pointer active:scale-90 \${
                      day.status === 'completed'
                        ? 'bg-emerald-500 text-white shadow-2xs ring-1 ring-emerald-600/40'
                        : day.status === 'partial'
                          ? 'bg-amber-500 text-white shadow-2xs ring-1 ring-amber-600/40'
                          : 'bg-rose-500/85 text-white ring-1 ring-rose-600/40'
                    } \${day.isToday ? 'ring-2 ring-teal-500' : ''}"
                  ></button>
                \`).join('') + \`</div>\`;

            return \`
              <div
                data-testid="audit-task-row-\${item.task.id}"
                class="rounded-2xl p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col gap-2"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 \${catMeta.colorClass}">
                      <span>\${catMeta.icon}</span>
                      <span>\${catMeta.label}</span>
                    </span>
                    <div class="min-w-0">
                      <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        \${item.task.title}
                      </div>
                      \${item.task.malayalamTitle ? \`
                        <div class="text-[11px] font-malayalam font-bold text-teal-900 dark:text-teal-300 truncate">
                          \${item.task.malayalamTitle}
                        </div>
                      \` : ''}
                    </div>
                  </div>

                  <!-- Completion Ratio Badge -->
                  <div class="flex items-center gap-2 shrink-0">
                    \${hasSubtasks ? \`
                      <span class="px-2 py-1 rounded-xl text-[11px] font-extrabold border \${
                        subtasksDone > 0
                          ? 'bg-teal-100 text-teal-900 border-teal-400 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }">
                        Today: \${subtasksDone}/\${subtasksTotal}
                      </span>
                    \` : ''}
                    <span
                      data-testid="audit-ratio-\${item.task.id}"
                      class="px-2.5 py-1 rounded-xl text-xs font-extrabold border \${
                        item.percentage === 100
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700'
                          : item.percentage > 0
                            ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700'
                            : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800'
                      }"
                    >
                      \${item.ratioLabel} (\${item.percentage}%)
                    </span>
                  </div>
                </div>

                \${hasSubtasks ? \`
                  <div class="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/50">
                    <span class="text-[10px] font-extrabold text-teal-900 dark:text-teal-300 mr-1">Quick Toggle:</span>
                    \${item.task.subtasks.map(sub => \`
                      <button
                        type="button"
                        data-toggle-subtask="\${item.task.id}"
                        data-subtask-id="\${sub.id}"
                        data-testid="audit-subtask-\${item.task.id}-\${sub.id}"
                        class="px-2 py-0.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer active:scale-95 \${
                          sub.completed
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-teal-500'
                        }"
                      >
                        <span>\${sub.completed ? '✓' : '○'}</span>
                        <span>\${sub.malayalamLabel || sub.label}</span>
                      </button>
                    \`).join('')}
                  </div>
                \` : ''}

                <!-- Visual Mini-Status Row: Clickable 7 Day pills for week or 30 mini dots for month -->
                <div class="flex flex-col gap-1.5 pt-1.5 border-t border-slate-200/70 dark:border-slate-700/50">
                  <div
                    class="w-full"
                    data-testid="audit-dots-\${item.task.id}"
                    aria-label="\${item.completedDays} of \${item.totalDays} days completed"
                  >
                    \${dotsHtml}
                  </div>
                  <div class="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Tap any day pill (SUN–SAT) to manually toggle Completed / Missed</span>
                    <span>\${state.auditPeriod === 'week' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                  </div>
                </div>
              </div>
            \`;
          }).join('');
        }

        updateCategoryProgress();
      }

      function getRecommendedDurationSeconds(item) {
        const arabicWords = ((item && item.arabic) || '').trim().split(/\\s+/).filter(Boolean).length;
        const secondsPerRep = Math.max(4, Math.ceil(arabicWords * 0.65));
        const totalEst = secondsPerRep * Math.max(1, (item && item.target) || 1);
        return Math.min(900, Math.max(30, Math.ceil(totalEst / 15) * 15));
      }

      function formatTimerMMSS(sec) {
        const s = Math.max(0, Math.floor(sec));
        const m = Math.floor(s / 60);
        const r = s % 60;
        return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
      }

      function getCardTimerState(item) {
        if (!state.timers[item.id]) {
          const defSec = getRecommendedDurationSeconds(item);
          state.timers[item.id] = {
            duration: defSec,
            remaining: defSec,
            running: false,
            finished: false,
            showPresets: false
          };
        }
        return state.timers[item.id];
      }

      setInterval(function() {
        if (!state.settings.showFocusTimer) return;
        let anyChanged = false;
        Object.keys(state.timers).forEach(function(itemId) {
          const t = state.timers[itemId];
          if (t && t.running) {
            if (t.remaining <= 1) {
              t.remaining = 0;
              t.running = false;
              t.finished = true;
              playCompletionChime();
              triggerVibration([70, 50, 90]);
            } else {
              t.remaining -= 1;
            }
            anyChanged = true;
          }
        });
        if (anyChanged) {
          renderCards();
        }
      }, 1000);

      function renderCards() {
        if (state.activeTab === 'progress') {
          els.adhkarList.classList.add('hidden');
          if (els.adhkarBottomActions) els.adhkarBottomActions.classList.add('hidden');
          els.searchFilterSection.classList.add('hidden');
          els.tasksView.classList.add('hidden');
          els.tasbihView.classList.add('hidden');
          els.emptyState.classList.add('hidden');
          if (els.progressView) els.progressView.classList.remove('hidden');
          renderProgressView();
          return;
        }

        if (els.progressView) els.progressView.classList.add('hidden');

        if (state.activeTab === 'tasbih') {
          els.adhkarList.classList.add('hidden');
          if (els.adhkarBottomActions) els.adhkarBottomActions.classList.add('hidden');
          els.searchFilterSection.classList.add('hidden');
          els.tasksView.classList.add('hidden');
          els.tasbihView.classList.remove('hidden');
          els.emptyState.classList.add('hidden');
          renderTasbihView();
          return;
        }

        if (state.activeTab === 'tasks') {
          els.adhkarList.classList.add('hidden');
          if (els.adhkarBottomActions) els.adhkarBottomActions.classList.add('hidden');
          els.searchFilterSection.classList.add('hidden');
          els.tasbihView.classList.add('hidden');
          els.emptyState.classList.add('hidden');
          els.tasksView.classList.remove('hidden');
          renderTasksView();
          return;
        }

        els.tasksView.classList.add('hidden');
        els.adhkarList.classList.remove('hidden');
        if (els.adhkarBottomActions) els.adhkarBottomActions.classList.remove('hidden');
        els.searchFilterSection.classList.remove('hidden');
        els.tasbihView.classList.add('hidden');

        const activeItems = getActiveItems();
        const allAdhkarItems = [
          ...window.ADHKAR_DATA.morning,
          ...window.ADHKAR_DATA.evening,
          ...window.ADHKAR_DATA.prayer,
          ...window.ADHKAR_DATA.sleep
        ];
        const query = state.searchQuery.trim().toLowerCase();
        const isSearching = query.length > 0;
        const sourcePool = (isSearching && state.activeTab !== 'favorites') ? allAdhkarItems : activeItems;

        const CATEGORY_META = {
          morning: { icon: '☀️', label: 'Morning Adhkar', shortLabel: 'Morning', ml: 'പ്രഭാത ദിക്റുകൾ', ar: 'أذكار الصباح', badgeClass: 'bg-amber-100 text-black border-amber-600 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/80' },
          evening: { icon: '🌙', label: 'Evening Adhkar', shortLabel: 'Evening', ml: 'വൈകുന്നേരത്തെ ദിക്റുകൾ', ar: 'أذكار المساء', badgeClass: 'bg-indigo-100 text-black border-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-700/80' },
          prayer: { icon: '✨', label: 'After Prayer Adhkar', shortLabel: 'After Prayer', ml: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ', ar: 'أذكار بعد الصلاة', badgeClass: 'bg-teal-100 text-black border-teal-600 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-700/80' },
          sleep: { icon: '🌌', label: 'Before Sleep Adhkar', shortLabel: 'Before Sleep', ml: 'ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ', ar: 'أذكار النوم', badgeClass: 'bg-purple-100 text-black border-purple-600 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-700/80' }
        };

        const filtered = sourcePool.filter(item => {
          const currentCount = state.counts[item.id] || 0;
          const isDone = currentCount >= item.target;

          if (state.filterMode === 'incomplete' && isDone) return false;
          if (state.filterMode === 'completed' && !isDone) return false;

          if (!query) return true;
          const catInfo = CATEGORY_META[item.category] || CATEGORY_META.morning;
          return (
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.arabic && item.arabic.toLowerCase().includes(query)) ||
            (item.transliteration && item.transliteration.toLowerCase().includes(query)) ||
            (item.translation && item.translation.toLowerCase().includes(query)) ||
            (item.malayalam && item.malayalam.toLowerCase().includes(query)) ||
            (item.malayalamTranslation && item.malayalamTranslation.toLowerCase().includes(query)) ||
            (item.virtue && item.virtue.toLowerCase().includes(query)) ||
            (item.malayalamVirtue && item.malayalamVirtue.toLowerCase().includes(query)) ||
            (item.source && item.source.toLowerCase().includes(query)) ||
            (catInfo.label.toLowerCase().includes(query)) ||
            (catInfo.ml.toLowerCase().includes(query))
          );
        }).sort((a, b) => {
          if (!isSearching) return 0;
          const aInTab = a.category === state.activeTab ? 0 : 1;
          const bInTab = b.category === state.activeTab ? 0 : 1;
          return aInTab - bInTab;
        });

        if (filtered.length === 0) {
          els.adhkarList.innerHTML = '';
          els.emptyState.classList.remove('hidden');
          els.emptyStateMsg.textContent = state.activeTab === 'favorites' && state.favorites.length === 0
            ? 'You have not starred any adhkar yet. Tap the star icon on any dhikr card to save it here for fast daily access.'
            : 'No remembrances match your search terms or filter. Try clearing the search query.';
          return;
        }

        els.emptyState.classList.add('hidden');

        const fontClass = state.settings.arabicFontSize === 'xlarge'
          ? 'text-2xl sm:text-3xl leading-loose'
          : (state.settings.arabicFontSize === 'medium' ? 'text-lg sm:text-xl leading-relaxed' : 'text-xl sm:text-2xl leading-relaxed');

        const showML = state.settings.translationLanguage === 'ml' || state.settings.translationLanguage === 'both';
        const showEN = state.settings.translationLanguage === 'en' || state.settings.translationLanguage === 'both';

        els.adhkarList.innerHTML = filtered.map((item, index) => {
          const currentCount = state.counts[item.id] || 0;
          const isDone = currentCount >= item.target;
          const isFav = state.favorites.includes(item.id);
          const mlText = item.malayalamTranslation || item.malayalam;
          const isTransExpanded = Boolean(state.expandedTranslations[item.id]);

          const catItemsForNum = window.ADHKAR_DATA[item.category] || [];
          const catIdx = catItemsForNum.findIndex(x => x.id === item.id);
          const displayNumber = item.itemNumber ? item.itemNumber : (catIdx >= 0 ? catIdx + 1 : index + 1);

          return \`
            <article id="adhkar-card-\${item.id}" class="adhkar-card bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-200 shadow-xs space-y-4 card-surface \${
              isDone ? 'border-emerald-500 dark:border-emerald-800/80 bg-emerald-50/60' : 'border-slate-300 dark:border-slate-800'
            }" data-id="\${item.id}" data-item-number="\${displayNumber}">
              
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#064e3b] dark:text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-400 dark:border-emerald-800">
                    \${displayNumber}
                  </span>
                  <span class="text-xs font-extrabold text-[#0d5c3a] dark:text-emerald-400">
                    \${item.repeatNote || (item.target + ' time' + (item.target > 1 ? 's' : ''))}
                  </span>
                </div>

                <div class="flex flex-wrap items-center justify-end gap-1.5">
                  <button type="button" class="share-img-btn px-2.5 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-200 border border-amber-500/70 font-extrabold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs" data-id="\${item.id}" data-testid="share-image-btn-\${item.id}" title="ചിത്രമായി പങ്കുവെക്കുക (Share Image)">
                    <span>🖼️</span>
                    <span class="font-malayalam">ചിത്രമായി പങ്കുവെക്കുക (Share Image)</span>
                  </button>

                  <button class="fav-btn p-1.5 rounded-full text-slate-800 dark:text-slate-400 hover:text-amber-600 transition-colors" data-id="\${item.id}" title="Toggle Favorite">
                    \${isFav ? '<span class="text-amber-500 text-base">★</span>' : '<span class="text-slate-800 dark:text-slate-400 text-base font-bold">☆</span>'}
                  </button>

                  <button class="copy-btn p-1.5 rounded-full text-slate-800 dark:text-slate-400 hover:text-[#0d5c3a] transition-colors" data-id="\${item.id}" title="Copy Dhikr">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </button>

                  <button class="count-btn px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-90 \${
                    isDone 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-[#0d5c3a] hover:bg-[#064e3b] text-white shadow-xs'
                  }" data-id="\${item.id}">
                    <span>\${isDone ? '✓ Done' : 'Tap: ' + currentCount + ' / ' + item.target}</span>
                  </button>
                </div>
              </div>

              \${item.title ? \`<h3 class="font-malayalam text-sm sm:text-base font-extrabold text-black dark:text-emerald-200 tracking-tight">\${item.title}</h3>\` : ''}

              <!-- Audio Pronunciation Bar (Segregated Voice Styles & Synced Play/Pause) -->
              <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl \${
                state.playingId === item.id && state.playbackStatus === 'playing'
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-600 ring-1 ring-emerald-600/50'
                  : 'bg-emerald-50/90 dark:bg-slate-800/70 border-emerald-300 dark:border-slate-700/80'
              } border my-2 transition-all">
                <button type="button" class="pronounce-btn px-3 py-1.5 rounded-lg \${
                  state.playingId === item.id && state.playbackStatus === 'playing'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-[#0d5c3a] hover:bg-[#064e3b]'
                } text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95" data-id="\${item.id}" data-item-number="\${displayNumber}" data-testid="play-btn-\${item.id}">
                  <span>\${state.playingId === item.id && state.playbackStatus === 'playing' ? '⏸ Pause' : '▶ Play'}</span>
                  <span class="font-arabic text-[11px] opacity-95">\${state.playingId === item.id && state.playbackStatus === 'playing' ? 'إيقاف' : 'استمع'}</span>
                </button>
                <span class="text-[11px] text-black dark:text-emerald-300 font-extrabold truncate" title="\${
                  item.isQuranic
                    ? 'Traditional melodic, contemplative, and rhythmic Quranic recitation (Tajweed/Murattal style) by a native male reciter (Qari)'
                    : 'Natural, humble, calm, and conversational native Arabic male voice with a steady, reverent spiritual tone for private remembrance (Dua)'
                }">
                  \${item.isQuranic ? '🎵 Tajweed / Murattal • Qari (ആയത്തുകൾ)' : '🎙️ Calm Natural Dua Voice (ദിക്റുകൾ)'}
                </span>
              </div>

              \${Boolean(state.settings.showFocusTimer) ? (() => {
                const tState = getCardTimerState(item);
                const pct = tState.duration > 0 ? Math.min(100, Math.round(((tState.duration - tState.remaining) / tState.duration) * 100)) : 0;
                return \`
                  <div data-testid="dhikr-timer-\${item.id}" class="p-2.5 rounded-xl border transition-all my-2 \${
                    tState.finished
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700'
                      : tState.running
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/70'
                        : 'bg-slate-50/90 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/70'
                  }">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                          <span>⏱️</span>
                          <span class="font-malayalam">Focus Timer • സമയക്രമം</span>
                        </span>
                        <span data-testid="dhikr-timer-display-\${item.id}" class="font-mono font-extrabold text-sm px-2 py-0.5 rounded-lg border \${
                          tState.finished
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : tState.running
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 border-slate-200 dark:border-slate-700'
                        }">
                          \${tState.finished ? '✓ 00:00' : formatTimerMMSS(tState.remaining)}
                        </span>
                      </div>

                      <div class="flex items-center gap-1.5">
                        <button type="button" data-timer-toggle="\${item.id}" data-testid="dhikr-timer-start-\${item.id}" class="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 \${
                          tState.running
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs'
                            : 'bg-teal-700 hover:bg-teal-800 text-white shadow-2xs'
                        }">
                          <span>\${tState.running ? '⏸ Pause' : tState.finished ? '↻ Restart' : '▶ Start'}</span>
                        </button>

                        \${(tState.remaining !== tState.duration || tState.finished) ? \`
                          <button type="button" data-timer-reset="\${item.id}" data-testid="dhikr-timer-reset-\${item.id}" class="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors cursor-pointer" title="Reset Timer">
                            ↺ Reset
                          </button>
                        \` : ''}

                        <button type="button" data-timer-presets-toggle="\${item.id}" data-testid="dhikr-timer-presets-btn-\${item.id}" class="px-2 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-teal-400 transition-colors cursor-pointer" title="Adjust Timer Duration">
                          Set Time \${tState.showPresets ? '▴' : '▾'}
                        </button>
                      </div>
                    </div>

                    \${(tState.running || tState.finished || tState.remaining < tState.duration) ? \`
                      <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                        <div class="h-full transition-all duration-300 rounded-full \${tState.finished ? 'bg-emerald-500' : 'bg-amber-500'}" style="width: \${pct}%"></div>
                      </div>
                    \` : ''}

                    \${tState.showPresets ? \`
                      <div class="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                        <div class="flex flex-wrap items-center gap-1">
                          \${[
                            { label: '30s', sec: 30 },
                            { label: '1m', sec: 60 },
                            { label: '2m', sec: 120 },
                            { label: '3m', sec: 180 },
                            { label: '5m', sec: 300 }
                          ].map(p => \`
                            <button type="button" data-timer-preset="\${item.id}" data-sec="\${p.sec}" class="px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer \${
                              tState.duration === p.sec
                                ? 'bg-teal-700 text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400'
                            }">
                              \${p.label}
                            </button>
                          \`).join('')}
                        </div>
                        <div class="flex items-center gap-1">
                          <button type="button" data-timer-adjust="\${item.id}" data-delta="-15" class="px-2 py-0.5 rounded-md font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400 cursor-pointer">-15s</button>
                          <button type="button" data-timer-adjust="\${item.id}" data-delta="15" class="px-2 py-0.5 rounded-md font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400 cursor-pointer">+15s</button>
                        </div>
                      </div>
                    \` : ''}
                  </div>
                \`;
              })() : ''}

              <div class="text-right py-1">
                <p class="font-arabic font-black text-black dark:text-white \${fontClass} tracking-wide select-text" dir="rtl">
                  \${item.arabic}
                </p>
              </div>

              \${state.settings.showTransliteration && item.transliteration ? \`
                <div class="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900/40 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-extrabold italic leading-relaxed select-text">
                  \${item.transliteration}
                </div>
              \` : ''}

              \${state.settings.showTranslation && ((showML && mlText) || (showEN && item.translation)) ? \`
                <div class="pt-1">
                  <button
                    type="button"
                    data-toggle-translation="\${item.id}"
                    data-testid="toggle-translation-\${item.id}"
                    aria-expanded="\${isTransExpanded ? 'true' : 'false'}"
                    class="w-full py-2 px-3 rounded-xl bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-emerald-300 dark:border-slate-700 text-[#064e3b] dark:text-emerald-300 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer active:scale-99"
                  >
                    <span class="font-malayalam flex items-center gap-1.5">
                      <span>📖</span>
                      <span class="translation-btn-label">\${isTransExpanded ? 'Hide Translation / അർത്ഥം മറയ്ക്കുക' : 'View Translation / അർത്ഥം കാണുക'}</span>
                    </span>
                    <span class="translation-chevron text-[10px] transition-transform duration-200 \${isTransExpanded ? 'rotate-180' : ''}">▼</span>
                  </button>

                  <div id="trans-panel-\${item.id}" data-testid="translation-panel-\${item.id}" class="\${isTransExpanded ? '' : 'hidden '}mt-2 space-y-2 text-xs sm:text-sm animate-fade-in">
                    \${showML && mlText ? \`
                      <div class="font-malayalam bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-400 dark:border-emerald-800/40 text-black dark:text-emerald-100 p-2.5 rounded-xl leading-relaxed select-text font-bold">
                        <span class="inline-block font-black text-[10px] px-2 py-0.5 rounded bg-[#0d5c3a] text-white mr-1.5 mb-1">മലയാളം</span>
                        <div>\${mlText}</div>
                      </div>
                    \` : ''}
                    \${showEN && item.translation ? \`
                      <div class="text-black dark:text-slate-200 font-bold leading-relaxed select-text px-1">
                        <span class="font-black text-[#0d5c3a] dark:text-emerald-400 mr-1.5 text-xs">EN:</span>
                        \${item.translation}
                      </div>
                    \` : ''}
                  </div>
                </div>
              \` : ''}

              \${state.settings.showVirtues && (item.virtue || item.malayalamVirtue || item.hadithArabic || item.source) ? \`
                <details class="group text-xs border-t border-slate-300 dark:border-slate-800 pt-2">
                  <summary class="font-extrabold text-black dark:text-emerald-400 cursor-pointer flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-teal-50/90 hover:bg-teal-100/90 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-teal-300 dark:border-slate-700 transition-colors">
                    <span class="flex items-center gap-1.5 flex-wrap">
                      <span>📖</span>
                      <span class="font-malayalam">Hadith Ref &amp; Virtue / ഹദീസിൻ്റെ ശ്രേഷ്ഠത</span>
                      \${item.source ? \`<span class="opacity-85">• \${item.source}</span>\` : ''}
                    </span>
                    <span class="text-black dark:text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 p-3 rounded-xl bg-amber-50/90 dark:bg-slate-800/50 border border-amber-400 dark:border-slate-700 space-y-2 text-black dark:text-slate-200 font-bold select-text">
                    \${item.source ? \`<div class="font-extrabold text-[#0d5c3a] dark:text-emerald-300">📚 Hadith Ref: \${item.source}</div>\` : ''}
                    \${item.hadithArabic ? \`<div dir="rtl" class="font-arabic text-base sm:text-lg leading-loose text-right p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-300 dark:border-slate-700 text-black dark:text-amber-100 font-bold">\${item.hadithArabic}</div>\` : ''}
                    \${item.malayalamVirtue && showML ? \`<div class="font-malayalam font-bold text-black dark:text-emerald-200 leading-relaxed">\${item.malayalamVirtue}</div>\` : ''}
                    \${item.virtue && showEN ? \`<div class="text-slate-800 dark:text-slate-300 leading-relaxed">\${item.virtue}</div>\` : ''}
                  </div>
                </details>
              \` : ''}

              \${(isSearching || state.activeTab === 'favorites') ? (() => {
                const catMeta = CATEGORY_META[item.category] || CATEGORY_META.morning;
                const catList = window.ADHKAR_DATA[item.category] || [];
                const idxInCat = catList.findIndex(x => x.id === item.id);
                const posNum = item.itemNumber || (idxInCat >= 0 ? idxInCat + 1 : index + 1);
                const totalInCat = catList.length;
                return \`
                  <div data-testid="search-result-category-\${item.id}" class="pt-3 border-t border-slate-300 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-extrabold text-[11px] sm:text-xs border shadow-2xs \${catMeta.badgeClass}">
                        <span>📍</span>
                        <span>\${catMeta.icon}</span>
                        <span>\${catMeta.label}</span>
                        <span class="font-mono font-black opacity-90">(#\${posNum}\${totalInCat > 0 ? ' of ' + totalInCat : ''})</span>
                      </span>
                      <span class="text-[11px] font-bold text-[#0d5c3a] dark:text-emerald-300 flex items-center gap-1.5">
                        <span class="font-malayalam font-extrabold">\${catMeta.ml}</span>
                        <span class="opacity-60">•</span>
                        <span class="font-arabic text-xs font-bold">\${catMeta.ar}</span>
                      </span>
                    </div>
                    <button type="button" data-jump-category="\${item.category}" data-jump-item="\${item.id}" class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer border bg-emerald-50 hover:bg-emerald-200 text-black border-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-900/70 dark:text-emerald-300 dark:border-slate-700">
                      <span>Open in \${catMeta.shortLabel} →</span>
                    </button>
                  </div>
                \`;
              })() : ''}

            </article>
          \`;
        }).join('');

        updateCategoryProgress();
      }

      // Single global currentAudio player instance (prevents overlapping playback)
      let currentAudio = null;
      window.currentAudio = null;
      let currentUtterance = null;
      let audioPlaybackToken = 0;
      let autoplayAdvanceTimer = null;

      function clearAutoplayAdvanceTimer() {
        if (autoplayAdvanceTimer) {
          clearTimeout(autoplayAdvanceTimer);
          autoplayAdvanceTimer = null;
        }
      }

      function parseAudioBounds(rawUrl, explicitStart, explicitEnd) {
        let startTime = typeof explicitStart === 'number' && !isNaN(explicitStart) ? explicitStart : 0;
        let endTime = typeof explicitEnd === 'number' && !isNaN(explicitEnd) ? explicitEnd : 0;
        if (rawUrl && typeof rawUrl === 'string') {
          const fragMatch = rawUrl.match(/#t=([\\d.]+)(?:,([\\d.]+))?/i);
          if (fragMatch) {
            if (!startTime && fragMatch[1]) startTime = parseFloat(fragMatch[1]) || 0;
            if (!endTime && fragMatch[2]) endTime = parseFloat(fragMatch[2]) || 0;
          }
        }
        return { startTime: startTime, endTime: endTime };
      }

      function stopAndUnloadCurrentAudio() {
        audioPlaybackToken++;
        clearAutoplayAdvanceTimer();
        if (currentAudio) {
          try {
            currentAudio.onplay = null;
            currentAudio.onpause = null;
            currentAudio.onended = null;
            currentAudio.onerror = null;
            currentAudio.ontimeupdate = null;
            currentAudio.onloadedmetadata = null;
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio.removeAttribute('src');
            currentAudio.load();
          } catch (err) {}
          currentAudio = null;
          window.currentAudio = null;
        }
        if (currentUtterance) {
          try {
            currentUtterance.onstart = null;
            currentUtterance.onend = null;
            currentUtterance.onerror = null;
          } catch (err) {}
          currentUtterance = null;
        }
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
          } catch (err) {}
        }
        state.playingId = null;
        state.playbackStatus = 'idle';
        syncAudioButtonsUI();
      }

      function syncAudioButtonsUI() {
        document.querySelectorAll('.pronounce-btn').forEach(btn => {
          const btnId = btn.dataset.id;
          const isPlayingThis = state.playingId === btnId && state.playbackStatus === 'playing';
          if (isPlayingThis) {
            btn.className = 'pronounce-btn px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95';
            btn.innerHTML = '<span>⏸ Pause</span><span class="font-arabic text-[11px] opacity-90">إيقاف</span>';
          } else {
            btn.className = 'pronounce-btn px-3 py-1.5 rounded-lg bg-[#0d5c3a] hover:bg-[#064e3b] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95';
            btn.innerHTML = '<span>▶ Play</span><span class="font-arabic text-[11px] opacity-90">استمع</span>';
          }
        });
        if (els.autoplayAllBtn) {
          if (state.autoplayActive) {
            els.autoplayAllBtn.className = 'px-3 py-1.5 rounded-xl font-extrabold bg-amber-600 hover:bg-amber-700 text-white border border-amber-300 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95';
            if (els.autoplayAllBtnIcon) els.autoplayAllBtnIcon.textContent = '⏹';
            if (els.autoplayAllBtnLabel) els.autoplayAllBtnLabel.textContent = 'Stop Autoplay';
          } else {
            els.autoplayAllBtn.className = 'px-3 py-1.5 rounded-xl font-extrabold bg-emerald-800 hover:bg-emerald-900 text-amber-200 border border-amber-400/50 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95';
            if (els.autoplayAllBtnIcon) els.autoplayAllBtnIcon.textContent = '▶';
            if (els.autoplayAllBtnLabel) els.autoplayAllBtnLabel.textContent = 'Autoplay All';
          }
        }
      }

      function onCardAudioFinished(finishedItemId) {
        if (state.autoplayActive) {
          const items = getActiveItems();
          const currentIdx = items.findIndex(it => it.id === finishedItemId);
          const nextIdx = (currentIdx >= 0 ? currentIdx : state.autoplayIndex) + 1;
          if (nextIdx < items.length) {
            state.autoplayIndex = nextIdx;
            const nextItem = items[nextIdx];
            autoplayAdvanceTimer = setTimeout(function() {
              autoplayAdvanceTimer = null;
              if (!state.autoplayActive) return;
              const cardEl = document.getElementById('adhkar-card-' + nextItem.id);
              if (cardEl && cardEl.scrollIntoView) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              playItemAudio(nextItem, { fromAutoplay: true });
            }, 800);
            return;
          } else {
            state.autoplayActive = false;
          }
        }
        stopAndUnloadCurrentAudio();
      }

      function playItemAudio(item, options) {
        if (!item) return;
        const fromAutoplay = Boolean(options && options.fromAutoplay);

        // Single-item play strictly cancels any active Autoplay All session
        if (!fromAutoplay) {
          state.autoplayActive = false;
          clearAutoplayAdvanceTimer();
        }

        if (!fromAutoplay && state.playingId === item.id && state.playbackStatus === 'playing') {
          stopAndUnloadCurrentAudio();
          return;
        }

        stopAndUnloadCurrentAudio();
        if (fromAutoplay) {
          state.autoplayActive = true;
        }

        const token = ++audioPlaybackToken;
        state.playingId = item.id;
        state.lastSelectedCardId = item.id;
        state.playbackStatus = 'playing';
        syncAudioButtonsUI();

        const cleanText = item.arabic.replace(/\\s*\\([٠-٩\\d]+\\)\\s*/g, ' ').replace(/\\n+/g, ' ').trim();
        const isQuranic = !!item.isQuranic;

        const playlist = [];
        if (item.audioUrls && item.audioUrls.length > 0) {
          playlist.push(...item.audioUrls);
        } else if (item.audioUrl) {
          playlist.push(item.audioUrl);
        }

        function speakWithSegregatedVoiceStyle() {
          if (audioPlaybackToken !== token || state.playingId !== item.id) return;
          if (!('speechSynthesis' in window)) {
            onCardAudioFinished(item.id);
            return;
          }
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'ar-SA';
            if (isQuranic) {
              utterance.rate = 0.88;
              utterance.pitch = 0.98;
              utterance.volume = 1.0;
            } else {
              utterance.rate = 0.95;
              utterance.pitch = 1.0;
              utterance.volume = 0.92;
            }
            const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            const arVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith('ar'));
            if (arVoices.length > 0) {
              const maleKeywords = ['maged', 'tariq', 'naayf', 'hamed', 'fahed', 'fahad', 'salman', 'omar', 'male', 'ar-sa', 'natural'];
              const preferred = arVoices.find(v => maleKeywords.some(k => (v.name || '').toLowerCase().includes(k))) || arVoices[0];
              if (preferred) utterance.voice = preferred;
            }
            utterance.onend = () => {
              if (audioPlaybackToken === token && state.playingId === item.id) {
                onCardAudioFinished(item.id);
              }
            };
            utterance.onerror = () => {
              if (audioPlaybackToken === token && state.playingId === item.id) {
                onCardAudioFinished(item.id);
              }
            };
            currentUtterance = utterance;
            window.speechSynthesis.speak(utterance);
          } catch (err) {
            onCardAudioFinished(item.id);
          }
        }

        if (playlist.length > 0) {
          let idx = 0;
          function playNextSegment() {
            if (audioPlaybackToken !== token || state.playingId !== item.id) return;
            if (idx >= playlist.length) {
              onCardAudioFinished(item.id);
              return;
            }
            if (currentAudio) {
              try {
                currentAudio.onplay = null;
                currentAudio.onended = null;
                currentAudio.onerror = null;
                currentAudio.ontimeupdate = null;
                currentAudio.onloadedmetadata = null;
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio.removeAttribute('src');
                currentAudio.load();
              } catch (e) {}
            }
            const rawUrl = playlist[idx];
            const bounds = parseAudioBounds(
              rawUrl,
              playlist.length === 1 ? item.audioStartTime : undefined,
              playlist.length === 1 ? item.audioEndTime : undefined
            );
            const startTime = bounds.startTime;
            const endTime = bounds.endTime;

            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = rawUrl;
            audio.dataset.itemId = item.id;
            audio.dataset.startTime = String(startTime);
            audio.dataset.endTime = String(endTime);
            try {
              audio.currentTime = startTime > 0 ? startTime : 0;
            } catch (e) {}
            currentAudio = audio;
            window.currentAudio = audio;

            let segmentFinished = false;
            function completeSegment() {
              if (segmentFinished) return;
              if (audioPlaybackToken !== token || state.playingId !== item.id) return;
              segmentFinished = true;
              audio.ontimeupdate = null;
              audio.onended = null;
              try {
                audio.pause();
              } catch (e) {}
              idx++;
              playNextSegment();
            }

            if (startTime > 0) {
              audio.onloadedmetadata = () => {
                if (audioPlaybackToken !== token || state.playingId !== item.id) return;
                try {
                  if (Math.abs(audio.currentTime - startTime) > 0.25) {
                    audio.currentTime = startTime;
                  }
                } catch (e) {}
              };
            }

            audio.onplay = () => {
              if (audioPlaybackToken !== token || state.playingId !== item.id) return;
              if (startTime > 0 && audio.currentTime < startTime - 0.25) {
                try {
                  audio.currentTime = startTime;
                } catch (e) {}
              }
            };

            if (endTime > 0) {
              audio.ontimeupdate = () => {
                if (audioPlaybackToken !== token || state.playingId !== item.id) return;
                if (audio.currentTime >= endTime) {
                  completeSegment();
                }
              };
            }

            let fellBack = false;
            function fallbackOnce() {
              if (fellBack || segmentFinished) return;
              if (audioPlaybackToken !== token || state.playingId !== item.id) return;
              fellBack = true;
              speakWithSegregatedVoiceStyle();
            }

            audio.onended = () => {
              completeSegment();
            };
            audio.onerror = fallbackOnce;
            const p = audio.play();
            if (p && p.catch) p.catch(fallbackOnce);
          }
          playNextSegment();
        } else {
          speakWithSegregatedVoiceStyle();
        }
      }

      // Play strictly the selected card by unique ID or category index (never defaults to 0)
      function playItem(cardId) {
        if (!cardId) return;
        const all = [
          ...window.ADHKAR_DATA.morning,
          ...window.ADHKAR_DATA.evening,
          ...window.ADHKAR_DATA.prayer,
          ...window.ADHKAR_DATA.sleep
        ];
        const item = all.find(i => i.id === String(cardId));
        if (item) {
          playItemAudio(item, { fromAutoplay: false });
        }
      }

      function playDhikrAudio(indexOrId) {
        if (typeof indexOrId === 'string' && isNaN(Number(indexOrId))) {
          playItem(indexOrId);
          return;
        }
        const items = getActiveItems();
        const numericVal = Number(indexOrId);
        if (isNaN(numericVal)) return;
        // Support 0-based index in active category list or itemNumber match
        const item = items[numericVal] || items.find(i => i.itemNumber === numericVal);
        if (item) {
          playItemAudio(item, { fromAutoplay: false });
        }
      }

      function startAutoplayAll() {
        const items = getActiveItems();
        if (!items || items.length === 0) return;
        clearAutoplayAdvanceTimer();
        const targetId = state.playingId || state.lastSelectedCardId;
        const foundIdx = targetId ? items.findIndex(i => i.id === targetId) : -1;
        const startIdx = foundIdx >= 0 ? foundIdx : 0;
        state.autoplayActive = true;
        state.autoplayIndex = startIdx;
        const startItem = items[startIdx];
        const cardEl = document.getElementById('adhkar-card-' + startItem.id);
        if (cardEl && cardEl.scrollIntoView) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        playItemAudio(startItem, { fromAutoplay: true });
      }

      function stopAutoplayAll() {
        state.autoplayActive = false;
        clearAutoplayAdvanceTimer();
        stopAndUnloadCurrentAudio();
      }

      window.playItem = playItem;
      window.playDhikrAudio = playDhikrAudio;
      window.startAutoplayAll = startAutoplayAll;
      window.stopAutoplayAll = stopAutoplayAll;

      function renderTasbihView() {
        const preset = window.ADHKAR_DATA.tasbihPresets.find(p => p.id === state.tasbih.currentDhikrId) || window.ADHKAR_DATA.tasbihPresets[0];
        els.tasbihArabic.textContent = preset.arabic;
        els.tasbihTranslit.textContent = preset.transliteration;
        els.tasbihTrans.textContent = preset.translation + ' • ' + preset.malayalamTranslation;

        els.tasbihCurrentCount.textContent = state.tasbih.count;
        els.tasbihTargetDisplay.textContent = 'Target: ' + state.tasbih.target;

        const radius = 44;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(state.tasbih.count / state.tasbih.target, 1);
        const offset = circumference - (progress * circumference);
        els.tasbihRingCircle.style.strokeDashoffset = offset;
      }

      function handleCount(id) {
        const all = [
          ...window.ADHKAR_DATA.morning,
          ...window.ADHKAR_DATA.evening,
          ...window.ADHKAR_DATA.prayer,
          ...window.ADHKAR_DATA.sleep
        ];
        const item = all.find(i => i.id === id);
        if (!item) return;

        const targetCatKey = (state.activeTab === 'favorites') ? 'favorites' : (item.category || state.activeTab);
        const catItems = (targetCatKey === 'favorites')
          ? getActiveItems()
          : (window.ADHKAR_DATA[targetCatKey] || getActiveItems());
        const wasCategoryAllDone = catItems.length > 0 && catItems.every(i => (state.counts[i.id] || 0) >= i.target);

        const current = state.counts[id] || 0;
        if (current >= item.target) {
          state.counts[id] = 0;
        } else {
          state.counts[id] = current + 1;
          if (state.counts[id] === item.target) {
            playTapBeep();
            triggerVibration(30);
          } else {
            playTapBeep();
            triggerVibration(15);
          }
        }
        saveState();
        recalculateDynamicStreak();
        renderStreakBadge();
        renderCards();
        updateTabsUI();

        const isCategoryNowAllDone = catItems.length > 0 && catItems.every(i => (state.counts[i.id] || 0) >= i.target);
        if (!wasCategoryAllDone && isCategoryNowAllDone) {
          triggerCompletionOverlay(targetCatKey);
        }
      }

      function toggleTaskById(taskId) {
        const wasTasksAllDone = state.tasks.length > 0 && state.tasks.every(t => isTaskEffectivelyCompleted(t));
        state.tasks = state.tasks.map(task => {
          if (task.id !== taskId) return task;
          const hasSubs = Array.isArray(task.subtasks) && task.subtasks.length > 0;
          const allSubsDone = hasSubs ? task.subtasks.every(s => s.completed) : task.completed;
          const nextCompleted = hasSubs ? !(task.completed && allSubsDone) : !task.completed;
          if (nextCompleted) {
            playTapBeep();
            triggerVibration(30);
          } else {
            playTapBeep();
          }
          return {
            ...task,
            completed: nextCompleted,
            subtasks: task.subtasks ? task.subtasks.map(s => ({ ...s, completed: nextCompleted })) : undefined
          };
        });
        saveTasksState();
        updateTabsUI();
        renderTasksView();
        const isTasksNowAllDone = state.tasks.length > 0 && state.tasks.every(t => isTaskEffectivelyCompleted(t));
        if (!wasTasksAllDone && isTasksNowAllDone) {
          triggerCompletionOverlay('tasks');
        }
      }

      function toggleSubtaskById(taskId, subtaskId) {
        const wasTasksAllDone = state.tasks.length > 0 && state.tasks.every(t => isTaskEffectivelyCompleted(t));
        state.tasks = state.tasks.map(task => {
          if (task.id !== taskId || !task.subtasks) return task;
          const updatedSubs = task.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
          const tempTask = { ...task, subtasks: updatedSubs };
          const stats = getTaskPortionStats(tempTask);
          if (stats.isComplete) {
            playTapBeep();
            triggerVibration(30);
          } else {
            playTapBeep();
            triggerVibration(15);
          }
          return {
            ...task,
            completed: stats.isComplete,
            subtasks: updatedSubs
          };
        });
        saveTasksState();
        updateTabsUI();
        renderTasksView();
        const isTasksNowAllDone = state.tasks.length > 0 && state.tasks.every(t => isTaskEffectivelyCompleted(t));
        if (!wasTasksAllDone && isTasksNowAllDone) {
          triggerCompletionOverlay('tasks');
        }
      }

      function toggleAuditDayById(taskId, dateStr) {
        if (!taskId || !dateStr) return;
        const todayStr = getTodayString();
        const isToday = dateStr === todayStr;
        const entry = state.tasksHistory[dateStr] || {};
        const targetTask = state.tasks.find(t => t.id === taskId);
        const statsTemplate = targetTask ? getTaskPortionStats(targetTask) : { hasPortions: false, totalPortions: 1 };

        let currentPercent = 0;
        if (isToday && targetTask) {
          currentPercent = getTaskPortionStats(targetTask).percent;
        } else if (entry[taskId + '_percent'] !== undefined) {
          currentPercent = Number(entry[taskId + '_percent']);
        } else if (entry[taskId] === true || (Array.isArray(entry.completedTaskIds) && entry.completedTaskIds.includes(taskId))) {
          currentPercent = 100;
        }

        const nextCompleted = currentPercent < 100;
        const completedIds = new Set(Array.isArray(entry.completedTaskIds) ? entry.completedTaskIds : []);
        if (nextCompleted) {
          completedIds.add(taskId);
        } else {
          completedIds.delete(taskId);
        }

        const updatedDay = {
          ...entry,
          date: dateStr,
          [taskId]: nextCompleted,
          completedTaskIds: Array.from(completedIds)
        };

        if (statsTemplate.hasPortions) {
          updatedDay[taskId + '_portion'] = nextCompleted ? statsTemplate.totalPortions : 0;
          updatedDay[taskId + '_percent'] = nextCompleted ? 100 : 0;
          updatedDay[taskId + '_total'] = statsTemplate.totalPortions;
        }

        state.tasksHistory[dateStr] = updatedDay;

        if (isToday) {
          state.tasks = state.tasks.map(task => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              completed: nextCompleted,
              subtasks: task.subtasks ? task.subtasks.map(s => ({ ...s, completed: nextCompleted })) : undefined
            };
          });
          try {
            localStorage.setItem('adhkar_daily_tasks', JSON.stringify(state.tasks));
            localStorage.setItem('adhkar_tasks_date', todayStr);
          } catch (e) {}
        }

        try {
          localStorage.setItem('adhkar_tasks_history', JSON.stringify(state.tasksHistory));
        } catch (e) {}

        if (nextCompleted) {
          playCompletionChime();
          triggerVibration(30);
        } else {
          playTapBeep();
          triggerVibration(15);
        }

        updateTabsUI();
        renderTasksView();
        renderProgressView();
      }

      document.addEventListener('click', function(e) {
        const backBtn = e.target.closest('#backToCategoriesBtn');
        if (backBtn) {
          e.stopPropagation();
          closeCategoryView();
          return;
        }

        const featuredBanner = e.target.closest('#featuredCategoryBanner');
        if (featuredBanner) {
          e.stopPropagation();
          openCategoryView(getRecommendedTabByHour());
          return;
        }

        const toggleTransBtn = e.target.closest('[data-toggle-translation]');
        if (toggleTransBtn) {
          e.stopPropagation();
          const itemId = toggleTransBtn.dataset.toggleTranslation;
          const nextOpen = !state.expandedTranslations[itemId];
          state.expandedTranslations[itemId] = nextOpen;
          toggleTransBtn.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
          const labelEl = toggleTransBtn.querySelector('.translation-btn-label');
          if (labelEl) {
            labelEl.textContent = nextOpen
              ? 'Hide Translation / അർത്ഥം മറയ്ക്കുക'
              : 'View Translation / അർത്ഥം കാണുക';
          }
          const chevronEl = toggleTransBtn.querySelector('.translation-chevron');
          if (chevronEl) {
            chevronEl.classList.toggle('rotate-180', nextOpen);
          }
          const panelEl = document.getElementById('trans-panel-' + itemId);
          if (panelEl) {
            panelEl.classList.toggle('hidden', !nextOpen);
          }
          return;
        }

        const jumpCatBtn = e.target.closest('[data-jump-category]');
        if (jumpCatBtn) {
          e.stopPropagation();
          const targetCat = jumpCatBtn.dataset.jumpCategory;
          const targetItemId = jumpCatBtn.dataset.jumpItem;
          state.searchQuery = '';
          state.filterMode = 'all';
          if (els.searchInput) els.searchInput.value = '';
          if (els.clearSearchBtn) els.clearSearchBtn.classList.add('hidden');
          openCategoryView(targetCat, \`.adhkar-card[data-id="\${targetItemId}"]\`);
          return;
        }

        const jumpAuditBtn = e.target.closest('[data-jump-audit]');
        if (jumpAuditBtn) {
          e.stopPropagation();
          openCategoryView('progress');
          return;
        }

        const streakPillarBtn = e.target.closest('[data-streak-pillar-jump]');
        if (streakPillarBtn) {
          e.stopPropagation();
          const targetPillar = streakPillarBtn.dataset.streakPillarJump;
          closeStreakModal();
          openCategoryView(targetPillar);
          return;
        }

        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
          e.stopPropagation();
          openCategoryView(tabBtn.dataset.tab);
          return;
        }

        // Tasks interactions
        const toggleAuditDayBtn = e.target.closest('[data-toggle-audit-day]');
        if (toggleAuditDayBtn) {
          toggleAuditDayById(toggleAuditDayBtn.dataset.toggleAuditDay, toggleAuditDayBtn.dataset.auditDate);
          return;
        }

        const toggleTaskBtn = e.target.closest('[data-toggle-task]');
        if (toggleTaskBtn) {
          toggleTaskById(toggleTaskBtn.dataset.toggleTask);
          renderProgressView();
          return;
        }

        const toggleSubBtn = e.target.closest('[data-toggle-subtask]');
        if (toggleSubBtn) {
          toggleSubtaskById(toggleSubBtn.dataset.toggleSubtask, toggleSubBtn.dataset.subtaskId);
          renderProgressView();
          return;
        }

        const toggleVirtueBtn = e.target.closest('[data-toggle-virtue]');
        if (toggleVirtueBtn) {
          const vId = toggleVirtueBtn.dataset.toggleVirtue;
          state.expandedTaskVirtueId = state.expandedTaskVirtueId === vId ? null : vId;
          renderTasksView();
          return;
        }

        const deleteTaskBtn = e.target.closest('[data-delete-task]');
        if (deleteTaskBtn) {
          const delId = deleteTaskBtn.dataset.deleteTask;
          state.tasks = state.tasks.filter(t => t.id !== delId);
          saveTasksState();
          updateTabsUI();
          renderTasksView();
          renderProgressView();
          return;
        }

        const taskStatusBtn = e.target.closest('.task-status-btn');
        if (taskStatusBtn) {
          state.taskStatusFilter = taskStatusBtn.dataset.taskStatus;
          document.querySelectorAll('.task-status-btn').forEach(b => {
            if (b.dataset.taskStatus === state.taskStatusFilter) {
              b.className = 'task-status-btn px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-[#0d5c3a] text-white';
            } else {
              b.className = 'task-status-btn px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
            }
          });
          renderTasksView();
          return;
        }

        const taskCatBtn = e.target.closest('.task-cat-btn');
        if (taskCatBtn) {
          state.taskCategoryFilter = taskCatBtn.dataset.taskCat;
          document.querySelectorAll('.task-cat-btn').forEach(b => {
            if (b.dataset.taskCat === state.taskCategoryFilter) {
              b.className = 'task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-[#0d5c3a] text-white border-[#0d5c3a] shadow-xs';
            } else {
              b.className = 'task-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800';
            }
          });
          renderTasksView();
          return;
        }

        const auditFilterChip = e.target.closest('.audit-filter-chip');
        if (auditFilterChip) {
          state.auditFilter = auditFilterChip.dataset.auditFilter;
          renderProgressView();
          return;
        }

        const countBtn = e.target.closest('.count-btn');
        if (countBtn) {
          e.stopPropagation();
          handleCount(countBtn.dataset.id);
          return;
        }

        if (state.settings.cardTapToCount) {
          const card = e.target.closest('.adhkar-card');
          if (card && !e.target.closest('button') && !e.target.closest('summary') && !e.target.closest('details')) {
            handleCount(card.dataset.id);
            return;
          }
        }

        const favBtn = e.target.closest('.fav-btn');
        if (favBtn) {
          e.stopPropagation();
          const id = favBtn.dataset.id;
          if (state.favorites.includes(id)) {
            state.favorites = state.favorites.filter(f => f !== id);
          } else {
            state.favorites.push(id);
          }
          saveState();
          renderCards();
          updateTabsUI();
          return;
        }

        const shareImgBtn = e.target.closest('.share-img-btn');
        if (shareImgBtn) {
          e.stopPropagation();
          const id = shareImgBtn.dataset.id;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            generateAndShareFadheelathCard(item);
          }
          return;
        }

        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
          e.stopPropagation();
          const id = copyBtn.dataset.id;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const textToCopy = item.arabic + '\\n\\n' + (item.transliteration ? item.transliteration + '\\n\\n' : '') + item.translation + '\\n\\n' + (item.malayalamTranslation || '') + '\\n\\n' + (item.source || '');
            navigator.clipboard.writeText(textToCopy);
            copyBtn.innerHTML = '<span class="text-xs text-emerald-600 font-bold">Copied!</span>';
            setTimeout(() => { renderCards(); }, 1500);
          }
          return;
        }

        const autoplayBtn = e.target.closest('#autoplayAllBtn');
        if (autoplayBtn) {
          e.stopPropagation();
          if (state.autoplayActive) {
            stopAutoplayAll();
          } else {
            startAutoplayAll();
          }
          return;
        }

        const pronounceBtn = e.target.closest('.pronounce-btn');
        if (pronounceBtn) {
          e.stopPropagation();
          const id = pronounceBtn.dataset.id;
          playItem(id);
          return;
        }

        const timerToggleBtn = e.target.closest('[data-timer-toggle]');
        if (timerToggleBtn) {
          e.stopPropagation();
          const id = timerToggleBtn.dataset.timerToggle;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const tState = getCardTimerState(item);
            if (tState.finished || tState.remaining <= 0) {
              tState.remaining = tState.duration;
              tState.finished = false;
              tState.running = true;
            } else {
              tState.running = !tState.running;
            }
            renderCards();
          }
          return;
        }

        const timerResetBtn = e.target.closest('[data-timer-reset]');
        if (timerResetBtn) {
          e.stopPropagation();
          const id = timerResetBtn.dataset.timerReset;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const tState = getCardTimerState(item);
            tState.running = false;
            tState.finished = false;
            tState.remaining = tState.duration;
            renderCards();
          }
          return;
        }

        const timerPresetsToggleBtn = e.target.closest('[data-timer-presets-toggle]');
        if (timerPresetsToggleBtn) {
          e.stopPropagation();
          const id = timerPresetsToggleBtn.dataset.timerPresetsToggle;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const tState = getCardTimerState(item);
            tState.showPresets = !tState.showPresets;
            renderCards();
          }
          return;
        }

        const timerPresetBtn = e.target.closest('[data-timer-preset]');
        if (timerPresetBtn) {
          e.stopPropagation();
          const id = timerPresetBtn.dataset.timerPreset;
          const sec = parseInt(timerPresetBtn.dataset.sec, 10) || 60;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const tState = getCardTimerState(item);
            tState.running = false;
            tState.finished = false;
            tState.duration = sec;
            tState.remaining = sec;
            renderCards();
          }
          return;
        }

        const timerAdjustBtn = e.target.closest('[data-timer-adjust]');
        if (timerAdjustBtn) {
          e.stopPropagation();
          const id = timerAdjustBtn.dataset.timerAdjust;
          const delta = parseInt(timerAdjustBtn.dataset.delta, 10) || 0;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item) {
            const tState = getCardTimerState(item);
            const nextSec = Math.max(15, Math.min(1800, tState.duration + delta));
            tState.running = false;
            tState.finished = false;
            tState.duration = nextSec;
            tState.remaining = nextSec;
            renderCards();
          }
          return;
        }

        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
          state.filterMode = filterBtn.dataset.filter;
          document.querySelectorAll('.filter-btn').forEach(b => {
            if (b.dataset.filter === state.filterMode) {
              b.className = 'filter-btn px-2.5 py-1 rounded-md font-extrabold bg-[#0d5c3a] text-white border border-[#0d5c3a]';
            } else {
              b.className = 'filter-btn px-2.5 py-1 rounded-md font-bold text-black dark:text-slate-200 hover:bg-slate-200/70';
            }
          });
          renderCards();
          return;
        }

        const chip = e.target.closest('.tasbih-chip');
        if (chip) {
          const id = chip.dataset.tasbihPreset;
          state.tasbih.currentDhikrId = id;
          const preset = window.ADHKAR_DATA.tasbihPresets.find(p => p.id === id);
          if (preset) {
            state.tasbih.target = preset.target;
            state.tasbih.count = 0;
          }
          document.querySelectorAll('.tasbih-chip').forEach(c => {
            if (c.dataset.tasbihPreset === id) {
              c.className = 'tasbih-chip px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-[#0d5c3a] text-white border border-[#0d5c3a] shadow-xs cursor-pointer';
            } else {
              c.className = 'tasbih-chip px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer';
            }
          });
          renderTasbihView();
          return;
        }

        const fontOpt = e.target.closest('.font-size-opt');
        if (fontOpt) {
          state.settings.arabicFontSize = fontOpt.dataset.fontsize;
          saveState();
          document.querySelectorAll('.font-size-opt').forEach(f => {
            if (f.dataset.fontsize === state.settings.arabicFontSize) {
              f.className = 'font-size-opt py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-2 ring-teal-600/20 text-center text-xs';
            } else {
              f.className = 'font-size-opt py-2 px-3 rounded-xl border border-slate-200 text-center text-xs';
            }
          });
          renderCards();
          return;
        }

        const langOpt = e.target.closest('.lang-opt');
        if (langOpt) {
          state.settings.translationLanguage = langOpt.dataset.lang;
          saveState();
          document.querySelectorAll('.lang-opt').forEach(l => {
            if (l.dataset.lang === state.settings.translationLanguage) {
              l.className = 'lang-opt py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-2 ring-teal-600/20 text-xs';
            } else {
              l.className = 'lang-opt py-2 px-3 rounded-xl border border-slate-200 text-xs';
            }
          });
          renderCards();
          return;
        }

        const themeChoice = e.target.closest('.theme-choice');
        if (themeChoice) {
          updateTheme(themeChoice.dataset.theme);
          return;
        }
      });

      // Tasks & Progress audit header & modal listeners
      els.auditPeriodWeekBtn.addEventListener('click', function() {
        state.auditPeriod = 'week';
        renderProgressView();
      });

      els.auditPeriodMonthBtn.addEventListener('click', function() {
        state.auditPeriod = 'month';
        renderProgressView();
      });

      els.taskSearchInput.addEventListener('input', function() {
        state.taskSearchQuery = this.value;
        els.clearTaskSearchBtn.classList.toggle('hidden', !this.value);
        renderTasksView();
      });

      els.clearTaskSearchBtn.addEventListener('click', function() {
        els.taskSearchInput.value = '';
        state.taskSearchQuery = '';
        els.clearTaskSearchBtn.classList.add('hidden');
        renderTasksView();
      });

      if (els.completeAllCategoryBtn) {
        els.completeAllCategoryBtn.addEventListener('click', function() {
          const items = getActiveItems();
          if (!items || items.length === 0) return;
          items.forEach(function(item) {
            state.counts[item.id] = item.target;
          });
          saveState();
          recalculateDynamicStreak();
          renderStreakBadge();
          renderCards();
          updateTabsUI();
          triggerCompletionOverlay(state.activeTab);
        });
      }

      if (els.resetCurrentCategoryBtn) {
        els.resetCurrentCategoryBtn.addEventListener('click', function() {
          const items = getActiveItems();
          if (!items || items.length === 0) return;
          items.forEach(function(item) {
            delete state.counts[item.id];
          });
          saveState();
          recalculateDynamicStreak();
          renderStreakBadge();
          renderCards();
          updateTabsUI();
        });
      }

      els.completeAllTasksBtn.addEventListener('click', function() {
        state.tasks = state.tasks.map(t => ({
          ...t,
          completed: true,
          subtasks: t.subtasks ? t.subtasks.map(s => ({ ...s, completed: true })) : undefined
        }));
        saveTasksState();
        updateTabsUI();
        renderTasksView();
        triggerCompletionOverlay('tasks');
      });

      els.resetAllTasksBtn.addEventListener('click', function() {
        state.tasks = state.tasks.map(t => ({
          ...t,
          completed: false,
          subtasks: t.subtasks ? t.subtasks.map(s => ({ ...s, completed: false })) : undefined
        }));
        saveTasksState();
        updateTabsUI();
        renderTasksView();
      });

      els.openAddTaskModalBtn.addEventListener('click', function() {
        els.addTaskModal.classList.remove('hidden');
      });

      els.closeAddTaskModalBtn.addEventListener('click', function() {
        els.addTaskModal.classList.add('hidden');
      });

      els.cancelAddTaskBtn.addEventListener('click', function() {
        els.addTaskModal.classList.add('hidden');
      });

      els.saveCustomTaskBtn.addEventListener('click', function() {
        const title = els.customTaskTitleInput.value.trim();
        if (!title) return;
        const newTask = {
          id: 'custom-' + Date.now(),
          title: title,
          malayalamTitle: els.customTaskMalayalamInput.value.trim() || undefined,
          arabicTitle: els.customTaskArabicInput.value.trim() || undefined,
          category: 'custom',
          completed: false,
          isCustom: true
        };
        state.tasks.push(newTask);
        els.customTaskTitleInput.value = '';
        els.customTaskMalayalamInput.value = '';
        els.customTaskArabicInput.value = '';
        els.addTaskModal.classList.add('hidden');
        saveTasksState();
        updateTabsUI();
        renderTasksView();
      });

      // Google Calendar Intent helper
      function openGoogleCalendarAlarm(title, description, timeStr) {
        const parts = (timeStr || '05:30').split(':');
        const h = parseInt(parts[0], 10) || 5;
        const m = parseInt(parts[1], 10) || 30;
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
        if (start.getTime() < now.getTime()) {
          start.setDate(start.getDate() + 1);
        }
        const end = new Date(start.getTime() + 15 * 60 * 1000);
        function fmt(d) {
          return d.getFullYear() +
            String(d.getMonth() + 1).padStart(2, '0') +
            String(d.getDate()).padStart(2, '0') + 'T' +
            String(d.getHours()).padStart(2, '0') +
            String(d.getMinutes()).padStart(2, '0') + '00';
        }
        const appUrl = 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/';
        const fullDetails = description + '\\n\\nOpen App: ' + appUrl;
        const calUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
          '&text=' + encodeURIComponent(title) +
          '&details=' + encodeURIComponent(fullDetails) +
          '&dates=' + fmt(start) + '/' + fmt(end) +
          '&recur=' + encodeURIComponent('RRULE:FREQ=DAILY');
        const a = document.createElement('a');
        a.href = calUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      if (els.googleCalMorningBtn) {
        els.googleCalMorningBtn.addEventListener('click', function() {
          openGoogleCalendarAlarm(
            'Daily Adhkar - രാവിലെത്തെ ദിക്റുകൾ 🌅',
            'പ്രഭാത ദിക്റുകൾ ചൊല്ലാൻ സമയമായി (Time for Morning Adhkar - Hisn al-Muslim).',
            state.settings.morningReminderTime || '05:30'
          );
        });
      }

      if (els.googleCalEveningBtn) {
        els.googleCalEveningBtn.addEventListener('click', function() {
          openGoogleCalendarAlarm(
            'Daily Adhkar - വൈകുന്നേരത്തെ ദിക്റുകൾ 🌇',
            'വൈകുന്നേരത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി (Time for Evening Adhkar - Hisn al-Muslim).',
            state.settings.eveningReminderTime || '17:30'
          );
        });
      }

      els.tasbihLargeBtn.addEventListener('click', function() {
        state.tasbih.count++;
        if (state.tasbih.count === state.tasbih.target) {
          playCompletionChime();
          triggerVibration([60, 40, 60]);
        } else {
          playTapBeep();
          triggerVibration(15);
        }
        renderTasbihView();
      });

      els.tasbihMinusBtn.addEventListener('click', function() {
        if (state.tasbih.count > 0) state.tasbih.count--;
        renderTasbihView();
      });

      els.tasbihResetBtn.addEventListener('click', function() {
        state.tasbih.count = 0;
        renderTasbihView();
      });

      els.tasbihChangeTargetBtn.addEventListener('click', function() {
        const val = prompt('Enter custom target count:', String(state.tasbih.target));
        const num = parseInt(val, 10);
        if (!isNaN(num) && num > 0) {
          state.tasbih.target = num;
          renderTasbihView();
        }
      });

      els.soundToggleBtn.addEventListener('click', function() {
        state.settings.soundEnabled = !state.settings.soundEnabled;
        saveState();
        els.soundIcon.textContent = state.settings.soundEnabled ? '🔊' : '🔇';
        els.toggleSoundSetting.checked = state.settings.soundEnabled;
      });

      els.themeToggleBtn.addEventListener('click', function() {
        const nextTheme = state.settings.theme === 'emerald' ? 'dark' : (state.settings.theme === 'dark' ? 'midnight' : 'emerald');
        updateTheme(nextTheme);
      });

      function syncSettingsModalUI() {
        els.toggleTranslit.checked = state.settings.showTransliteration;
        els.toggleTrans.checked = state.settings.showTranslation;
        els.toggleVirtues.checked = state.settings.showVirtues;
        els.toggleSoundSetting.checked = state.settings.soundEnabled;
        els.toggleVibrate.checked = state.settings.vibrateEnabled;
        els.toggleCardTap.checked = state.settings.cardTapToCount;

        if (els.toggleFocusTimerBtn && els.toggleFocusTimerKnob) {
          const isFocusOn = Boolean(state.settings.showFocusTimer);
          els.toggleFocusTimerBtn.setAttribute('aria-checked', isFocusOn ? 'true' : 'false');
          els.toggleFocusTimerBtn.className = 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ' + (isFocusOn ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700');
          els.toggleFocusTimerKnob.className = 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ' + (isFocusOn ? 'translate-x-5' : 'translate-x-0');
        }

        if (els.toggleRemindersSwitchBtn && els.toggleRemindersSwitchKnob && els.remindersConfigPanel) {
          const isRemOn = Boolean(state.settings.remindersEnabled);
          els.toggleRemindersSwitchBtn.setAttribute('aria-checked', isRemOn ? 'true' : 'false');
          els.toggleRemindersSwitchBtn.className = 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ' + (isRemOn ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700');
          els.toggleRemindersSwitchKnob.className = 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ' + (isRemOn ? 'translate-x-5' : 'translate-x-0');
          els.remindersConfigPanel.classList.toggle('hidden', !isRemOn);
        }

        if (els.morningReminderInput) els.morningReminderInput.value = state.settings.morningReminderTime || '06:00';
        if (els.eveningReminderInput) els.eveningReminderInput.value = state.settings.eveningReminderTime || '17:30';
        if (els.sleepReminderInput) els.sleepReminderInput.value = state.settings.sleepReminderTime || '22:00';

        document.querySelectorAll('.reminder-preset-btn').forEach(function(btn) {
          const period = btn.dataset.period;
          const timeVal = btn.dataset.time;
          const currentVal = period === 'morning'
            ? (state.settings.morningReminderTime || '06:00')
            : period === 'evening'
              ? (state.settings.eveningReminderTime || '17:30')
              : (state.settings.sleepReminderTime || '22:00');
          const activeColor = period === 'morning' ? 'bg-amber-600' : (period === 'evening' ? 'bg-indigo-600' : 'bg-purple-600');
          if (currentVal === timeVal) {
            btn.className = 'reminder-preset-btn px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ' + activeColor + ' text-white';
          } else {
            btn.className = 'reminder-preset-btn px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
          }
        });

        if (els.toggleGoalReminderBtn && els.toggleGoalReminderKnob && els.goalReminderTimeRow) {
          const isGoalOn = Boolean(state.settings.goalReminderEnabled);
          els.toggleGoalReminderBtn.setAttribute('aria-checked', isGoalOn ? 'true' : 'false');
          els.toggleGoalReminderBtn.className = 'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ' + (isGoalOn ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700');
          els.toggleGoalReminderKnob.className = 'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ' + (isGoalOn ? 'translate-x-4' : 'translate-x-0');
          els.goalReminderTimeRow.classList.toggle('hidden', !isGoalOn);
        }
        if (els.goalReminderInput) els.goalReminderInput.value = state.settings.goalReminderTime || '21:00';
      }

      els.openSettingsBtn.addEventListener('click', function() {
        syncSettingsModalUI();
        els.settingsModal.classList.remove('hidden');
      });

      els.closeSettingsBtn.addEventListener('click', function() {
        els.settingsModal.classList.add('hidden');
      });

      els.settingsModal.addEventListener('click', function(e) {
        if (e.target === els.settingsModal) els.settingsModal.classList.add('hidden');
      });

      els.streakBtn.addEventListener('click', function() {
        openStreakModal(false);
      });

      els.closeStreakModalBtn.addEventListener('click', function() {
        closeStreakModal();
      });

      if (els.closeStreakModalTopBtn) {
        els.closeStreakModalTopBtn.addEventListener('click', function() {
          closeStreakModal();
        });
      }

      els.streakModal.addEventListener('click', function(e) {
        if (e.target === els.streakModal) closeStreakModal();
      });

      if (els.completionOverlay) {
        els.completionOverlay.addEventListener('click', function(e) {
          e.stopPropagation();
          dismissCompletionOverlay(true);
        });
      }

      els.searchInput.addEventListener('input', function() {
        state.searchQuery = this.value;
        els.clearSearchBtn.classList.toggle('hidden', !this.value);
        renderCards();
      });

      els.clearSearchBtn.addEventListener('click', function() {
        els.searchInput.value = '';
        state.searchQuery = '';
        els.clearSearchBtn.classList.add('hidden');
        renderCards();
      });

      els.toggleTranslit.addEventListener('change', function() {
        state.settings.showTransliteration = this.checked;
        saveState();
        renderCards();
      });
      els.toggleTrans.addEventListener('change', function() {
        state.settings.showTranslation = this.checked;
        saveState();
        renderCards();
      });
      els.toggleVirtues.addEventListener('change', function() {
        state.settings.showVirtues = this.checked;
        saveState();
        renderCards();
      });
      els.toggleSoundSetting.addEventListener('change', function() {
        state.settings.soundEnabled = this.checked;
        saveState();
        els.soundIcon.textContent = this.checked ? '🔊' : '🔇';
      });
      els.toggleVibrate.addEventListener('change', function() {
        state.settings.vibrateEnabled = this.checked;
        saveState();
      });
      els.toggleCardTap.addEventListener('change', function() {
        state.settings.cardTapToCount = this.checked;
        saveState();
      });

      if (els.toggleFocusTimerBtn) {
        els.toggleFocusTimerBtn.addEventListener('click', function() {
          const nextVal = !Boolean(state.settings.showFocusTimer);
          state.settings.showFocusTimer = nextVal;
          try {
            localStorage.setItem('adhkar_show_focus_timer', String(nextVal));
          } catch (e) {}
          saveState();
          syncSettingsModalUI();
          renderCards();
        });
      }

      // Service Worker + Native Notification + In-App Toast + Audio Chime Engine (kept 100% active)
      async function registerReminderServiceWorker() {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
        try {
          const existing = await navigator.serviceWorker.getRegistration('/adhkar-reminder-sw.js');
          if (existing) return existing;
          return await navigator.serviceWorker.register('/adhkar-reminder-sw.js');
        } catch (err) {
          return null;
        }
      }

      async function dispatchMobileSafeNotification(title, body, tag) {
        if (state.settings.soundEnabled !== false) {
          playCompletionChime();
        }
        if (state.settings.vibrateEnabled !== false) {
          triggerVibration([60, 40, 80]);
        }

        let deliveredViaSW = false;
        let deliveredViaNative = false;

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          if ('serviceWorker' in navigator) {
            try {
              await registerReminderServiceWorker();
              const swReadyWithTimeout = Promise.race([
                navigator.serviceWorker.ready,
                new Promise(function(_, reject) {
                  setTimeout(function() { reject(new Error('SW ready timeout (500ms)')); }, 500);
                })
              ]);
              const reg = await swReadyWithTimeout;
              if (reg && typeof reg.showNotification === 'function') {
                await Promise.race([
                  reg.showNotification(title, {
                    body: body,
                    tag: tag,
                    renotify: true,
                    requireInteraction: false
                  }),
                  new Promise(function(_, reject) {
                    setTimeout(function() { reject(new Error('SW showNotification timeout (500ms)')); }, 500);
                  })
                ]);
                deliveredViaSW = true;
              }
            } catch (swErr) {
              deliveredViaSW = false;
            }
          }

          if (!deliveredViaSW) {
            try {
              new Notification(title, { body: body, tag: tag });
              deliveredViaNative = true;
            } catch (nativeErr) {
              deliveredViaNative = false;
            }
          }
        }

        if (els.inAppNotificationToast && els.inAppToastTitle && els.inAppToastBody) {
          els.inAppToastTitle.textContent = title;
          els.inAppToastBody.textContent = body;
          els.inAppNotificationToast.classList.remove('hidden');
        }

        return { deliveredViaSW: deliveredViaSW, deliveredViaNative: deliveredViaNative };
      }

      if (els.closeInAppToastBtn && els.inAppNotificationToast) {
        els.closeInAppToastBtn.addEventListener('click', function() {
          els.inAppNotificationToast.classList.add('hidden');
        });
      }

      if (els.toggleRemindersSwitchBtn) {
        els.toggleRemindersSwitchBtn.addEventListener('click', async function() {
          const nextState = !Boolean(state.settings.remindersEnabled);
          if (nextState && typeof window !== 'undefined' && 'Notification' in window) {
            try {
              await registerReminderServiceWorker();
              if (Notification.permission === 'default') {
                await Notification.requestPermission();
              }
            } catch (e) {}
          }
          state.settings.remindersEnabled = nextState;
          saveState();
          syncSettingsModalUI();
        });
      }

      if (els.morningReminderInput) {
        els.morningReminderInput.addEventListener('change', function() {
          state.settings.morningReminderTime = this.value || '06:00';
          saveState();
          syncSettingsModalUI();
        });
      }
      if (els.eveningReminderInput) {
        els.eveningReminderInput.addEventListener('change', function() {
          state.settings.eveningReminderTime = this.value || '17:30';
          saveState();
          syncSettingsModalUI();
        });
      }
      if (els.sleepReminderInput) {
        els.sleepReminderInput.addEventListener('change', function() {
          state.settings.sleepReminderTime = this.value || '22:00';
          saveState();
          syncSettingsModalUI();
        });
      }

      document.querySelectorAll('.reminder-preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const period = this.dataset.period;
          const timeVal = this.dataset.time;
          if (period === 'morning') state.settings.morningReminderTime = timeVal;
          else if (period === 'evening') state.settings.eveningReminderTime = timeVal;
          else if (period === 'sleep') state.settings.sleepReminderTime = timeVal;
          saveState();
          syncSettingsModalUI();
        });
      });

      if (els.toggleGoalReminderBtn) {
        els.toggleGoalReminderBtn.addEventListener('click', function() {
          state.settings.goalReminderEnabled = !Boolean(state.settings.goalReminderEnabled);
          saveState();
          syncSettingsModalUI();
        });
      }

      if (els.goalReminderInput) {
        els.goalReminderInput.addEventListener('change', function() {
          state.settings.goalReminderTime = this.value || '21:00';
          saveState();
          syncSettingsModalUI();
        });
      }

      if (els.sendTestNotificationBtn) {
        els.sendTestNotificationBtn.addEventListener('click', async function() {
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            try { await Notification.requestPermission(); } catch (e) {}
          }
          await dispatchMobileSafeNotification(
            '🕌 Daily Adhkar Reminder • ദിക്ർ ഓർമ്മപ്പെടുത്തൽ',
            'നോട്ടിഫിക്കേഷൻ അയച്ചു! (Notification Sent!) Remember Allah in the morning and evening.',
            'adhkar-test-' + Date.now()
          );
          if (els.testNotificationFeedback) {
            els.testNotificationFeedback.textContent = '✓ നോട്ടിഫിക്കേഷൻ അയച്ചു! (Notification Sent!)';
            els.testNotificationFeedback.classList.remove('hidden');
            setTimeout(function() {
              els.testNotificationFeedback.classList.add('hidden');
            }, 5000);
          }
        });
      }

      if (els.testCatchUpBtn) {
        els.testCatchUpBtn.addEventListener('click', async function() {
          await dispatchMobileSafeNotification(
            '☀️ കാച്ച്-അപ്പ് ഓർമ്മപ്പെടുത്തൽ • Adhkar Catch-Up',
            'നിങ്ങളുടെ ദിക്റുകൾ ചൊല്ലാൻ മറക്കരുത്! (Don\\'t forget to complete your daily adhkar!)',
            'adhkar-catchup-test-' + Date.now()
          );
          if (els.testNotificationFeedback) {
            els.testNotificationFeedback.textContent = '✓ നോട്ടിഫിക്കേഷൻ അയച്ചു! (Catch-Up Notification Sent!)';
            els.testNotificationFeedback.classList.remove('hidden');
            setTimeout(function() {
              els.testNotificationFeedback.classList.add('hidden');
            }, 5000);
          }
        });
      }

      function downloadCurrentSingleFile() {
        const htmlContent = '<!DOCTYPE html>\\n' + document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'daily-adhkar-single-file.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // 9. Instant 9:16 Fadheelath Image Card Generator & One-Tap WhatsApp Sharing
      const SHARED_APP_URL = 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/';

      function wrapCanvasText(ctx, text, maxWidth) {
        if (!text || !text.trim()) return [];
        const paragraphs = text.split(/\\n+/);
        const lines = [];
        for (const para of paragraphs) {
          const words = para.trim().split(/\\s+/).filter(Boolean);
          if (words.length === 0) continue;
          let currentLine = words[0];
          for (let i = 1; i < words.length; i++) {
            const candidate = currentLine + ' ' + words[i];
            if (ctx.measureText(candidate).width <= maxWidth) {
              currentLine = candidate;
            } else {
              lines.push(currentLine);
              currentLine = words[i];
            }
          }
          lines.push(currentLine);
        }
        return lines;
      }

      function drawCanvasRoundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      function drawCanvasOctagram(ctx, cx, cy, r) {
        ctx.save();
        ctx.translate(cx, cy);
        for (let rot = 0; rot < 2; rot++) {
          ctx.save();
          ctx.rotate((rot * Math.PI) / 4);
          ctx.strokeRect(-r / 1.4, -r / 1.4, (r * 2) / 1.4, (r * 2) / 1.4);
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      async function generateAndShareFadheelathCard(item) {
        try {
          if (document.fonts && document.fonts.ready) {
            await Promise.race([
              document.fonts.ready,
              new Promise(r => setTimeout(r, 700))
            ]);
          }
        } catch (err) {}

        const canvas = document.createElement('canvas');
        const W = 1080;
        const H = 1920;
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');

        // 1. Deep Emerald Green Background (#0d2818)
        ctx.fillStyle = '#0d2818';
        ctx.fillRect(0, 0, W, H);

        const bgGrad = ctx.createRadialGradient(W / 2, H * 0.35, 60, W / 2, H * 0.5, W * 0.95);
        bgGrad.addColorStop(0, 'rgba(22, 66, 41, 0.92)');
        bgGrad.addColorStop(0.65, 'rgba(13, 40, 24, 0.98)');
        bgGrad.addColorStop(1, '#07170e');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Subtle Islamic geometric watermark pattern
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 185, 107, 0.05)';
        ctx.fillStyle = 'rgba(224, 185, 107, 0.05)';
        ctx.lineWidth = 1.5;
        for (let gx = 120; gx < W; gx += 210) {
          for (let gy = 140; gy < H; gy += 210) {
            drawCanvasOctagram(ctx, gx, gy, 42);
          }
        }
        ctx.restore();

        // 2. Outer & Inner Gold Borders (#e0b96b)
        const outerPad = 38;
        const innerPad = 54;
        ctx.strokeStyle = '#e0b96b';
        ctx.lineWidth = 3.5;
        drawCanvasRoundRect(ctx, outerPad, outerPad, W - outerPad * 2, H - outerPad * 2, 34);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(224, 185, 107, 0.45)';
        ctx.lineWidth = 1.6;
        drawCanvasRoundRect(ctx, innerPad, innerPad, W - innerPad * 2, H - innerPad * 2, 26);
        ctx.stroke();

        const corners = [
          [outerPad + 24, outerPad + 24],
          [W - outerPad - 24, outerPad + 24],
          [outerPad + 24, H - outerPad - 24],
          [W - outerPad - 24, H - outerPad - 24]
        ];
        ctx.strokeStyle = '#e0b96b';
        ctx.fillStyle = '#e0b96b';
        ctx.lineWidth = 2;
        for (const [cx, cy] of corners) {
          drawCanvasOctagram(ctx, cx, cy, 14);
        }

        // 3. Top Header Banner
        let cursorY = 105;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        ctx.fillStyle = '#e0b96b';
        ctx.font = '700 32px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('മുദാവമ (Mudaawama) • Daily Adhkar', W / 2, cursorY);
        cursorY += 50;

        ctx.fillStyle = '#f8e7c1';
        ctx.font = '700 42px "Amiri", "Scheherazade New", serif';
        ctx.fillText('أذكار الصباح والمساء', W / 2, cursorY);
        cursorY += 58;

        const catBadges = {
          morning: '☀️ പ്രഭാത ദിക്റുകൾ • Morning Adhkar',
          evening: '🌙 വൈകുന്നേരത്തെ ദിക്റുകൾ • Evening Adhkar',
          prayer: '✨ നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ • After Prayer',
          sleep: '🌌 ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ • Before Sleep'
        };
        const pillText = (catBadges[item.category] || catBadges.morning) + (item.repeatNote ? ' (' + item.repeatNote + ')' : '');
        ctx.font = '600 22px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        const pillW = Math.min(W - 180, ctx.measureText(pillText).width + 56);
        const pillX = (W - pillW) / 2;
        ctx.fillStyle = 'rgba(224, 185, 107, 0.14)';
        drawCanvasRoundRect(ctx, pillX, cursorY, pillW, 44, 22);
        ctx.fill();
        ctx.strokeStyle = 'rgba(224, 185, 107, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#f5d996';
        ctx.fillText(pillText, W / 2, cursorY + 10);
        cursorY += 64;

        if (item.title && item.title.trim()) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 30px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
          const titleLines = wrapCanvasText(ctx, item.title.trim(), W - 180).slice(0, 2);
          for (const line of titleLines) {
            ctx.fillText(line, W / 2, cursorY);
            cursorY += 40;
          }
          cursorY += 8;
        }

        // Ornamental Gold Divider
        ctx.strokeStyle = 'rgba(224, 185, 107, 0.5)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(140, cursorY);
        ctx.lineTo(W / 2 - 28, cursorY);
        ctx.moveTo(W / 2 + 28, cursorY);
        ctx.lineTo(W - 140, cursorY);
        ctx.stroke();
        ctx.fillStyle = '#e0b96b';
        drawCanvasOctagram(ctx, W / 2, cursorY, 10);
        cursorY += 30;

        // 4. Layout Budget for Arabic, Malayalam & Virtue Box
        const footerHeight = 165;
        const footerTop = H - innerPad - footerHeight - 16;
        const availableBodyH = footerTop - cursorY - 20;
        const contentMaxWidth = W - 180;

        const arabicRaw = (item.arabic || '').trim();
        let arabicFontSize = arabicRaw.length > 500 ? 34 : arabicRaw.length > 300 ? 40 : arabicRaw.length > 160 ? 46 : 54;
        let arabicLineHeight = Math.round(arabicFontSize * 1.68);
        ctx.font = '700 ' + arabicFontSize + 'px "Amiri", "Scheherazade New", serif';
        let arabicLines = wrapCanvasText(ctx, arabicRaw, contentMaxWidth);
        while (arabicLines.length * arabicLineHeight > availableBodyH * 0.43 && arabicFontSize > 26) {
          arabicFontSize -= 3;
          arabicLineHeight = Math.round(arabicFontSize * 1.62);
          ctx.font = '700 ' + arabicFontSize + 'px "Amiri", "Scheherazade New", serif';
          arabicLines = wrapCanvasText(ctx, arabicRaw, contentMaxWidth);
        }
        const maxArabicLines = Math.max(3, Math.floor((availableBodyH * 0.44) / arabicLineHeight));
        if (arabicLines.length > maxArabicLines) {
          arabicLines = arabicLines.slice(0, maxArabicLines);
          arabicLines[arabicLines.length - 1] += ' …';
        }

        const mlRaw = (item.malayalamTranslation || item.malayalam || item.translation || '').trim();
        let mlFontSize = mlRaw.length > 420 ? 23 : mlRaw.length > 240 ? 26 : 29;
        let mlLineHeight = Math.round(mlFontSize * 1.52);
        ctx.font = '500 ' + mlFontSize + 'px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        let mlLines = wrapCanvasText(ctx, mlRaw, contentMaxWidth - 20);
        while (mlLines.length * mlLineHeight > availableBodyH * 0.28 && mlFontSize > 19) {
          mlFontSize -= 2;
          mlLineHeight = Math.round(mlFontSize * 1.48);
          ctx.font = '500 ' + mlFontSize + 'px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
          mlLines = wrapCanvasText(ctx, mlRaw, contentMaxWidth - 20);
        }
        const maxMlLines = Math.max(3, Math.floor((availableBodyH * 0.29) / mlLineHeight));
        if (mlLines.length > maxMlLines) {
          mlLines = mlLines.slice(0, maxMlLines);
          mlLines[mlLines.length - 1] += ' …';
        }

        const virtueRaw = (item.malayalamVirtue || item.virtue || 'ഈ ദിക്ർ പതിവായി ചൊല്ലുന്നത് വഴി അല്ലാഹുവിന്റെ സംരക്ഷണവും മഹത്തായ പ്രതിഫലവും ലഭിക്കുന്നു.').trim();
        let virtueFontSize = virtueRaw.length > 260 ? 22 : 25;
        let virtueLineHeight = Math.round(virtueFontSize * 1.48);
        ctx.font = '600 ' + virtueFontSize + 'px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        let virtueLines = wrapCanvasText(ctx, virtueRaw, contentMaxWidth - 70);
        const maxVirtueLines = 5;
        if (virtueLines.length > maxVirtueLines) {
          virtueLines = virtueLines.slice(0, maxVirtueLines);
          virtueLines[virtueLines.length - 1] += ' …';
        }

        // 5. Render Arabic Block
        const arabicBoxPadY = 24;
        const arabicBoxH = arabicLines.length * arabicLineHeight + arabicBoxPadY * 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        drawCanvasRoundRect(ctx, 84, cursorY, W - 168, arabicBoxH, 24);
        ctx.fill();
        ctx.strokeStyle = 'rgba(224, 185, 107, 0.28)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.save();
        ctx.direction = 'rtl';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 ' + arabicFontSize + 'px "Amiri", "Scheherazade New", serif';
        let arY = cursorY + arabicBoxPadY;
        for (const line of arabicLines) {
          ctx.fillText(line, W / 2, arY);
          arY += arabicLineHeight;
        }
        ctx.restore();
        cursorY += arabicBoxH + 26;

        // 6. Render Malayalam Meaning Section
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e0b96b';
        ctx.font = '700 23px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('അർത്ഥം (Meaning)', W / 2, cursorY);
        cursorY += 36;

        ctx.fillStyle = '#ecfdf5';
        ctx.font = '500 ' + mlFontSize + 'px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        for (const line of mlLines) {
          ctx.fillText(line, W / 2, cursorY);
          cursorY += mlLineHeight;
        }
        cursorY += 26;

        // 7. Highlighted Virtue / Fadheelath Section
        const refText = '📚 Hadith Ref: ' + (item.source || 'Authentic Sunnah');
        ctx.font = '600 20px "Plus Jakarta Sans", "Noto Sans Malayalam", sans-serif';
        const refLines = wrapCanvasText(ctx, refText, contentMaxWidth - 70).slice(0, 2);
        const virtueBoxH = 54 + virtueLines.length * virtueLineHeight + 18 + refLines.length * 28 + 26;
        const virtueBoxY = Math.min(cursorY, footerTop - virtueBoxH - 18);

        const vGrad = ctx.createLinearGradient(84, virtueBoxY, W - 84, virtueBoxY + virtueBoxH);
        vGrad.addColorStop(0, 'rgba(224, 185, 107, 0.18)');
        vGrad.addColorStop(1, 'rgba(18, 58, 36, 0.92)');
        ctx.fillStyle = vGrad;
        drawCanvasRoundRect(ctx, 84, virtueBoxY, W - 168, virtueBoxH, 24);
        ctx.fill();

        ctx.strokeStyle = '#e0b96b';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        let vY = virtueBoxY + 20;
        ctx.fillStyle = '#e0b96b';
        ctx.font = '700 25px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('✨ ഹദീസിലെ ശ്രേഷ്ഠത (Virtue / Fadheelath)', W / 2, vY);
        vY += 40;

        ctx.fillStyle = '#fef3c7';
        ctx.font = '600 ' + virtueFontSize + 'px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        for (const line of virtueLines) {
          ctx.fillText(line, W / 2, vY);
          vY += virtueLineHeight;
        }
        vY += 10;

        ctx.fillStyle = '#e0b96b';
        ctx.font = '600 20px "Plus Jakarta Sans", "Noto Sans Malayalam", sans-serif';
        for (const rLine of refLines) {
          ctx.fillText(rLine, W / 2, vY);
          vY += 28;
        }

        // 8. Bottom Call-to-Action Bar
        ctx.fillStyle = '#07170e';
        drawCanvasRoundRect(ctx, 84, footerTop, W - 168, footerHeight, 24);
        ctx.fill();
        ctx.strokeStyle = '#e0b96b';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f5d996';
        ctx.font = '700 22px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('📲 ഈ ആപ്പ് ഫോണിൽ ലഭിക്കാൻ താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക', W / 2, footerTop + 28);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 22px "Plus Jakarta Sans", monospace';
        ctx.fillText("https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/", W / 2, footerTop + 74);

        ctx.fillStyle = '#e0b96b';
        ctx.font = '600 19px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
        ctx.fillText('മുദാവമ (Mudaawama) • Daily Adhkar', W / 2, footerTop + 116);

        const dataUrl = canvas.toDataURL('image/png');
        const blob = await new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'));
        const fileName = 'mudaawama-' + (item.id || 'adhkar') + '-fadheelath-card.png';
        const shareUrl = "https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/";

        let sharedViaNative = false;
        if (blob && typeof navigator !== 'undefined' && typeof File !== 'undefined') {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                text: shareUrl,
                url: shareUrl
              });
              sharedViaNative = true;
            }
          } catch (err) {
            if (err && err.name === 'AbortError') {
              sharedViaNative = true;
            }
          }
        }

        // Always populate the preview modal and trigger fallback download + clipboard copy of ONLY the URL if native file share didn't complete
        if (!sharedViaNative) {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText("https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/");
            }
          } catch (err) {}

          const dlUrl = blob ? URL.createObjectURL(blob) : dataUrl;
          const a = document.createElement('a');
          a.href = dlUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          if (blob) {
            setTimeout(() => URL.revokeObjectURL(dlUrl), 4000);
          }
        }

        const modalEl = document.getElementById('fadheelathModal');
        const previewImg = document.getElementById('fadheelathPreviewImg');
        const dlLink = document.getElementById('fadheelathDownloadLink');
        const waLink = document.getElementById('fadheelathWhatsappLink');
        const statusMsg = document.getElementById('fadheelathStatusMsg');

        if (previewImg) previewImg.src = dataUrl;
        if (dlLink) {
          dlLink.href = dataUrl;
          dlLink.download = fileName;
        }
        if (waLink) {
          waLink.href = 'https://wa.me/?text=' + encodeURIComponent(shareUrl);
        }
        if (statusMsg) {
          statusMsg.textContent = sharedViaNative
            ? '✓ ഷെയർ ഷീറ്റ് തുറന്നു! വാട്ട്സ്ആപ്പ് സ്റ്റാറ്റസിലോ ഗ്രൂപ്പുകളിലോ പങ്കുവെക്കാം.'
            : '✓ 9:16 ഫളീലത്ത് കാർഡ് ഡൗൺലോഡ് ചെയ്യുകയും ആപ്പ് ലിങ്ക് ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തുകയും ചെയ്തു!';
        }
        if (modalEl) {
          modalEl.classList.remove('hidden');
        }
      }

      const closeFadheelathModalBtn = document.getElementById('closeFadheelathModalBtn');
      const fadheelathModal = document.getElementById('fadheelathModal');
      if (closeFadheelathModalBtn && fadheelathModal) {
        closeFadheelathModalBtn.addEventListener('click', function() {
          fadheelathModal.classList.add('hidden');
        });
        fadheelathModal.addEventListener('click', function(e) {
          if (e.target === fadheelathModal) {
            fadheelathModal.classList.add('hidden');
          }
        });
      }

      if (els.modalDownloadBtn) {
        els.modalDownloadBtn.addEventListener('click', downloadCurrentSingleFile);
      }

      updateTheme(state.settings.theme);
      saveTasksState();
      renderStreakBadge();
      updateTabsUI();
      renderCards();

    })();
  </script>

</body>
</html>
`;
}

/**
 * Triggers in-browser client-side download without contacting any server.
 * Avoids all Cloud Run proxy security cookie issues on Safari / iOS.
 */
export function triggerClientDownload(
  htmlContent: string,
  fileName = 'daily-adhkar-single-file.html'
): boolean {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
    return true;
  } catch (err) {
    console.error('Download failed', err);
    return false;
  }
}

/**
 * Copies the entire standalone HTML code into clipboard.
 * Ideal for iOS Safari where file downloads may be restricted or awkward.
 */
export async function copyHtmlToClipboard(htmlContent: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(htmlContent);
      return true;
    } catch {
      // If writeText is denied by permissions policy or iframe, use textarea fallback
    }
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = htmlContent;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 999999);
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return false;
  }
}
