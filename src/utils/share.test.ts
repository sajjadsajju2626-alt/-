import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getShareUrl,
  getSharePayload,
  getSocialShareLinks,
  resolvePublicAppUrl,
  PUBLIC_SHARE_URL,
  FALLBACK_APP_URL,
} from './share.ts';

test('resolvePublicAppUrl converts localhost and local IPs to canonical public URL', () => {
  assert.equal(resolvePublicAppUrl('http://localhost:3000'), PUBLIC_SHARE_URL);
  assert.equal(resolvePublicAppUrl('http://localhost:3000/'), PUBLIC_SHARE_URL);
  assert.equal(resolvePublicAppUrl('http://127.0.0.1:3000'), PUBLIC_SHARE_URL);
  assert.equal(resolvePublicAppUrl('http://0.0.0.0:3000'), PUBLIC_SHARE_URL);
  assert.equal(resolvePublicAppUrl('http://192.168.1.50:3000'), PUBLIC_SHARE_URL);
  assert.equal(resolvePublicAppUrl('http://10.0.0.2:3000'), PUBLIC_SHARE_URL);
});

test('resolvePublicAppUrl converts private AI Studio dev domain to public preview domain', () => {
  const devUrl = 'https://ais-dev-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app';
  const expectedPublicUrl = 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app';
  assert.equal(resolvePublicAppUrl(devUrl), expectedPublicUrl);
  assert.equal(resolvePublicAppUrl(`${devUrl}/`), expectedPublicUrl);
});

test('resolvePublicAppUrl preserves public domain without trailing slash', () => {
  assert.equal(resolvePublicAppUrl('https://example.com/'), 'https://example.com');
  assert.equal(resolvePublicAppUrl('https://myadhkar.org'), 'https://myadhkar.org');
  assert.equal(resolvePublicAppUrl(undefined), PUBLIC_SHARE_URL);
});

test('getShareUrl replaces localhost and dev container URLs with public URL', () => {
  const localShare = getShareUrl('morning', 'http://localhost:3000');
  assert.equal(localShare, `${PUBLIC_SHARE_URL}?tab=morning`);

  const devShare = getShareUrl(
    'evening',
    'https://ais-dev-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app'
  );
  assert.equal(devShare, `${PUBLIC_SHARE_URL}?tab=evening`);

  const allShare = getShareUrl('all', 'http://localhost:3000');
  assert.equal(allShare, PUBLIC_SHARE_URL);
});

test('getShareUrl defaults to base origin or fallback URL when tab is not specified', () => {
  const urlDefault = getShareUrl(undefined, 'https://example.com');
  assert.equal(urlDefault, 'https://example.com');

  const urlAll = getShareUrl('all', 'https://example.com');
  assert.equal(urlAll, 'https://example.com');

  const fallbackUrl = getShareUrl();
  assert.equal(fallbackUrl, PUBLIC_SHARE_URL);
  assert.equal(fallbackUrl, FALLBACK_APP_URL);
});

test('getShareUrl appends category tab query param properly', () => {
  const morningUrl = getShareUrl('morning', 'https://example.com');
  assert.equal(morningUrl, 'https://example.com?tab=morning');

  const eveningUrl = getShareUrl('evening', 'https://example.com');
  assert.equal(eveningUrl, 'https://example.com?tab=evening');

  const existingQueryUrl = getShareUrl('prayer', 'https://example.com?source=pwa');
  assert.equal(existingQueryUrl, 'https://example.com?source=pwa&tab=prayer');
});

test('getSharePayload returns authentic hadith reference and category specifics with public URL', () => {
  const payload = getSharePayload('morning', 'http://localhost:3000');
  assert.ok(payload.title.includes('Morning Adhkar'));
  assert.ok(payload.text.includes('مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ'));
  assert.ok(payload.text.includes('Whoever guides someone to goodness'));
  assert.ok(payload.text.includes('Sahih Muslim'));
  assert.equal(payload.url, `${PUBLIC_SHARE_URL}?tab=morning`);
});

test('getSharePayload handles evening and tasbih tabs', () => {
  const eveningPayload = getSharePayload('evening', 'https://example.com');
  assert.ok(eveningPayload.title.includes('Evening Adhkar'));

  const tasbihPayload = getSharePayload('tasbih', 'https://example.com');
  assert.ok(tasbihPayload.title.includes('Tasbih'));
});

test('getSocialShareLinks builds valid encoded URLs for WhatsApp, Telegram, X, and Email', () => {
  const payload = {
    title: 'Daily Adhkar Test',
    text: 'Check this out!',
    url: `${PUBLIC_SHARE_URL}?tab=morning`,
  };

  const links = getSocialShareLinks(payload);
  assert.equal(links.length, 6);

  const whatsapp = links.find((l) => l.id === 'whatsapp');
  assert.ok(whatsapp);
  assert.ok(whatsapp.url.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(whatsapp.url.includes(encodeURIComponent(PUBLIC_SHARE_URL)));

  const telegram = links.find((l) => l.id === 'telegram');
  assert.ok(telegram);
  assert.ok(telegram.url.startsWith('https://t.me/share/url?'));
  assert.ok(telegram.url.includes(encodeURIComponent(PUBLIC_SHARE_URL)));

  const twitter = links.find((l) => l.id === 'twitter');
  assert.ok(twitter);
  assert.ok(twitter.url.startsWith('https://twitter.com/intent/tweet?'));

  const email = links.find((l) => l.id === 'email');
  assert.ok(email);
  assert.ok(email.url.startsWith('mailto:?subject='));
});
