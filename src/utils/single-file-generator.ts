import {
  MORNING_ADHKAR,
  EVENING_ADHKAR,
  PRAYER_ADHKAR,
  SLEEP_ADHKAR,
  CATEGORIES_CONFIG,
  TASBIH_PRESETS,
} from '../data/adhkarData.ts';

export function generateSingleFileHtml(): string {
  const payloadData = {
    morning: MORNING_ADHKAR,
    evening: EVENING_ADHKAR,
    prayer: PRAYER_ADHKAR,
    sleep: SLEEP_ADHKAR,
    categories: CATEGORIES_CONFIG,
    tasbihPresets: TASBIH_PRESETS,
  };

  const jsonString = JSON.stringify(payloadData);

  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Daily Adhkar (مداومة) - Morning, Evening & Daily Remembrances</title>
  <meta name="description" content="Authentic daily morning and evening adhkar (Ibn Uthaymeen collection), after-prayer remembrances, and digital tasbih with Arabic text, transliteration, English & Malayalam translations. Single-file offline version.">
  <meta name="theme-color" content="#115e59">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Daily Adhkar">
  <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='128' fill='%23115e59'/%3E%3Cpath d='M 280 140 A 120 120 0 1 0 380 340 A 100 100 0 1 1 280 140 Z' fill='%23fbbf24'/%3E%3C/svg%3E">
  
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Malayalam:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS v4 Browser Build -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <style>
    body, button, input, select, textarea {
      font-family: 'Plus Jakarta Sans', 'Noto Sans Malayalam', 'Scheherazade New', system-ui, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .font-arabic {
      font-family: 'Scheherazade New', 'Amiri', 'Traditional Arabic', serif;
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
      background: rgba(13, 148, 136, 0.3);
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
      --bg-main: #0f172a;
      --bg-card: #1e293b;
      --border-card: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    .theme-emerald {
      --bg-main: #f0fdfa;
      --bg-card: #ffffff;
      --border-card: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
    }
  </style>
</head>
<body class="bg-teal-50/50 text-slate-800 antialiased min-h-full flex flex-col theme-transition pb-20 select-none" id="appBody">

  <!-- ================= HEADER ================= -->
  <header class="sticky top-0 z-30 bg-teal-800 text-white shadow-md border-b border-teal-700/60 backdrop-blur-md">
    <div class="max-w-xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">📿</span>
            <h1 class="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Daily Adhkar
            </h1>
            <!-- Streak badge -->
            <button id="streakBtn" class="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 bg-teal-900/90 text-amber-300 border-teal-700/80 hover:bg-teal-950" title="Daily Streak">
              <span>🔥</span>
              <span id="streakCount">0d</span>
            </button>
          </div>
          <p class="text-xs text-teal-200/90 flex items-center gap-1 mt-0.5">
            <span id="headerCategoryLabel">Morning</span>
            <span class="opacity-60">•</span>
            <span id="headerCategoryArabic" class="font-arabic text-sm">أذكار الصباح</span>
          </p>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-1">
          <!-- Standalone offline download button -->
          <button id="downloadHtmlBtn" aria-label="Download standalone HTML file" title="Save offline single-file HTML" class="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
          </button>

          <!-- Sound Mute/Unmute -->
          <button id="soundToggleBtn" aria-label="Toggle Sound" title="Sound" class="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors">
            <span id="soundIcon">🔊</span>
          </button>

          <!-- Theme Toggle -->
          <button id="themeToggleBtn" aria-label="Toggle Theme" title="Theme" class="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors">
            <span id="themeIcon">🌙</span>
          </button>

          <!-- Reset Counters for Category -->
          <button id="resetCategoryBtn" aria-label="Reset Category Counters" title="Reset this category" class="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>

          <!-- Settings -->
          <button id="openSettingsBtn" aria-label="Open Settings" title="Settings" class="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Progress Section -->
      <div id="headerProgressContainer" class="mt-2.5 pt-2 border-t border-teal-700/40">
        <div class="flex items-center justify-between text-xs text-teal-100 mb-1.5">
          <span id="progressStatusText" class="font-medium">Progress: 0 of 23 Completed</span>
          <span id="progressPercentText" class="font-semibold text-amber-300">0%</span>
        </div>
        <div class="w-full bg-teal-950/40 h-2 rounded-full overflow-hidden p-0.5">
          <div id="progressBarFill" class="h-full rounded-full transition-all duration-300 bg-amber-300" style="width: 0%"></div>
        </div>
        <div id="headerTimeHint" class="text-[11px] text-teal-200/80 mt-1 italic">After Fajr prayer until sunrise</div>
      </div>
    </div>
  </header>

  <!-- ================= TABS NAVIGATION ================= -->
  <nav class="sticky top-[86px] z-20 bg-teal-900/95 backdrop-blur-md border-b border-teal-800/80 shadow-sm" aria-label="Adhkar Categories">
    <div class="max-w-xl mx-auto px-2 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5">
      <button data-tab="morning" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer bg-teal-600 text-white shadow-sm">
        <span>☀️</span>
        <span>Morning</span>
        <span class="tab-badge text-[10px] bg-teal-800/80 px-1.5 py-0.2 rounded-full">0/23</span>
      </button>

      <button data-tab="evening" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60">
        <span>🌙</span>
        <span>Evening</span>
        <span class="tab-badge text-[10px] bg-teal-950/60 px-1.5 py-0.2 rounded-full">0/23</span>
      </button>

      <button data-tab="prayer" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60">
        <span>✨</span>
        <span>After Prayer</span>
        <span class="tab-badge text-[10px] bg-teal-950/60 px-1.5 py-0.2 rounded-full">0/7</span>
      </button>

      <button data-tab="sleep" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60">
        <span>🛌</span>
        <span>Sleep</span>
        <span class="tab-badge text-[10px] bg-teal-950/60 px-1.5 py-0.2 rounded-full">0/7</span>
      </button>

      <button data-tab="favorites" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60">
        <span>⭐</span>
        <span>Favorites</span>
        <span class="tab-badge text-[10px] bg-teal-950/60 px-1.5 py-0.2 rounded-full">0</span>
      </button>

      <button data-tab="tasbih" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60">
        <span>📿</span>
        <span>Tasbih</span>
      </button>
    </div>
  </nav>

  <!-- ================= MAIN CONTAINER ================= -->
  <main class="flex-1 max-w-xl w-full mx-auto px-4 py-4 space-y-4">

    <!-- Completion Celebration Banner -->
    <div id="completionBanner" class="hidden p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/40 animate-fade-in">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3">
          <div class="text-3xl">🎉</div>
          <div>
            <h3 class="font-bold text-base">Alhamdulillah! Category Completed</h3>
            <p class="text-xs text-emerald-100 mt-0.5">You have completed all remembrances in this category today. May Allah accept and bless your day!</p>
          </div>
        </div>
        <button id="closeBannerBtn" class="text-emerald-200 hover:text-white p-1">✕</button>
      </div>
    </div>

    <!-- Search & Filter Controls (for list views) -->
    <div id="searchFilterSection" class="space-y-2">
      <div class="relative">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Search Arabic, English, or Malayalam..." 
          class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-teal-200/80 bg-white shadow-xs text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
        >
        <div class="absolute left-3 top-3 text-slate-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button id="clearSearchBtn" class="hidden absolute right-2.5 top-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600">
          ✕
        </button>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-1 text-xs">
        <button data-filter="all" class="filter-btn px-2.5 py-1 rounded-md font-semibold bg-teal-800 text-white">All</button>
        <button data-filter="incomplete" class="filter-btn px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200/70">Incomplete</button>
        <button data-filter="completed" class="filter-btn px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200/70">Completed</button>
      </div>
    </div>

    <!-- Adhkar Cards Container -->
    <div id="adhkarList" class="space-y-4">
      <!-- Cards rendered via JS -->
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
          <circle id="tasbihRingCircle" cx="50" cy="50" r="44" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="transparent" stroke-dasharray="276.46" stroke-dashoffset="276.46" class="text-teal-600 transition-all duration-150" />
        </svg>

        <!-- Tap Button -->
        <button id="tasbihLargeBtn" class="absolute w-52 h-52 rounded-full bg-gradient-to-b from-teal-600 to-teal-800 text-white shadow-xl shadow-teal-700/30 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform border-4 border-teal-500/30 select-none">
          <span class="text-xs font-semibold uppercase tracking-wider text-teal-200">Count</span>
          <span id="tasbihCurrentCount" class="text-5xl font-black font-mono tracking-tight my-1">0</span>
          <span id="tasbihTargetDisplay" class="text-xs text-teal-200/90 font-medium">Target: 33</span>
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
        <button id="tasbihChangeTargetBtn" class="px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all border border-teal-200 cursor-pointer">
          Change Target
        </button>
      </div>

    </div>

    <!-- Empty state (Search or Favorites) -->
    <div id="emptyState" class="hidden text-center py-12 px-4 space-y-3">
      <div class="text-4xl">🔍</div>
      <h3 class="text-base font-semibold text-slate-800">No Remembrances Found</h3>
      <p id="emptyStateMsg" class="text-xs text-slate-500 max-w-xs mx-auto">No adhkar match your active filter or search terms. Try clearing your search.</p>
    </div>

  </main>

  <!-- ================= SETTINGS MODAL ================= -->
  <div id="settingsModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto card-surface">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span> Display & Preferences
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
            <input type="checkbox" id="toggleTranslit" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Show Translations</span>
            <input type="checkbox" id="toggleTrans" checked class="w-4 h-4 text-teal-600 rounded">
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-slate-700 dark:text-slate-300">Show Hadith Virtues & Rewards</span>
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

  <!-- ================= STREAK MODAL ================= -->
  <div id="streakModal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-center space-y-4 card-surface">
      <div class="text-5xl">🔥</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white">Daily Adhkar Streak</h3>
      <p class="text-xs text-slate-600 dark:text-slate-300">Complete all morning, evening, or prayer adhkar each day to keep your spiritual consistency shining.</p>
      
      <div class="grid grid-cols-2 gap-3 py-2">
        <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
          <div class="text-xs font-semibold text-amber-800 dark:text-amber-200">Current Streak</div>
          <div id="modalCurrentStreak" class="text-3xl font-black text-amber-600 mt-1">0 Days</div>
        </div>
        <div class="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50">
          <div class="text-xs font-semibold text-teal-800 dark:text-teal-200">Best Record</div>
          <div id="modalBestStreak" class="text-3xl font-black text-teal-600 mt-1">0 Days</div>
        </div>
      </div>

      <button id="closeStreakModalBtn" class="w-full py-2.5 rounded-xl bg-teal-700 text-white font-semibold cursor-pointer">Got It</button>
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
        showTransliteration: true,
        showTranslation: true,
        translationLanguage: 'both',
        showVirtues: true,
        soundEnabled: true,
        vibrateEnabled: true,
        theme: 'emerald',
        cardTapToCount: false,
      };

      function getTodayString() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      }

      const state = {
        activeTab: 'morning',
        searchQuery: '',
        filterMode: 'all',
        counts: {},
        favorites: [],
        streak: { currentStreak: 0, bestStreak: 0, lastCompletedDate: null },
        settings: { ...DEFAULT_SETTINGS },
        tasbih: {
          currentDhikrId: 'subhanallah',
          count: 0,
          target: 33
        }
      };

      // Load from LocalStorage
      try {
        const savedSettings = localStorage.getItem('adhkar_settings');
        if (savedSettings) state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };

        const savedFavs = localStorage.getItem('adhkar_favorites');
        if (savedFavs) state.favorites = JSON.parse(savedFavs);

        const savedStreak = localStorage.getItem('adhkar_streak_data');
        if (savedStreak) state.streak = JSON.parse(savedStreak);

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
      } catch (e) {}

      // Save Helpers
      function saveState() {
        try {
          localStorage.setItem('adhkar_counts', JSON.stringify(state.counts));
          localStorage.setItem('adhkar_settings', JSON.stringify(state.settings));
          localStorage.setItem('adhkar_favorites', JSON.stringify(state.favorites));
          localStorage.setItem('adhkar_streak_data', JSON.stringify(state.streak));
        } catch (e) {}
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
        resetCategoryBtn: document.getElementById('resetCategoryBtn'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        downloadHtmlBtn: document.getElementById('downloadHtmlBtn'),
        completionBanner: document.getElementById('completionBanner'),
        closeBannerBtn: document.getElementById('closeBannerBtn'),
        searchFilterSection: document.getElementById('searchFilterSection'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        adhkarList: document.getElementById('adhkarList'),
        tasbihView: document.getElementById('tasbihView'),
        emptyState: document.getElementById('emptyState'),
        emptyStateMsg: document.getElementById('emptyStateMsg'),
        // Modals
        settingsModal: document.getElementById('settingsModal'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        modalDownloadBtn: document.getElementById('modalDownloadBtn'),
        streakModal: document.getElementById('streakModal'),
        closeStreakModalBtn: document.getElementById('closeStreakModalBtn'),
        modalCurrentStreak: document.getElementById('modalCurrentStreak'),
        modalBestStreak: document.getElementById('modalBestStreak'),
        // Toggles in settings
        toggleTranslit: document.getElementById('toggleTranslit'),
        toggleTrans: document.getElementById('toggleTrans'),
        toggleVirtues: document.getElementById('toggleVirtues'),
        toggleSoundSetting: document.getElementById('toggleSoundSetting'),
        toggleVibrate: document.getElementById('toggleVibrate'),
        toggleCardTap: document.getElementById('toggleCardTap'),
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

      // 3. Tab Routing by Time of Day
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) {
        state.activeTab = 'morning';
      } else if (hour >= 12 && hour < 20) {
        state.activeTab = 'evening';
      } else {
        state.activeTab = 'sleep';
      }

      // 4. Renderers
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
          ? 'Completed All Today! 🎉'
          : 'Progress: ' + completed + ' of ' + total + ' Completed';
        els.progressPercentText.textContent = percent + '%';
        els.progressBarFill.style.width = percent + '%';
        els.progressBarFill.className = 'h-full rounded-full transition-all duration-300 ' + 
          (isAllDone ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-300');

        if (isAllDone && total > 0) {
          updateStreakOnCategoryDone();
        }
      }

      function updateStreakOnCategoryDone() {
        const today = getTodayString();
        if (state.streak.lastCompletedDate === today) return;

        let nextStreak = 1;
        if (state.streak.lastCompletedDate) {
          const lastDate = new Date(state.streak.lastCompletedDate);
          const currDate = new Date(today);
          const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            nextStreak = (state.streak.currentStreak || 0) + 1;
          }
        }
        state.streak.currentStreak = nextStreak;
        state.streak.bestStreak = Math.max(nextStreak, state.streak.bestStreak || 0);
        state.streak.lastCompletedDate = today;
        saveState();
        renderStreakBadge();
        els.completionBanner.classList.remove('hidden');
        playCompletionChime();
        triggerVibration(100);
      }

      function renderStreakBadge() {
        const today = getTodayString();
        const doneToday = state.streak.lastCompletedDate === today;
        els.streakCount.textContent = (state.streak.currentStreak || 0) + 'd';
        if (doneToday) {
          els.streakBtn.className = 'ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 bg-amber-400 text-teal-950 border-amber-300 shadow-sm';
        } else {
          els.streakBtn.className = 'ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 bg-teal-900/90 text-amber-300 border-teal-700/80 hover:bg-teal-950';
        }
      }

      function updateTheme(theme) {
        state.settings.theme = theme;
        saveState();
        document.documentElement.className = theme === 'midnight' ? 'theme-midnight dark' : (theme === 'dark' ? 'theme-dark dark' : 'theme-emerald');
        els.themeIcon.textContent = theme === 'emerald' ? '🌙' : '☀️';
        
        document.querySelectorAll('.theme-choice').forEach(b => {
          if (b.dataset.theme === theme) {
            b.className = 'theme-choice py-2 px-3 rounded-xl border border-teal-600 bg-teal-50 text-teal-900 font-semibold text-xs ring-2 ring-teal-600/20';
          } else {
            b.className = 'theme-choice py-2 px-3 rounded-xl border border-slate-200 text-xs';
          }
        });
      }

      function updateTabsUI() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
          const t = tab.dataset.tab;
          if (t === state.activeTab) {
            tab.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer bg-teal-600 text-white shadow-sm';
          } else {
            tab.className = 'tab-btn px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white hover:bg-teal-800/60';
          }
        });

        const mItems = window.ADHKAR_DATA.morning;
        let mDone = mItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="morning"] .tab-badge').textContent = mDone + '/' + mItems.length;

        const eItems = window.ADHKAR_DATA.evening;
        let eDone = eItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="evening"] .tab-badge').textContent = eDone + '/' + eItems.length;

        const pItems = window.ADHKAR_DATA.prayer;
        let pDone = pItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="prayer"] .tab-badge').textContent = pDone + '/' + pItems.length;

        const sItems = window.ADHKAR_DATA.sleep;
        let sDone = sItems.filter(i => (state.counts[i.id] || 0) >= i.target).length;
        document.querySelector('[data-tab="sleep"] .tab-badge').textContent = sDone + '/' + sItems.length;

        document.querySelector('[data-tab="favorites"] .tab-badge').textContent = state.favorites.length;

        const catConfig = window.ADHKAR_DATA.categories.find(c => c.key === state.activeTab);
        if (catConfig) {
          els.headerCategoryLabel.textContent = catConfig.label;
          els.headerCategoryArabic.textContent = catConfig.arabicLabel;
          els.headerTimeHint.textContent = catConfig.timeHint;
        } else if (state.activeTab === 'favorites') {
          els.headerCategoryLabel.textContent = 'Favorites';
          els.headerCategoryArabic.textContent = 'الأذكار المفضلة';
          els.headerTimeHint.textContent = 'Your starred supplications for quick access';
        }
      }

      function renderCards() {
        if (state.activeTab === 'tasbih') {
          els.adhkarList.classList.add('hidden');
          els.searchFilterSection.classList.add('hidden');
          els.tasbihView.classList.remove('hidden');
          els.emptyState.classList.add('hidden');
          renderTasbihView();
          return;
        }

        els.adhkarList.classList.remove('hidden');
        els.searchFilterSection.classList.remove('hidden');
        els.tasbihView.classList.add('hidden');

        const items = getActiveItems();
        const query = state.searchQuery.trim().toLowerCase();

        const filtered = items.filter(item => {
          const currentCount = state.counts[item.id] || 0;
          const isDone = currentCount >= item.target;

          if (state.filterMode === 'incomplete' && isDone) return false;
          if (state.filterMode === 'completed' && !isDone) return false;

          if (!query) return true;
          return (
            (item.arabic && item.arabic.toLowerCase().includes(query)) ||
            (item.transliteration && item.transliteration.toLowerCase().includes(query)) ||
            (item.translation && item.translation.toLowerCase().includes(query)) ||
            (item.malayalamTranslation && item.malayalamTranslation.toLowerCase().includes(query)) ||
            (item.virtue && item.virtue.toLowerCase().includes(query)) ||
            (item.malayalamVirtue && item.malayalamVirtue.toLowerCase().includes(query)) ||
            (item.source && item.source.toLowerCase().includes(query))
          );
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

          return \`
            <article class="adhkar-card bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-200 shadow-xs space-y-4 card-surface \${
              isDone ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20' : 'border-slate-200/90 dark:border-slate-800'
            }" data-id="\${item.id}">
              
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                    \${item.uthaymeenNumber ? item.uthaymeenNumber : index + 1}
                  </span>
                  <span class="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    \${item.repeatNote || (item.target + ' time' + (item.target > 1 ? 's' : ''))}
                  </span>
                </div>

                <div class="flex items-center gap-1">
                  <button class="fav-btn p-1.5 rounded-full text-slate-400 hover:text-amber-500 transition-colors" data-id="\${item.id}" title="Toggle Favorite">
                    \${isFav ? '<span class="text-amber-500 text-base">★</span>' : '<span class="text-slate-400 text-base">☆</span>'}
                  </button>

                  <button class="copy-btn p-1.5 rounded-full text-slate-400 hover:text-teal-600 transition-colors" data-id="\${item.id}" title="Copy Dhikr">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                  </button>

                  <button class="count-btn px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-90 \${
                    isDone 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                  }" data-id="\${item.id}">
                    <span>\${isDone ? '✓ Done' : currentCount + ' / ' + item.target}</span>
                  </button>
                </div>
              </div>

              <!-- Audio Pronunciation Bar -->
              <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-teal-50/70 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700/80 my-2">
                <button type="button" class="pronounce-btn px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95" data-id="\${item.id}">
                  <span>🔊 Listen</span>
                  <span class="font-arabic text-[11px] opacity-80">استمع</span>
                </button>
                <span class="text-[11px] text-teal-800 dark:text-teal-300 font-medium">Arabic Pronunciation</span>
              </div>

              <div class="text-right py-1">
                <p class="font-arabic font-bold text-slate-900 dark:text-white \${fontClass} tracking-wide select-text" dir="rtl">
                  \${item.arabic}
                </p>
              </div>

              \${state.settings.showTransliteration && item.transliteration ? \`
                <div class="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100/60 dark:border-teal-900/40 text-xs sm:text-sm text-teal-950 dark:text-teal-200 italic leading-relaxed select-text">
                  \${item.transliteration}
                </div>
              \` : ''}

              \${state.settings.showTranslation ? \`
                <div class="space-y-2 text-xs sm:text-sm">
                  \${showEN && item.translation ? \`
                    <div class="text-slate-700 dark:text-slate-300 leading-relaxed select-text">
                      <span class="font-semibold text-teal-700 dark:text-teal-400 mr-1.5 text-xs">EN:</span>
                      \${item.translation}
                    </div>
                  \` : ''}
                  \${showML && item.malayalamTranslation ? \`
                    <div class="font-malayalam text-slate-700 dark:text-slate-300 leading-relaxed select-text pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span class="font-semibold text-emerald-700 dark:text-emerald-400 mr-1.5 text-xs">മലയാളം:</span>
                      \${item.malayalamTranslation}
                    </div>
                  \` : ''}
                </div>
              \` : ''}

              \${state.settings.showVirtues && (item.virtue || item.source) ? \`
                <details class="group text-xs border-t border-slate-100 dark:border-slate-800 pt-2">
                  <summary class="font-semibold text-teal-700 dark:text-teal-400 cursor-pointer flex items-center justify-between py-1 hover:text-teal-800">
                    <span class="flex items-center gap-1">
                      <span>📖</span>
                      <span>Source & Virtues</span>
                    </span>
                    <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="pt-2 pb-1 space-y-1.5 text-slate-600 dark:text-slate-400 select-text">
                    \${item.source ? \`<div class="font-medium text-teal-800 dark:text-teal-300">\${item.source}</div>\` : ''}
                    \${item.virtue && showEN ? \`<div>\${item.virtue}</div>\` : ''}
                    \${item.malayalamVirtue && showML ? \`<div class="font-malayalam text-emerald-800 dark:text-emerald-300">\${item.malayalamVirtue}</div>\` : ''}
                  </div>
                </details>
              \` : ''}

            </article>
          \`;
        }).join('');

        updateCategoryProgress();
      }

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

        const current = state.counts[id] || 0;
        if (current >= item.target) {
          state.counts[id] = 0;
        } else {
          state.counts[id] = current + 1;
          if (state.counts[id] === item.target) {
            playCompletionChime();
            triggerVibration(50);
          } else {
            playTapBeep();
            triggerVibration(15);
          }
        }
        saveState();
        renderCards();
        updateTabsUI();
      }

      document.addEventListener('click', function(e) {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
          state.activeTab = tabBtn.dataset.tab;
          updateTabsUI();
          renderCards();
          window.scrollTo({ top: 0, behavior: 'smooth' });
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

        const pronounceBtn = e.target.closest('.pronounce-btn');
        if (pronounceBtn) {
          e.stopPropagation();
          const id = pronounceBtn.dataset.id;
          const all = [
            ...window.ADHKAR_DATA.morning,
            ...window.ADHKAR_DATA.evening,
            ...window.ADHKAR_DATA.prayer,
            ...window.ADHKAR_DATA.sleep
          ];
          const item = all.find(i => i.id === id);
          if (item && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = item.arabic.replace(/\s*\([٠-٩\d]+\)\s*/g, ' ').replace(/\n+/g, ' ');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.95;
            pronounceBtn.innerHTML = '<span>⏹️ Playing...</span>';
            utterance.onend = () => { renderCards(); };
            utterance.onerror = () => { renderCards(); };
            window.speechSynthesis.speak(utterance);
          }
          return;
        }

        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
          state.filterMode = filterBtn.dataset.filter;
          document.querySelectorAll('.filter-btn').forEach(b => {
            if (b.dataset.filter === state.filterMode) {
              b.className = 'filter-btn px-2.5 py-1 rounded-md font-semibold bg-teal-800 text-white';
            } else {
              b.className = 'filter-btn px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200/70';
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
              c.className = 'tasbih-chip px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-teal-700 text-white border border-teal-600 shadow-xs cursor-pointer';
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

      els.tasbihLargeBtn.addEventListener('click', function() {
        state.tasbih.count++;
        if (state.tasbih.count === state.tasbih.target) {
          playCompletionChime();
          triggerVibration(60);
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

      els.resetCategoryBtn.addEventListener('click', function() {
        if (confirm('Reset counters for all items in ' + state.activeTab + '?')) {
          const items = getActiveItems();
          items.forEach(i => { state.counts[i.id] = 0; });
          saveState();
          renderCards();
          updateTabsUI();
        }
      });

      els.openSettingsBtn.addEventListener('click', function() {
        els.toggleTranslit.checked = state.settings.showTransliteration;
        els.toggleTrans.checked = state.settings.showTranslation;
        els.toggleVirtues.checked = state.settings.showVirtues;
        els.toggleSoundSetting.checked = state.settings.soundEnabled;
        els.toggleVibrate.checked = state.settings.vibrateEnabled;
        els.toggleCardTap.checked = state.settings.cardTapToCount;
        els.settingsModal.classList.remove('hidden');
      });

      els.closeSettingsBtn.addEventListener('click', function() {
        els.settingsModal.classList.add('hidden');
      });

      els.settingsModal.addEventListener('click', function(e) {
        if (e.target === els.settingsModal) els.settingsModal.classList.add('hidden');
      });

      els.streakBtn.addEventListener('click', function() {
        els.modalCurrentStreak.textContent = (state.streak.currentStreak || 0) + ' Days';
        els.modalBestStreak.textContent = (state.streak.bestStreak || 0) + ' Days';
        els.streakModal.classList.remove('hidden');
      });

      els.closeStreakModalBtn.addEventListener('click', function() {
        els.streakModal.classList.add('hidden');
      });

      els.streakModal.addEventListener('click', function(e) {
        if (e.target === els.streakModal) els.streakModal.classList.add('hidden');
      });

      els.closeBannerBtn.addEventListener('click', function() {
        els.completionBanner.classList.add('hidden');
      });

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

      els.downloadHtmlBtn.addEventListener('click', downloadCurrentSingleFile);
      els.modalDownloadBtn.addEventListener('click', downloadCurrentSingleFile);

      updateTheme(state.settings.theme);
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
