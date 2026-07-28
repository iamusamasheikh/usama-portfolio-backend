import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicScreenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(publicScreenshotsDir)) {
  fs.mkdirSync(publicScreenshotsDir, { recursive: true });
}

import { INITIAL_DATA } from '../src/data/portfolioData.js';

const webProjects = INITIAL_DATA.projects.filter(p => p.url && p.url.startsWith('http'));

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function downloadImageFallback(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImageFallback(response.headers.location, destPath).then(resolve).catch(reject);
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

    request.setTimeout(20000, () => {
      request.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Timeout'));
    });
  });
}

async function runPuppeteerCapture() {
  console.log(`Launching Chrome via Puppeteer to capture ${webProjects.length} fully-rendered live site screenshots...`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
  } catch (e) {
    console.warn('Puppeteer launch failed, using API fallback:', e.message);
  }

  let successCount = 0;
  let fallbackCount = 0;

  for (let i = 0; i < webProjects.length; i++) {
    const p = webProjects[i];
    const slug = slugify(p.title);
    const fileName = `${slug}.jpg`;
    const destPath = path.join(publicScreenshotsDir, fileName);

    console.log(`[${i + 1}/${webProjects.length}] Capturing: ${p.title} (${p.url})...`);

    let captured = false;

    if (browser) {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        // Wait 3.5 seconds for images, slider fonts, and animations to load
        await new Promise(r => setTimeout(r, 3500));

        await page.screenshot({ path: destPath, type: 'jpeg', quality: 88 });
        await page.close();
        console.log(`  ✓ Chrome Screenshot Saved: public/screenshots/${fileName}`);
        captured = true;
        successCount++;
      } catch (err) {
        console.warn(`  ⚠ Chrome failed for ${p.title} (${err.message}), trying 5s render API fallback...`);
      }
    }

    if (!captured) {
      try {
        const fallbackUrl = `https://image.thum.io/get/width/1200/crop/750/wait/5/noanimate/${p.url}`;
        await downloadImageFallback(fallbackUrl, destPath);
        console.log(`  ✓ API Fallback Saved: public/screenshots/${fileName}`);
        fallbackCount++;
      } catch (err) {
        console.warn(`  ✗ Both failed for ${p.title}: ${err.message}`);
      }
    }
  }

  if (browser) await browser.close();
  console.log(`\nScreenshot capture finished! Chrome: ${successCount}, API Fallback: ${fallbackCount}`);
}

runPuppeteerCapture();
