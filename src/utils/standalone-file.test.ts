import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generateSingleFileHtml } from './single-file-generator.ts';

test('generateSingleFileHtml produces valid self-contained HTML5 file', () => {
  const html = generateSingleFileHtml();

  // Must have proper HTML5 doctype and structure
  assert.ok(html.startsWith('<!DOCTYPE html>'), 'Must start with <!DOCTYPE html>');
  assert.ok(html.includes('<html'), 'Must have <html> tag');
  assert.ok(html.includes('</html>'), 'Must have </html> tag');
  assert.ok(html.includes('Daily Adhkar'), 'Must contain Daily Adhkar title');

  // Must contain fonts for Arabic, Malayalam, English
  assert.ok(html.includes('Scheherazade New'), 'Must load Scheherazade New font');
  assert.ok(html.includes('Noto Sans Malayalam'), 'Must load Noto Sans Malayalam font');
  assert.ok(html.includes('Plus Jakarta Sans'), 'Must load Plus Jakarta Sans font');

  // Must contain Web Audio API sound synthesizer
  assert.ok(html.includes('AudioContext'), 'Must include Web Audio API synthesizer');
  assert.ok(html.includes('playTapBeep'), 'Must have tap sound logic');
  assert.ok(html.includes('playCompletionChime'), 'Must have completion chime logic');

  // Must embed full authentic Adhkar dataset without Uthaymeen or Authentic Booklet mentions
  assert.ok(html.includes('window.ADHKAR_DATA'), 'Must contain embedded window.ADHKAR_DATA');
  assert.ok(html.includes('Surah Al-Baqarah'), 'Must contain Quranic references');
  assert.ok(html.includes('അല്ലാഹു'), 'Must contain Malayalam translations');
  assert.ok(html.includes('سُبْحَانَ اللَّهِ'), 'Must contain Arabic dhikr text');
  assert.equal(/uthaymeen/i.test(html), false, 'Must not contain any mention of Ibn Uthaymeen');
  assert.equal(/authentic booklet/i.test(html), false, 'Must not contain Authentic Booklet banner');

  // Must contain single file download handlers (accessible via Settings modal)
  assert.ok(html.includes('downloadCurrentSingleFile'), 'Must contain offline file download helper');
  assert.ok(html.includes('daily-adhkar-single-file.html'), 'Must specify download file name');

  // Header must contain ONLY the 3 action buttons (soundToggleBtn, themeToggleBtn, openSettingsBtn)
  assert.ok(html.includes('id="soundToggleBtn"'), 'Header must contain Sound toggle button');
  assert.ok(html.includes('id="themeToggleBtn"'), 'Header must contain Day/Night theme toggle button');
  assert.ok(html.includes('id="openSettingsBtn"'), 'Header must contain Settings button');
  assert.equal(html.includes('id="resetCategoryBtn"'), false, 'Header must not contain Reset button');
  assert.equal(html.includes('id="downloadHtmlBtn"'), false, 'Header must not contain Download button');
  assert.equal(html.includes('id="shareAppBtn"'), false, 'Header must not contain Share button');

  // Must contain Share as Image (Fadheelath Card) button and 9:16 canvas generator
  assert.ok(
    html.includes('ചിത്രമായി പങ്കുവെക്കുക (Share Image)'),
    'Must contain Share Image button label'
  );
  assert.ok(html.includes('#0d2818'), 'Must include deep emerald green background #0d2818');
  assert.ok(html.includes('#e0b96b'), 'Must include gold accent color #e0b96b');
  assert.ok(
    html.includes('മുദാവമ (Mudaawama) • Daily Adhkar'),
    'Must include top title on Fadheelath card'
  );
  assert.ok(
    html.includes('أذكار الصباح والمساء'),
    'Must include Arabic header on Fadheelath card'
  );
  assert.ok(
    html.includes('📲 ഈ ആപ്പ് ഫോണിൽ ലഭിക്കാൻ താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക'),
    'Must include visual bottom CTA label on Fadheelath card'
  );
  assert.ok(
    html.includes('https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/'),
    'Must include https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/'
  );
  assert.equal(
    html.includes('https://sajjadsajju2626-alt.github.io/-/'),
    false,
    'Must not contain old GitHub Pages link'
  );
  assert.ok(html.includes('navigator.share'), 'Must integrate Web Share API navigator.share');
  assert.ok(
    html.includes('const shareUrl = "https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/";'),
    'Must define shareUrl with the exact URL'
  );
  assert.ok(
    html.includes('if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] }))'),
    'Must check navigator.share and navigator.canShare({ files: [file] })'
  );
  assert.ok(
    html.includes('files: [file],\n                text: shareUrl,\n                url: shareUrl'),
    'Must pass files: [file], text: shareUrl, url: shareUrl without title in navigator.share()'
  );
  assert.ok(
    html.includes('navigator.clipboard.writeText("https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/");'),
    'Clipboard fallback must write only the exact URL string'
  );

  // Verify every inline <script> block in the generated HTML has valid JavaScript syntax
  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scriptMatches.length >= 2, 'Must have embedded data and client app script blocks');
  for (const [, scriptBody] of scriptMatches) {
    assert.doesNotThrow(
      () => new Function(scriptBody),
      'Inline script in single-file HTML must be syntactically valid JavaScript'
    );
  }

  // Verify custom built-in target modal replaces window.prompt
  assert.ok(html.includes('id="customCountModal"'), 'Must contain built-in #customCountModal component');
  assert.ok(html.includes('id="customTargetInput"'), 'Must contain #customTargetInput');
  assert.ok(html.includes('function openTargetModal('), 'Must define openTargetModal()');
  assert.ok(html.includes('function closeTargetModal('), 'Must define closeTargetModal()');
  assert.ok(html.includes('function confirmTargetModal('), 'Must define confirmTargetModal()');
  assert.equal(/prompt\s*\(/i.test(html), false, 'Must completely eliminate window.prompt() from HTML and scripts');

  // Verify Add Custom Thasbeeh feature & localStorage management
  assert.ok(html.includes('id="openAddThasbeehBtn"'), 'Must contain + Add Thasbeeh button');
  assert.ok(html.includes('id="addThasbeehModal"'), 'Must contain #addThasbeehModal component');
  assert.ok(html.includes('id="newThasbeehArabicInput"'), 'Must contain Arabic input in Add Thasbeeh modal');
  assert.ok(html.includes('id="newThasbeehMeaningInput"'), 'Must contain Meaning input in Add Thasbeeh modal');
  assert.ok(html.includes('id="newThasbeehTargetInput"'), 'Must contain Target Count input in Add Thasbeeh modal');
  assert.ok(html.includes('custom_thasbeeh_list'), 'Must persist custom thasbeeh items in localStorage under custom_thasbeeh_list');
  assert.ok(html.includes('function saveCustomThasbeeh('), 'Must define saveCustomThasbeeh()');
  assert.ok(html.includes('function deleteCustomThasbeeh('), 'Must define deleteCustomThasbeeh()');
  assert.ok(html.includes('function renderTasbihPresetsBar('), 'Must define renderTasbihPresetsBar()');

  // Verify Offline PWA Capability, Manifest, Cache-First SW, and Offline Status Indicator
  assert.ok(html.includes('<link rel="manifest" href="./manifest.json">'), 'Must link to ./manifest.json');
  assert.ok(html.includes("const CACHE_NAME = 'mudawamah-cache-v1';"), 'Must define CACHE_NAME = mudawamah-cache-v1');
  assert.ok(html.includes("caches.open(CACHE_NAME)"), 'Must precache assets into CACHE_NAME');
  assert.ok(html.includes("caches.match(event.request)"), 'Must handle fetch events with Cache-First / Stale-While-Revalidate');
  assert.ok(html.includes('id="offlineStatusBanner"'), 'Must contain #offlineStatusBanner indicator');
  assert.ok(html.includes('adhkar_tasbih_state'), 'Must persist Tasbih counter state in localStorage');
  assert.ok(html.includes('adhkar_theme'), 'Must persist theme preference in localStorage');

  // Size check
  assert.ok(html.length > 100000, `File should be substantial (>100KB), got ${html.length} chars`);
});

