import { DhikrItem } from '../types/adhkar.ts';

export const SHARED_APP_URL =
  'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/';

export interface FadheelathCardData {
  id: string;
  topTitle: string;
  topArabicTitle: string;
  categorySubtitle: string;
  dhikrTitle: string;
  repeatBadge: string;
  arabicText: string;
  malayalamMeaning: string;
  virtueHeader: string;
  virtueText: string;
  hadithRef: string;
  ctaLabel: string;
  ctaUrl: string;
  shareCaption: string;
  fileName: string;
}

const CATEGORY_DISPLAY: Record<string, string> = {
  morning: 'പ്രഭാത ദിക്റുകൾ • Morning Adhkar',
  evening: 'വൈകുന്നേരത്തെ ദിക്റുകൾ • Evening Adhkar',
  prayer: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ • After Prayer Adhkar',
  sleep: 'ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ • Sleep Adhkar',
};

/**
 * Builds structured, deterministic data for the 9:16 Fadheelath Share Card and WhatsApp caption.
 */
export function buildFadheelathCardData(item: DhikrItem): FadheelathCardData {
  const malayalamMeaning = (
    item.malayalamTranslation ||
    item.malayalam ||
    item.translation ||
    ''
  ).trim();

  const virtueText = (
    item.malayalamVirtue ||
    item.virtue ||
    'ഈ ദിക്ർ പതിവായി ചൊല്ലുന്നത് അല്ലാഹുവിന്റെ പ്രത്യേക സംരക്ഷണവും പ്രതിഫലവും നൽകുന്നു.'
  ).trim();

  const hadithRef = item.source ? `Hadith Ref: ${item.source}` : 'Authentic Sunnah';
  const categorySubtitle = CATEGORY_DISPLAY[item.category] || CATEGORY_DISPLAY.morning;
  const repeatBadge =
    item.repeatNote || `${item.target} തവണ (${item.target}x)`;

  const dhikrTitle = item.title || '';
  const safeId = (item.id || 'adhkar').replace(/[^a-zA-Z0-9_-]/g, '-');

  return {
    id: item.id,
    topTitle: 'മുദാവമ (Mudaawama) • Daily Adhkar',
    topArabicTitle: 'أذكار الصباح والمساء',
    categorySubtitle,
    dhikrTitle,
    repeatBadge,
    arabicText: item.arabic.trim(),
    malayalamMeaning,
    virtueHeader: 'ഹദീസിലെ ശ്രേഷ്ഠത (Virtue / Fadheelath)',
    virtueText,
    hadithRef,
    ctaLabel: '📲 ഈ ആപ്പ് ഫോണിൽ ലഭിക്കാൻ താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക',
    ctaUrl: SHARED_APP_URL,
    shareCaption: SHARED_APP_URL,
    fileName: `mudaawama-adhkar-${safeId}.png`,
  };
}

/**
 * Pure text line-wrapping helper given a width measurement function.
 */
