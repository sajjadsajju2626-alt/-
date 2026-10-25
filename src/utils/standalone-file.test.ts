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

  // Must embed full Ibn Uthaymeen Adhkar dataset
  assert.ok(html.includes('window.ADHKAR_DATA'), 'Must contain embedded window.ADHKAR_DATA');
  assert.ok(html.includes('Surah Al-Baqarah'), 'Must contain Quranic references');
  assert.ok(html.includes('അല്ലാഹു'), 'Must contain Malayalam translations');
  assert.ok(html.includes('سُبْحَانَ اللَّهِ'), 'Must contain Arabic dhikr text');

  // Must contain single file download handlers
  assert.ok(html.includes('downloadCurrentSingleFile'), 'Must contain offline file download helper');
  assert.ok(html.includes('daily-adhkar-single-file.html'), 'Must specify download file name');

  // Size check
  assert.ok(html.length > 100000, `File should be substantial (>100KB), got ${html.length} chars`);
});

test('public/adhkar-standalone.html exists on disk and is ready for serving and download', () => {
  const filePath = path.resolve(process.cwd(), 'public/adhkar-standalone.html');
  assert.ok(fs.existsSync(filePath), 'public/adhkar-standalone.html must exist on disk');
  const stats = fs.statSync(filePath);
  assert.ok(stats.size > 100000, `File size should be > 100KB, got ${stats.size} bytes`);
});