test('public/adhkar-standalone.html exists on disk and is ready for serving and download', () => {
  const filePath = path.resolve(process.cwd(), 'public/adhkar-standalone.html');
  assert.ok(fs.existsSync(filePath), 'public/adhkar-standalone.html must exist on disk');
  const stats = fs.statSync(filePath);
  assert.ok(stats.size > 100000, `File size should be > 100KB, got ${stats.size} bytes`);
});

test('generateSingleFileHtml uses emerald green palette, opens category view with Back to Categories button, removes bottom nav, shows Time-Based Recommendation once, and includes View Translation toggle', () => {
  const html = generateSingleFileHtml();
  assert.ok(
    html.includes('#0d5c3a') && html.includes('#115e59') && html.includes('#064e3b'),
    'Must include Islamic emerald green palette (#0d5c3a, #115e59, #064e3b)'
  );
  assert.ok(
    !html.includes('#1565C0') && !html.includes('#1976D2') && !html.includes('#1E88E5'),
    'Must not include old blue theme colors (#1565C0, #1976D2, #1E88E5)'
  );
  assert.ok(html.includes('grid-cols-2'), 'Must include 2-column category card grid');
  for (const num of ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧']) {
    assert.ok(html.includes(num), `Must include circled number tag ${num}`);
  }
  assert.ok(
    html.includes('id="backToCategoriesBtn"') &&
      html.includes('← തിരികെ (Back)') &&
      html.includes('Back to Categories'),
    'Must include Back to Categories navigation button for opened category view'
  );
  assert.ok(
    !html.includes('data-bottom-nav='),
    'Must completely remove the bottom navigation bar'
  );
  assert.ok(
    html.includes('data-testid="time-based-recommendation-card"'),
    'Must include single Time-Based Recommendation card on home overview'
  );
  assert.ok(
    html.includes('View Translation / അർത്ഥം കാണുക') && html.includes('data-toggle-translation='),
    'Must include View Translation / അർത്ഥം കാണുക toggle button for adhkar cards'
  );
  assert.ok(
    html.includes('data-tab="progress"') &&
      html.includes('id="progressView"') &&
      html.includes('പുരോഗതി വിലയിരുത്തൽ • Progress Tracker'),
    'Must isolate Progress Tracker inside dedicated #progressView (data-tab="progress")'
  );
  assert.ok(
    html.includes('window.history.pushState') &&
      html.includes('window.history.back()') &&
      html.includes("window.addEventListener('popstate'"),
    'Must integrate History API pushState, back(), and popstate listener for native phone back button'
  );
  assert.ok(
    html.includes('showTransliteration: false'),
    'Must set showTransliteration to false by default in DEFAULT_SETTINGS'
  );
  assert.ok(
    html.includes('<link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,700;1,700&family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">'),
    'Must include Google Fonts calligraphy stylesheet for Amiri and Aref Ruqaa'
  );
  assert.ok(
    html.includes('<h1 class="app-arabic-title" dir="rtl">مُدَاوَمَةٌ</h1>'),
    'Must render top centered header title <h1 class="app-arabic-title" dir="rtl">مُدَاوَمَةٌ</h1>'
  );
  assert.ok(
    html.includes("font-family: 'Scheherazade New', 'Amiri', 'Aref Ruqaa', serif;"),
    'Must style .app-arabic-title with Scheherazade New and Amiri calligraphy font family'
  );
  assert.ok(
    html.includes('Daily Adhkar • പ്രതിദിന ദിക്റുകൾ'),
    'Must display secondary subtitle "Daily Adhkar • പ്രതിദിന ദിക്റുകൾ" beneath the Arabic title'
  );
  assert.ok(
    html.includes('showFocusTimer: false'),
    'Must set showFocusTimer to false by default in DEFAULT_SETTINGS'
  );
  assert.ok(
    html.includes('adhkar_show_focus_timer'),
    'Must persist Focus Timer setting in localStorage under adhkar_show_focus_timer'
  );
  assert.ok(
    html.includes('Focus Timer (ശ്രദ്ധ കേന്ദ്രീകരിക്കാൻ ടൈമർ)') &&
      html.includes('Show countdown timer on adhkar cards / ദിക്റുകൾക്ക് ടൈമർ കാണിക്കുക') &&
      html.includes('data-testid="toggle-focus-timer-switch"'),
    'Must include Focus Timer toggle row and subtitle in Settings modal'
  );
  assert.ok(
    html.includes('Morning / പ്രഭാതം') &&
      html.includes('Evening / പ്രദോഷം') &&
      html.includes('Sleep / ഉറക്കം') &&
      html.includes('Daily Goal Completion Reminder') &&
      html.includes('Send Test Notification / ടെസ്റ്റ് ചെയ്യുക') &&
      html.includes('Test Catch-Up'),
    'Must include clean, consumer-ready Notification settings UI'
  );
  assert.equal(
    html.includes('Dual-Trigger Notification Engine'),
    false,
    'Must not contain technical debug box "Dual-Trigger Notification Engine"'
  );
  assert.equal(
    html.includes('Test Dual-Trigger Notification'),
    false,
    'Must not contain technical label "Test Dual-Trigger Notification"'
  );
  assert.equal(
    html.includes('Exact :00s Timer Armed'),
    false,
    'Must not contain debug status badge "Exact :00s Timer Armed"'
  );
  assert.ok(
    html.includes('«سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ»'),
    'Must include Hadith of Juwayriyah Arabic dhikr text'
  );
  assert.ok(
    html.includes("Subhanallahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih"),
    'Must include Hadith of Juwayriyah transliteration'
  );
  assert.ok(
    html.includes('3 Times (3 തവണ / 3 مرات)'),
    'Must include 3 Times (3 തവണ / 3 مرات) repeatNote'
  );
  assert.ok(
    html.includes('صحيح مسلم (2726)، أبو داود، والنسائي'),
    'Must include Hadith reference صحيح مسلم (2726)، أبو داود، والنسائي'
  );
  assert.ok(
    html.includes('عن جويرية أم المؤمنين رضي الله عنها: أن النبي ﷺ خرج من عندها بُكرةً'),
    'Must include full Arabic Hadith text of Juwayriyah'
  );
  assert.ok(
    html.includes('ജുവൈരിയ്യ (റ) വിൽ നിന്ന് നിവേദനം: നബി ﷺ സുബ്ഹ് നമസ്കാര ശേഷം അവരുടെ അടുത്തുനിന്ന് പുറത്തുപോയി'),
    'Must include Malayalam Hadith virtue of Juwayriyah'
  );
  assert.ok(
    html.includes('Hadith Ref &amp; Virtue / ഹദീസിൻ്റെ ശ്രേഷ്ഠത'),
    'Must include Hadith Ref & Virtue / ഹദീസിൻ്റെ ശ്രേഷ്ഠത dropdown accordion'
  );

  // Duolingo-style Streak Modal assertions
  assert.ok(
    html.includes('@keyframes streakFreezeShiver') &&
      html.includes('transform: translateX(-1px) rotate(-1deg)') &&
      html.includes('transform: translateX(1px) rotate(1deg)') &&
      html.includes('box-shadow: 0 0 10px rgba(0, 229, 255, 0.45)'),
    'Must include @keyframes streakFreezeShiver with horizontal vibration and cyan glow box-shadow'
  );
  assert.ok(
    html.includes('day streak / തുടർച്ചയായ ദിവസങ്ങൾ'),
    'Must include Streak Modal subtitle "day streak / തുടർച്ചയായ ദിവസങ്ങൾ"'
  );
  assert.ok(
    html.includes('തുടരുക / Continue'),
    'Must include emerald green "തുടരുക / Continue" button'
  );
  assert.ok(
    html.includes('❄️ Streak Freeze / വിട്ടുപോയ ദിവസം സംരക്ഷിച്ചു'),
    'Must include icy Streak Freeze info banner "❄️ Streak Freeze / വിട്ടുപോയ ദിവസം സംരക്ഷിച്ചു"'
  );
  assert.ok(
    html.includes("['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"),
    'Must include 7-day week row labels (Su, Mo, Tu, We, Th, Fr, Sa)'
  );
  for (const pillarLabel of [
    'Morning • പ്രഭാതം',
    'Evening • പ്രദോഷം',
    'After Prayer • നമസ്കാരം',
    'Sleep • ഉറക്കം',
    'പ്രഭാത ദിക്റുകൾ',
    'പ്രദോഷ ദിക്റുകൾ',
    'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ',
    'ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ',
  ]) {
    assert.ok(
      html.includes(pillarLabel),
      `Must include 4-pillar qualification label "${pillarLabel}"`
    );
  }
  assert.ok(
    html.includes('adhkar_completion_timestamps') &&
      html.includes('recalculateDynamicStreak') &&
      html.includes('getFourPillarsStatus'),
    'Must dynamically calculate streaks from localStorage completion timestamps and 4-pillar qualification'
  );

  // Boxless Free-Float Category Completion Celebration Overlay assertions
  assert.equal(
    html.includes('id="completionBanner"'),
    false,
    'Must remove the old boxed #completionBanner card container'
  );
  assert.equal(
    html.includes('openStreakModal(true)'),
    false,
    'Must not interruptively auto-pop the boxed streak modal on completion'
  );
  assert.ok(
    html.includes('id="completionOverlay"') &&
      html.includes('data-testid="completion-free-overlay"'),
    'Must include boxless #completionOverlay element'
  );
  assert.ok(
    html.includes('backdrop-filter: blur(5px) brightness(0.6)'),
    'Must include backdrop-filter: blur(5px) brightness(0.6) on completion overlay'
  );
  assert.ok(
    html.includes('مَا شَاءَ اللَّه'),
    'Must include glowing golden Arabic calligraphy "مَا شَاءَ اللَّه" below the flame'
  );
  assert.ok(
    html.includes('വിഭാഗം പൂർത്തിയായി! • Category Completed!') &&
      html.includes('പ്രഭാത ദിക്റുകൾ പൂർത്തിയായി!') &&
      html.includes('പ്രദോഷ ദിക്റുകൾ പൂർത്തിയായി!') &&
      html.includes('നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ പൂർത്തിയായി!') &&
      html.includes('ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ പൂർത്തിയായി!'),
    'Must include "വിഭാഗം പൂർത്തിയായി! • Category Completed!" and dynamic Malayalam category completion titles'
  );
  assert.ok(
    html.includes('text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)'),
    'Must include soft dark shadow/glow text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)'
  );
  assert.ok(
    html.includes('triggerVibration([60, 40, 60])'),
    'Must trigger haptic vibration [60, 40, 60] upon category completion'
  );
  assert.ok(
    html.includes('!wasCategoryAllDone && isCategoryNowAllDone') &&
      html.includes('triggerCompletionOverlay(targetCatKey)') &&
      html.includes('dismissCompletionOverlay') &&
      html.includes('2000'),
    'Must trigger completion overlay strictly when an entire category transitions to completed (or Complete All) and auto-dismiss after 2 seconds (2000ms)'
  );
});