export function wrapTextLines(
  text: string,
  maxWidth: number,
  measureWidth: (str: string) => number
): string[] {
  if (!text || !text.trim()) return [];
  const paragraphs = text.split(/\n+/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const candidate = `${currentLine} ${word}`;
      if (measureWidth(candidate) <= maxWidth) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Draws a rounded rectangle path on a 2D canvas context.
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Renders an 8-pointed Islamic star ornament on the canvas.
 */
function drawIslamicOctagram(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  for (let rot = 0; rot < 2; rot++) {
    ctx.save();
    ctx.rotate((rot * Math.PI) / 4);
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Renders the 9:16 vertical Fadheelath Card (1080x1920) onto an HTMLCanvasElement.
 */
export function renderFadheelathCardToCanvas(
  item: DhikrItem,
  canvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const data = buildFadheelathCardData(item);
  const targetCanvas =
    canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
  if (!targetCanvas) {
    throw new Error('Canvas is only available in browser environments');
  }

  const W = 1080;
  const H = 1920;
  targetCanvas.width = W;
  targetCanvas.height = H;

  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D context unavailable');
  }

  // 1. Deep Emerald Green Background (#0d2818) with rich radial glow
  ctx.fillStyle = '#0d2818';
  ctx.fillRect(0, 0, W, H);

  const radialGrad = ctx.createRadialGradient(W / 2, H * 0.38, 80, W / 2, H * 0.5, 1100);
  radialGrad.addColorStop(0, '#143d25');
  radialGrad.addColorStop(0.55, '#0d2818');
  radialGrad.addColorStop(1, '#07170d');
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle Islamic Geometric Background Watermark Pattern
  ctx.save();
  ctx.strokeStyle = 'rgba(224, 185, 107, 0.055)';
  ctx.lineWidth = 1.5;
  const gridStep = 180;
  for (let gx = 90; gx < W; gx += gridStep) {
    for (let gy = 90; gy < H; gy += gridStep) {
      drawIslamicOctagram(ctx, gx, gy, 74);
    }
  }
  ctx.restore();

  // 3. Outer & Inner Gold Geometric Borders (#e0b96b)
  ctx.save();
  ctx.strokeStyle = '#e0b96b';
  ctx.lineWidth = 3.5;
  drawRoundedRect(ctx, 34, 34, W - 68, H - 68, 32);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(224, 185, 107, 0.45)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 48, 48, W - 96, H - 96, 24);
  ctx.stroke();

  // Corner Gold Octagrams
  ctx.strokeStyle = '#e0b96b';
  ctx.lineWidth = 2;
  drawIslamicOctagram(ctx, 68, 68, 22);
  drawIslamicOctagram(ctx, W - 68, 68, 22);
  drawIslamicOctagram(ctx, 68, H - 68, 22);
  drawIslamicOctagram(ctx, W - 68, H - 68, 22);
  ctx.restore();

  // 4. Top Header Section
  let cursorY = 108;

  // Arabic Header: أذكار الصباح والمساء
  ctx.save();
  ctx.fillStyle = '#e0b96b';
  ctx.font = 'bold 36px "Amiri", "Scheherazade New", serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.topArabicTitle, W / 2, cursorY);
  cursorY += 46;

  // Main Top Title: മുദാവമ (Mudaawama) • Daily Adhkar
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 30px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.topTitle, W / 2, cursorY);
  cursorY += 42;

  // Category & Repeat Pill
  const pillText = `${data.categorySubtitle}  •  ${data.repeatBadge}`;
  ctx.font = '700 21px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
  const pillWidth = Math.min(W - 180, ctx.measureText(pillText).width + 52);
  ctx.fillStyle = 'rgba(224, 185, 107, 0.14)';
  ctx.strokeStyle = 'rgba(224, 185, 107, 0.65)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, (W - pillWidth) / 2, cursorY - 26, pillWidth, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e0b96b';
  ctx.fillText(pillText, W / 2, cursorY);
  cursorY += 34;

  // Ornamental Gold Divider
  ctx.strokeStyle = 'rgba(224, 185, 107, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(110, cursorY);
  ctx.lineTo(W / 2 - 24, cursorY);
  ctx.moveTo(W / 2 + 24, cursorY);
  ctx.lineTo(W - 110, cursorY);
  ctx.stroke();
  drawIslamicOctagram(ctx, W / 2, cursorY, 14);
  cursorY += 36;
  ctx.restore();

  // Optional Dhikr Title
  if (data.dhikrTitle) {
    ctx.save();
    ctx.font = '800 25px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#e0b96b';
    ctx.textAlign = 'center';
    const titleLines = wrapTextLines(data.dhikrTitle, W - 180, (s) => ctx.measureText(s).width).slice(0, 2);
    for (const line of titleLines) {
      ctx.fillText(line, W / 2, cursorY);
      cursorY += 34;
    }
    cursorY += 8;
    ctx.restore();
  }

  // Reserve space for Bottom CTA Bar (height 148 at bottom)
  const footerTopY = H - 205;
  const contentMaxBottomY = footerTopY - 24;
  const availableContentHeight = contentMaxBottomY - cursorY;

  const contentWidth = W - 168; // 84px padding each side

  // Dynamic sizing loop so Arabic + Malayalam Meaning + Virtue Box always fit gracefully
  let arabicFontSize = data.arabicText.length > 450 ? 28 : data.arabicText.length > 240 ? 34 : 42;
  let mlFontSize = data.malayalamMeaning.length > 450 ? 21 : data.malayalamMeaning.length > 240 ? 24 : 26;
  let virtueFontSize = data.virtueText.length > 320 ? 20 : 22;

  let arabicLines: string[] = [];
  let mlLines: string[] = [];
  let virtueLines: string[] = [];
  let arabicLineH = 0;
  let mlLineH = 0;
  let virtueLineH = 0;

  for (let attempt = 0; attempt < 6; attempt++) {
    arabicLineH = Math.round(arabicFontSize * 1.65);
    mlLineH = Math.round(mlFontSize * 1.52);
    virtueLineH = Math.round(virtueFontSize * 1.48);

    ctx.font = `bold ${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
    arabicLines = wrapTextLines(data.arabicText, contentWidth - 40, (s) => ctx.measureText(s).width);

    ctx.font = `600 ${mlFontSize}px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif`;
    mlLines = wrapTextLines(data.malayalamMeaning, contentWidth - 40, (s) => ctx.measureText(s).width);

    ctx.font = `600 ${virtueFontSize}px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif`;
    virtueLines = wrapTextLines(data.virtueText, contentWidth - 64, (s) => ctx.measureText(s).width);

    const estimatedHeight =
      arabicLines.length * arabicLineH +
      48 +
      52 +
      mlLines.length * mlLineH +
      36 +
      115 +
      virtueLines.length * virtueLineH;

    if (estimatedHeight <= availableContentHeight || arabicFontSize <= 22) {
      break;
    }
    arabicFontSize = Math.max(22, arabicFontSize - 3);
    mlFontSize = Math.max(17, mlFontSize - 2);
    virtueFontSize = Math.max(17, virtueFontSize - 1);
  }

  // Clamp line counts if a supplication is extraordinarily long
  const maxArabicLines = Math.max(4, Math.floor((availableContentHeight * 0.42) / arabicLineH));
  if (arabicLines.length > maxArabicLines) {
    arabicLines = arabicLines.slice(0, maxArabicLines);
    arabicLines[arabicLines.length - 1] += ' …';
  }

  const maxMlLines = Math.max(4, Math.floor((availableContentHeight * 0.30) / mlLineH));
  if (mlLines.length > maxMlLines) {
    mlLines = mlLines.slice(0, maxMlLines);
    mlLines[mlLines.length - 1] += ' …';
  }

  const maxVirtueLines = Math.max(3, Math.floor((availableContentHeight * 0.22) / virtueLineH));
  if (virtueLines.length > maxVirtueLines) {
    virtueLines = virtueLines.slice(0, maxVirtueLines);
    virtueLines[virtueLines.length - 1] += ' …';
  }

  // 5. Draw Main Arabic Content Box
  const arabicBoxHeight = arabicLines.length * arabicLineH + 44;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(224, 185, 107, 0.35)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 84, cursorY, contentWidth, arabicBoxHeight, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${arabicFontSize}px "Amiri", "Scheherazade New", serif`;
  ctx.textAlign = 'center';
  let textY = cursorY + arabicLineH * 0.82 + 12;
  for (const line of arabicLines) {
    ctx.fillText(line, W / 2, textY);
    textY += arabicLineH;
  }
  ctx.restore();

  cursorY += arabicBoxHeight + 28;

  // 6. Draw Complete Malayalam Meaning Section
  ctx.save();
  ctx.fillStyle = '#e0b96b';
  ctx.font = '800 22px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📖 അർത്ഥം (Meaning):', 92, cursorY + 20);
  cursorY += 36;

  ctx.fillStyle = '#ecfdf5';
  ctx.font = `600 ${mlFontSize}px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif`;
  for (const line of mlLines) {
    ctx.fillText(line, 92, cursorY + mlLineH * 0.78);
    cursorY += mlLineH;
  }
  ctx.restore();

  cursorY += 24;

  // 7. Highlighted Virtue / Fadheelath Box (ഹദീസിലെ ശ്രേഷ്ഠത & Authentic Reference)
  const virtueBoxHeight = Math.min(
    contentMaxBottomY - cursorY,
    virtueLines.length * virtueLineH + 108
  );
  if (virtueBoxHeight > 80) {
    ctx.save();
    ctx.fillStyle = 'rgba(224, 185, 107, 0.11)';
    ctx.strokeStyle = '#e0b96b';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 84, cursorY, contentWidth, virtueBoxHeight, 22);
    ctx.fill();
    ctx.stroke();

    // Header badge inside Virtue Box
    ctx.fillStyle = '#e0b96b';
    ctx.font = '800 22px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`✨ ${data.virtueHeader}`, 112, cursorY + 36);

    // Virtue text
    ctx.fillStyle = '#fef3c7';
    ctx.font = `600 ${virtueFontSize}px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif`;
    let vY = cursorY + 70;
    for (const line of virtueLines) {
      if (vY + 28 > cursorY + virtueBoxHeight - 24) break;
      ctx.fillText(line, 112, vY);
      vY += virtueLineH;
    }

    // Authentic Hadith Reference at bottom of Virtue Box
    ctx.fillStyle = '#e0b96b';
    ctx.font = '700 19px "Plus Jakarta Sans", "Noto Sans Malayalam", sans-serif';
    ctx.fillText(`📚 ${data.hadithRef}`, 112, cursorY + virtueBoxHeight - 18);
    ctx.restore();
  }

  // 8. Bottom Call-to-Action Bar
  ctx.save();
  const ctaBoxY = H - 182;
  const ctaBoxH = 114;
  ctx.fillStyle = 'rgba(9, 30, 18, 0.92)';
  ctx.strokeStyle = '#e0b96b';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 84, ctaBoxY, contentWidth, ctaBoxH, 22);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e0b96b';
  ctx.font = '800 22px "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.ctaLabel, W / 2, ctaBoxY + 46);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 21px "Plus Jakarta Sans", monospace';
  ctx.fillText(data.ctaUrl, W / 2, ctaBoxY + 86);
  ctx.restore();

  return targetCanvas;
}

