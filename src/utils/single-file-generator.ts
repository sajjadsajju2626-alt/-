import fs from 'node:fs';
import path from 'node:path';

export function generateSingleFileHtml(): string {
  const indexPath = path.resolve(process.cwd(), 'index.html');
  return fs.readFileSync(indexPath, 'utf8');
}

export function getEmbeddedAdhkarData(): Record<string, any> {
  try {
    const html = generateSingleFileHtml();
    const match = html.match(/window\.ADHKAR_DATA\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
  } catch (e) {}
  return {
    morning: [],
    evening: [],
    prayer: [],
    sleep: [],
    categories: [],
    tasbihPresets: [],
    dailyTasks: [],
  };
}