test('After Prayer Adhkar cards have distinct itemNumbers, unique audio segment bounds, and isolated single-item play vs Autoplay All', async () => {
  const { getEmbeddedAdhkarData } = await import('./single-file-generator.ts');
  const data = getEmbeddedAdhkarData();
  const PRAYER_ADHKAR: any[] = data.prayer || [];
  const MORNING_ADHKAR: any[] = data.morning || [];
  const EVENING_ADHKAR: any[] = data.evening || [];
  const SLEEP_ADHKAR: any[] = data.sleep || [];

  assert.equal(PRAYER_ADHKAR.length, 7, 'PRAYER_ADHKAR must have 7 items');

  // Every After Prayer item must have its explicit itemNumber (1..7) so filtering never resets numbering to 1
  PRAYER_ADHKAR.forEach((item: any, idx: number) => {
    assert.equal(item.itemNumber, idx + 1, `Prayer item ${item.id} must have itemNumber ${idx + 1}`);
    assert.ok(item.audioUrl, `Prayer item ${item.id} must have an audioUrl`);
  });

  // All 7 After Prayer audio URLs must be distinct (no two cards share an unsegmented 0:00 URL)
  const uniqueUrls = new Set(PRAYER_ADHKAR.map((i: any) => i.audioUrl));
  assert.equal(uniqueUrls.size, PRAYER_ADHKAR.length, 'Every After Prayer card must have a unique audioUrl / media fragment');

  // Card #4 (p-4: Alhamdulillah) must have exact segment bounds (2.80s to 4.30s) on 69.mp3
  const card4 = PRAYER_ADHKAR.find((i: any) => i.id === 'p-4');
  assert.ok(card4, 'Card #4 (p-4) must exist in PRAYER_ADHKAR');
  assert.equal(card4.itemNumber, 4);
  assert.equal(card4.audioUrl, 'https://www.hisnmuslim.com/audio/ar/69.mp3#t=2.80,4.30');
  assert.equal(card4.audioStartTime, 2.8);
  assert.equal(card4.audioEndTime, 4.3);

  // Preserve Morning, Evening, and Sleep audio paths
  assert.ok(MORNING_ADHKAR.filter((i: any) => i.audioUrl || (i.audioUrls && i.audioUrls.length > 0)).length >= 23, 'Morning Adhkar audio paths preserved');
  assert.ok(EVENING_ADHKAR.filter((i: any) => i.audioUrl || (i.audioUrls && i.audioUrls.length > 0)).length >= 23, 'Evening Adhkar audio paths preserved');
  assert.ok(SLEEP_ADHKAR.every((i: any) => i.audioUrl || (i.audioUrls && i.audioUrls.length > 0)), 'Sleep Adhkar audio paths preserved');

  // Verify standalone HTML includes segment seeking, playItem(cardId), playDhikrAudio(indexOrId), and Autoplay All vs single-item separation
  const html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  assert.ok(html.includes('function parseAudioBounds('), 'Must include parseAudioBounds helper');
  assert.ok(html.includes('/#t=([\\d.]+)(?:,([\\d.]+))?/i'), 'Must include properly escaped media fragment regex in index.html');
  assert.ok(html.includes('function playItem(cardId)'), 'Must include playItem(cardId) function');
  assert.ok(html.includes('function playDhikrAudio(indexOrId)'), 'Must include playDhikrAudio(indexOrId) function');
  assert.ok(html.includes('function startAutoplayAll()'), 'Must include startAutoplayAll() function');
  assert.ok(html.includes('function stopAutoplayAll()'), 'Must include stopAutoplayAll() function');
  assert.ok(html.includes('audio.dataset.itemId = item.id'), 'Must tag audio instance with item.id');
  assert.ok(html.includes('audio.dataset.startTime = String(startTime)'), 'Must tag audio instance with startTime');
  assert.ok(html.includes('audio.dataset.endTime = String(endTime)'), 'Must tag audio instance with endTime');
});

