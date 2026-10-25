import fs from 'node:fs';
import path from 'node:path';
import { generateSingleFileHtml } from '../src/utils/single-file-generator.ts';

export { generateSingleFileHtml };

const html = generateSingleFileHtml();
const outputPath = path.resolve(process.cwd(), 'public/adhkar-standalone.html');
fs.writeFileSync(outputPath, html, 'utf-8');
console.log('Successfully generated single-file version at: ' + outputPath);
console.log('File size: ' + Math.round(Buffer.byteLength(html, 'utf-8') / 1024) + ' KB');