/**
 * Generates the 9:16 Fadheelath PNG card and triggers Web Share API (`navigator.share`)
 * or falls back to downloading the `.png` file and copying the caption + link to clipboard.
 */
export async function shareOrDownloadFadheelathCard(
  item: DhikrItem
): Promise<{
  mode: 'shared' | 'downloaded';
  dataUrl: string;
  caption: string;
  fileName: string;
}> {
  const data = buildFadheelathCardData(item);
  const canvas = renderFadheelathCardToCanvas(item);
  const dataUrl = canvas.toDataURL('image/png');

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  );

  const shareUrl = 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/';

  // Copy ONLY the raw URL to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(
        'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/'
      );
    } catch {
      // ignore clipboard permission errors
    }
  }

  // 1. Try Web Share API with PNG image file and ONLY the raw URL (no title)
  if (blob && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const file = new File([blob], data.fileName, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: shareUrl,
          url: shareUrl,
        });
        return {
          mode: 'shared',
          dataUrl,
          caption: shareUrl,
          fileName: data.fileName,
        };
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          mode: 'shared',
          dataUrl,
          caption: shareUrl,
          fileName: data.fileName,
        };
      }
      // Fall through to instant PNG download fallback
    }
  }

  // 2. Fallback: Trigger instant download of the generated .png image
  if (typeof document !== 'undefined') {
    const downloadUrl = blob ? URL.createObjectURL(blob) : dataUrl;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = data.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (blob) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
    }
  }

  return {
    mode: 'downloaded',
    dataUrl,
    caption: data.shareCaption,
    fileName: data.fileName,
  };
}
