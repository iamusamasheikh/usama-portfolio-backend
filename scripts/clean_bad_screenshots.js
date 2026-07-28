import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicScreenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

const badSlugs = [
  'willis_rv_resort',
  'sheldon_lake_rv',
  'solved_medcare',
  'drive_click_one',
  'allesgo_mega_mall',
  'soul_canvas_ie',
  'art_2_desire',
  'xeryab_clothing',
  'flat_rate_airport_limo',
  'next_level_livery',
  'insta_stitchez',
  'brazier_co',
  'maple_eye_toys',
  'fixer_car_ae'
];

let removed = 0;
badSlugs.forEach(slug => {
  const filePath = path.join(publicScreenshotsDir, `${slug}.jpg`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted bad/Cloudflare screenshot: ${slug}.jpg`);
    removed++;
  }
});

console.log(`Cleaned ${removed} bad screenshots.`);
