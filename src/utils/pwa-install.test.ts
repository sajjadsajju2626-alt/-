import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('public/manifest.json satisfies PWA standards for Add to Home Screen', () => {
  const manifestPath = path.resolve(process.cwd(), 'public/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'public/manifest.json must exist');

  const content = fs.readFileSync(manifestPath, 'utf-8');
  const manifest = JSON.parse(content);

  assert.equal(manifest.id, '/', 'id must be /');
  assert.equal(manifest.start_url, '/', 'start_url must be /');
  assert.equal(manifest.scope, '/', 'scope must be /');
  assert.equal(manifest.display, 'standalone', 'display must be standalone');
  assert.ok(manifest.short_name && manifest.short_name.length <= 12, 'short_name must be <= 12 chars');
  assert.ok(manifest.name, 'name must be defined');
  assert.ok(manifest.theme_color, 'theme_color must be defined');
  assert.ok(manifest.background_color, 'background_color must be defined');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'icons array must not be empty');
});

test('public/icon.svg exists and contains valid SVG graphic', () => {
  const iconPath = path.resolve(process.cwd(), 'public/icon.svg');
  assert.ok(fs.existsSync(iconPath), 'public/icon.svg must exist');
  const svg = fs.readFileSync(iconPath, 'utf-8');
  assert.ok(svg.includes('<svg') && svg.includes('</svg>'), 'Must be valid SVG markup');
});

test('index.html contains all mobile Home Screen and PWA meta tags', () => {
  const htmlPath = path.resolve(process.cwd(), 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  assert.ok(html.includes('manifest.json'), 'Must link to manifest.json');
  assert.ok(html.includes('apple-touch-icon'), 'Must include apple-touch-icon');
  assert.ok(html.includes('apple-mobile-web-app-capable'), 'Must specify apple-mobile-web-app-capable');
  assert.ok(html.includes('mobile-web-app-capable'), 'Must specify mobile-web-app-capable');
  assert.ok(html.includes('theme-color'), 'Must specify theme-color');
});
