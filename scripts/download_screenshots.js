import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicScreenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(publicScreenshotsDir)) {
  fs.mkdirSync(publicScreenshotsDir, { recursive: true });
}

import { INITIAL_DATA } from '../src/data/portfolioData.js';

const webProjects = INITIAL_DATA.projects.filter(p => p.url && p.url.startsWith('http'));

console.log(`Re-capturing fully-rendered live website screenshots (with 5s load delay) for ${webProjects.length} websites...`);

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });

    request.setTimeout(25000, () => {
      request.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Timeout'));
    });
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

async function processAll() {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < webProjects.length; i++) {
    const p = webProjects[i];
    const slug = slugify(p.title);
    const fileName = `${slug}.jpg`;
    const destPath = path.join(publicScreenshotsDir, fileName);

    // Screenshot service URL with /wait/5/ parameter to ensure 5-second full render wait
    const screenshotApiUrl = `https://image.thum.io/get/width/1200/crop/750/wait/5/noanimate/${p.url}`;

    console.log(`[${i + 1}/${webProjects.length}] Capturing full render (5s delay) for: ${p.title} (${p.url})...`);

    try {
      await downloadImage(screenshotApiUrl, destPath);
      console.log(`  ✓ Fully Rendered & Saved: public/screenshots/${fileName}`);
      successCount++;
    } catch (err) {
      console.warn(`  ✗ Failed: ${p.title} (${err.message})`);
      failCount++;
    }
  }

  console.log(`\nFull Render Screenshot Capture Complete! Success: ${successCount}, Failed: ${failCount}`);
}

processAll();
