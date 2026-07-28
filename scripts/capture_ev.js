import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('Capturing Engel & Völkers clean post-cookie-consent screenshot...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.25 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto('https://www.engelvoelkers.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // Click accept button or hide cookie overlays
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      for (const btn of buttons) {
        const text = (btn.innerText || '').toLowerCase();
        if (text.includes('accept all') || text.includes('agree') || text.includes('alle akzeptieren') || text.includes('accept') || text.includes('zustimmen')) {
          try { btn.click(); break; } catch(e){}
        }
      }

      const selectors = [
        '#usercentrics-root', '#onetrust-consent-sdk', '.cookie-banner', '#cookie-notice',
        '[id*="cookie"]', '[class*="cookie"]', '[id*="uc-"]', '[class*="consent"]'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          try { el.style.display = 'none'; el.remove(); } catch(e){}
        });
      });
    });

    await new Promise(r => setTimeout(r, 4000));

    const destPath = './public/screenshots/engel_v_lkers.jpg';
    await page.screenshot({ path: destPath, type: 'jpeg', quality: 90 });
    console.log('Saved clean Engel & Völkers screenshot:', fs.statSync(destPath).size, 'bytes');

  } catch(err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