test('index.html implements 12-hour AM/PM time selectors & preset chips, localStorage adhkar_reminders & lastNotified sync, and Service Worker background alarm check with exact Malayalam/English notifications', () => {
  const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
  assert.ok(fs.existsSync(indexHtmlPath), 'index.html must exist');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Verify all inline <script> blocks in index.html compile cleanly
  const scriptMatches = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scriptMatches.length >= 2, 'index.html must have embedded data and app script blocks');
  for (const [, scriptBody] of scriptMatches) {
    assert.doesNotThrow(
      () => new Function(scriptBody),
      'Inline script in index.html must be syntactically valid JavaScript'
    );
  }

  // 2. Verify minimal single 12-Hour interactive clock inputs (all preset chips deleted)
  assert.ok(indexHtml.includes('id="morningReminderInput"'), 'Must include single morningReminderInput');
  assert.ok(indexHtml.includes('id="eveningReminderInput"'), 'Must include single eveningReminderInput');
  assert.ok(indexHtml.includes('id="sleepReminderInput"'), 'Must include single sleepReminderInput');
  assert.ok(indexHtml.includes('id="goalReminderInput"'), 'Must include single goalReminderInput');
  assert.ok(indexHtml.includes('id="morningFormattedTime"'), 'Must include morning 12h display');
  assert.ok(indexHtml.includes('id="eveningFormattedTime"'), 'Must include evening 12h display');
  assert.ok(indexHtml.includes('id="sleepFormattedTime"'), 'Must include sleep 12h display');
  assert.ok(indexHtml.includes('id="goalFormattedTime"'), 'Must include goal 12h display');
  assert.ok(!indexHtml.includes('reminder-preset-btn'), 'All preset time chip buttons must be removed');
  assert.ok(!indexHtml.includes('data-reminder-preset'), 'All data-reminder-preset attributes must be removed');

  // 3. Verify 12h <-> 24h conversion helpers & localStorage persistence keys
  assert.ok(indexHtml.includes('function normalizeTo24HourTime('), 'Must include normalizeTo24HourTime helper');
  assert.ok(indexHtml.includes('const to24HourTime = normalizeTo24HourTime'), 'Must alias to24HourTime');
  assert.ok(indexHtml.includes('function formatTime12h('), 'Must include formatTime12h helper');
  assert.ok(indexHtml.includes('const to12HourTime = formatTime12h'), 'Must alias to12HourTime');
  assert.ok(indexHtml.includes("localStorage.setItem('adhkar_reminders'"), 'Must persist adhkar_reminders in localStorage');
  assert.ok(indexHtml.includes("localStorage.setItem('lastNotified'"), 'Must persist lastNotified duplicate-prevention map');

  // 4. Verify Service Worker registration, postMessage sync, and 24-hour HH:mm clock comparison
  assert.ok(indexHtml.includes('new Blob([swCode]'), 'index.html must create Blob URL fallback from swCode');
  assert.ok(
    indexHtml.includes("navigator.serviceWorker.register('./firebase-messaging-sw.js?v=' + Date.now())"),
    'index.html must register ./firebase-messaging-sw.js with cache-busting query parameter'
  );
  assert.ok(indexHtml.includes("const APP_VERSION = 'v1.0.2-' + Date.now();"), 'index.html must define APP_VERSION constant');
  assert.ok(indexHtml.includes('reg.update()'), 'index.html must call reg.update() to force fetch latest Service Worker file');
  assert.ok(indexHtml.includes('http-equiv="Cache-Control"'), 'index.html must specify cache control meta header');
  assert.ok(indexHtml.includes("type: 'SYNC_REMINDER_SCHEDULE'"), 'index.html must sync reminder schedule to Service Worker via postMessage');
  assert.ok(indexHtml.includes('now.toTimeString().slice(0, 5)'), 'Must compare current clock time via toTimeString().slice(0, 5)');

  // 5. Verify exact Malayalam & English notification titles, bodies, and priority options
  assert.ok(indexHtml.includes('പ്രഭാത ദിക്റുകൾ • Morning Adhkar'), 'Must include exact Morning notification title');
  assert.ok(indexHtml.includes('സുബ്ഹിക്കു ശേഷമുള്ള ദിക്റുകൾ ചൊല്ലാൻ സമയമായി.'), 'Must include exact Morning notification body');
  assert.ok(indexHtml.includes('പ്രദോഷ ദിക്റുകൾ • Evening Adhkar'), 'Must include exact Evening notification title');
  assert.ok(indexHtml.includes('അസ്വർ/മഗ്രിബിന് ശേഷമുള്ള ദിക്റുകൾ ചൊല്ലാൻ സമയമായി.'), 'Must include exact Evening notification body');
  assert.ok(indexHtml.includes('ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ • Sleep Adhkar'), 'Must include exact Sleep notification title');
  assert.ok(indexHtml.includes("tag: 'adhkar-scheduled'") || indexHtml.includes("effectiveTag || 'adhkar-scheduled'"), 'Must use tag: adhkar-scheduled');
  assert.ok(indexHtml.includes('requireInteraction: true'), 'Must use requireInteraction: true');
  assert.ok(
    indexHtml.includes('vibrate: [300, 100, 300, 100, 300]') &&
      indexHtml.includes("urgency: 'high'") &&
      indexHtml.includes("priority: 'high'"),
    'Must use high importance heads-up flags (vibrate: [300, 100, 300, 100, 300], urgency: high, priority: high)'
  );

  // 6. Verify Daily Goal Completion Reminder checkbox toggle (#dailyGoalReminderToggle), dailyGoalEnabled persistence, and Send Test Notification SW handler
  assert.ok(
    indexHtml.includes('id="dailyGoalReminderToggle"') &&
      indexHtml.includes("els.dailyGoalReminderToggle.addEventListener('change'"),
    'Must include <input type="checkbox" id="dailyGoalReminderToggle"> with a change event listener'
  );
  assert.ok(
    indexHtml.includes("localStorage.setItem('dailyGoalEnabled'") &&
      indexHtml.includes("localStorage.getItem('dailyGoalEnabled')") &&
      indexHtml.includes('els.dailyGoalReminderToggle.checked = isGoalOn'),
    'Must persist dailyGoalEnabled in localStorage and sync checkbox.checked on load and modal open'
  );
  assert.ok(
    indexHtml.includes("morningReminderTime: '06:00'") &&
      indexHtml.includes("eveningReminderTime: '17:30'") &&
      indexHtml.includes("sleepReminderTime: '22:00'"),
    'Must keep Morning: 06:00, Evening: 17:30, Sleep: 22:00 defaults synced with localStorage'
  );
  assert.ok(
    indexHtml.includes('നോട്ടിഫിക്കേഷൻ ടെസ്റ്റ് വിജയിച്ചു! • Notification is working perfectly!') &&
      indexHtml.includes("icon: './icon.png'") &&
      indexHtml.includes("badge: './badge.png'"),
    'Send Test Notification button must trigger reg.showNotification with exact Malayalam/English test message, ./icon.png, and ./badge.png'
  );
  assert.ok(
    indexHtml.includes("vapidKey: 'BEoFaPWdyeDaoc29lofG6VhNjhv6VQfTOn2HcshqsfBZihJiDvOazujpzJ4CGK6tQ3lbSNp0l49bpTgSHCtNXtI'") &&
      indexHtml.includes("localStorage.setItem('fcm_token', currentToken)"),
    'Must retrieve FCM device token using configured VAPID key and store fcm_token in localStorage'
  );
  assert.ok(
    indexHtml.includes('function checkScheduledReminders()') &&
      indexHtml.includes('function alreadyFiredToday(') &&
      indexHtml.includes('function markFiredToday(') &&
      indexHtml.includes('async function triggerLocalNotification(') &&
      indexHtml.includes("localStorage.getItem('morning_time')") &&
      indexHtml.includes("localStorage.getItem('evening_time')") &&
      indexHtml.includes("localStorage.getItem('sleep_time')") &&
      indexHtml.includes('setInterval(checkScheduledReminders, 30000);'),
    'Must implement checkScheduledReminders with 30s interval, localStorage time keys, and fired-today state persistence'
  );
  assert.ok(
    indexHtml.includes('function getNormalizedCurrentTime()') &&
      indexHtml.includes('async function fireSystemNotification(') &&
      indexHtml.includes("onclick=\"fireSystemNotification('മുദാവമ • Mudawamah', 'ടെസ്റ്റ് സിസ്റ്റം നോട്ടിഫിക്കേഷൻ വിജയിച്ചു!')\"") &&
      indexHtml.includes('id="reminderClockDebug"'),
    'Must implement bulletproof getNormalizedCurrentTime, fireSystemNotification with direct onclick handler, and on-screen #reminderClockDebug visual indicator'
  );

  // 7. Verify public/firebase-messaging-sw.js has matching background alarm logic
  const swPath = path.resolve(process.cwd(), 'public/firebase-messaging-sw.js');
  assert.ok(fs.existsSync(swPath), 'public/firebase-messaging-sw.js must exist on disk');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert.ok(swContent.includes('പ്രഭാത ദിക്റുകൾ • Morning Adhkar'), 'firebase-messaging-sw.js must contain Morning title');
  assert.ok(swContent.includes('പ്രദോഷ ദിക്റുകൾ • Evening Adhkar'), 'firebase-messaging-sw.js must contain Evening title');
  assert.ok(swContent.includes('ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ • Sleep Adhkar'), 'firebase-messaging-sw.js must contain Sleep title');
  assert.ok(swContent.includes("tag: 'adhkar-scheduled'"), 'firebase-messaging-sw.js must use tag: adhkar-scheduled');

  // 8. Verify Modernized Header Action Icons (glassmorphic badges + stroke-based 20px SVGs)
  assert.ok(
    indexHtml.includes('w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all'),
    'Header action buttons must use modern translucent circular glassmorphic badge styling'
  );
  assert.ok(
    indexHtml.includes('function getSoundIconSvg(') &&
      indexHtml.includes('function getThemeIconSvg(') &&
      indexHtml.includes('stroke-width="1.75"'),
    'Header action icons must use stroke-based vector SVGs (stroke-width 1.75) for Sound, Theme, and Settings'
  );

  // 9. Verify Solid Emerald/Teal Tap Button at bottom of card + 35ms / [40, 30, 60] haptics + 300ms auto-advance
  assert.ok(
    indexHtml.includes('bg-[#005a4e] hover:bg-[#00483e]') &&
      indexHtml.includes('bg-[#003b33]') &&
      indexHtml.includes("${isDone ? '✓ Done:' : 'Tap:'}"),
    'Must include full-width solid dark emerald/teal Tap button with inset count box matching the screenshot'
  );
  assert.ok(
    indexHtml.includes('എണ്ണാൻ ഇവിടെ ടാപ്പ് ചെയ്യുക • Tap to Count'),
    'Tap button must include bilingual hint text "എണ്ണാൻ ഇവിടെ ടാപ്പ് ചെയ്യുക • Tap to Count"'
  );
  assert.ok(
    indexHtml.includes('navigator.vibrate(35)') &&
      indexHtml.includes('navigator.vibrate([40, 30, 60])'),
    'Must trigger navigator.vibrate(35) on tap and navigator.vibrate([40, 30, 60]) on dhikr completion'
  );
  assert.ok(
    indexHtml.includes('tap-success-ripple') &&
      indexHtml.includes("nextCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' })") &&
      indexHtml.includes('}, 300);'),
    'Must trigger success ripple animation and smoothly scroll to the next Dhikr card after a 300ms pause'
  );

  // 10. Verify mobile top row separation (flex-shrink-0 + ml-auto), slim Hadith Reference disclosure row, and unified audio player widget
  assert.ok(
    indexHtml.includes('py-1.5 px-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 cursor-pointer'),
    'Hadith Reference disclosure row must use the slim single-line collapsible chip/pill styling'
  );
  assert.equal(
    indexHtml.includes('>ഹദീസിന്റെ ശ്രേഷ്ഠത</span>'),
    false,
    'Must remove redundant inner yellow badge repeating "ഹദീസിന്റെ ശ്രേഷ്ഠത" inside Hadith summary'
  );
  assert.ok(
    indexHtml.includes('<span class="badge flex-shrink-0') &&
      indexHtml.includes('flex items-center gap-1.5 ml-auto flex-shrink-0') &&
      indexHtml.includes('ചിത്രമായി പങ്കുവെക്കുക (Share)'),
    'Top action bar must include flex-shrink-0 compact badge on left and ml-auto flex-shrink-0 action cluster on right'
  );
  assert.ok(
    indexHtml.includes('audio-player-widget') &&
      indexHtml.includes('data-audio-indicator=') &&
      indexHtml.includes('Tajweed / Murattal • Qari (ആയത്തുകൾ)'),
    'Must combine Play button, Tajweed/Murattal Qari label, and speaker/duration indicator into a unified audio-player-widget'
  );
});



