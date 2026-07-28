import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const publicScreenshotsDir = path.join(projectRoot, 'public', 'screenshots');

if (!fs.existsSync(publicScreenshotsDir)) {
  fs.mkdirSync(publicScreenshotsDir, { recursive: true });
}

const dataPath = pathToFileURL(path.join(projectRoot, 'src', 'data', 'portfolioData.js')).href;
const { INITIAL_DATA } = await import(dataPath);

const webProjects = INITIAL_DATA.projects.filter(p => p.url && p.url.startsWith('http'));

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function downloadImageFallback(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        if (res.headers.location) {
          file.close();
          fs.unlink(destPath, () => {});
          return downloadImageFallback(res.headers.location, destPath).then(resolve).catch(reject);
        }
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`HTTP status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          if (fs.existsSync(destPath)) {
            const size = fs.statSync(destPath).size;
            if (size < 15000) {
              fs.unlink(destPath, () => {});
              return reject(new Error(`File too small (${size} bytes)`));
            }
            resolve(destPath);
          } else {
            reject(new Error('File creation failed'));
          }
        });
      });
    });

    req.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });

    req.setTimeout(25000, () => {
      req.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Download timeout'));
    });
  });
}

async function captureAllScreenshots() {
  console.log(`Starting capture process for ${webProjects.length} websites...`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--ignore-certificate-errors',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });
    console.log('Puppeteer Chrome instance launched successfully.');
  } catch (err) {
    console.warn('Puppeteer launch warning:', err.message);
  }

  let chromeSuccess = 0;
  let apiFallbackSuccess = 0;
  let skippedOkCount = 0;
  let totalFailed = 0;

  const forceOverwrite = process.argv.includes('--force');

  for (let i = 0; i < webProjects.length; i++) {
    const p = webProjects[i];
    const slug = slugify(p.title);
    const fileName = `${slug}.jpg`;
    const destPath = path.join(publicScreenshotsDir, fileName);

    if (!forceOverwrite && fs.existsSync(destPath)) {
      const size = fs.statSync(destPath).size;
      if (size >= 25000) {
        console.log(`[${i + 1}/${webProjects.length}] Skipping existing OK screenshot: ${fileName} (${(size / 1024).toFixed(1)} KB)`);
        skippedOkCount++;
        continue;
      }
    }

    console.log(`\n[${i + 1}/${webProjects.length}] Capturing: "${p.title}" -> ${p.url}`);

    let captured = false;

    // Method 1: Puppeteer Full Chrome Render
    if (browser) {
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.25 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        page.on('dialog', async dialog => {
          try { await dialog.dismiss(); } catch (e) {}
        });

        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 25000 });

        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= 1200 || totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 100);
          });

          const selectors = [
            '#cookie-notice', '.cookie-banner', '#gdpr', '.gdpr-modal',
            '[id*="cookie"]', '[class*="cookie"]', '[id*="consent"]',
            '.modal-overlay', '.popup-overlay', 'iframe[src*="chat"]', 'iframe[src*="tawk"]'
          ];
          selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
              try { el.style.display = 'none'; } catch (e) {}
            });
          });
        });

        await new Promise(r => setTimeout(r, 5000));

        await page.screenshot({ path: destPath, type: 'jpeg', quality: 90 });
        await page.close();

        if (fs.existsSync(destPath) && fs.statSync(destPath).size >= 15000) {
          const fileSizeKB = (fs.statSync(destPath).size / 1024).toFixed(1);
          console.log(`  ✓ Chrome Render Success: public/screenshots/${fileName} (${fileSizeKB} KB)`);
          captured = true;
          chromeSuccess++;
        } else {
          console.warn(`  ⚠ Chrome generated file too small, proceeding to fallback...`);
        }
      } catch (err) {
        console.warn(`  ⚠ Chrome Puppeteer failed for ${p.title}: ${err.message}`);
      }
    }

    // Method 2: API Fallback (Thum.io)
    if (!captured) {
      try {
        console.log(`  -> Trying API Fallback (Thum.io wait 8s)...`);
        const fallbackUrl = `https://image.thum.io/get/width/1200/crop/750/wait/8/noanimate/${p.url}`;
        await downloadImageFallback(fallbackUrl, destPath);
        const fileSizeKB = (fs.statSync(destPath).size / 1024).toFixed(1);
        console.log(`  ✓ API Fallback Success: public/screenshots/${fileName} (${fileSizeKB} KB)`);
        captured = true;
        apiFallbackSuccess++;
      } catch (err) {
        console.warn(`  ⚠ Thum.io API failed: ${err.message}`);
      }
    }

    // Method 3: WordPress mshots fallback
    if (!captured) {
      try {
        console.log(`  -> Trying Backup API Fallback (WordPress mshots)...`);
        const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(p.url)}?w=1200&h=800`;
        await downloadImageFallback(mshotsUrl, destPath);
        const fileSizeKB = (fs.statSync(destPath).size / 1024).toFixed(1);
        console.log(`  ✓ WordPress MShots Fallback Success: public/screenshots/${fileName} (${fileSizeKB} KB)`);
        captured = true;
        apiFallbackSuccess++;
      } catch (err) {
        console.warn(`  ✗ All 3 methods failed for ${p.title}: ${err.message}`);
        totalFailed++;
      }
    }
  }

  if (browser) await browser.close();

  console.log('\n===========================================');
  console.log('SCREENSHOT CAPTURE PROCESS COMPLETED!');
  console.log(`Skipped existing OK images: ${skippedOkCount}`);
  console.log(`Chrome Puppeteer success: ${chromeSuccess}`);
  console.log(`API Fallbacks success: ${apiFallbackSuccess}`);
  console.log(`Total Failed: ${totalFailed}`);
  console.log('===========================================\n');
}

captureAllScreenshots();
