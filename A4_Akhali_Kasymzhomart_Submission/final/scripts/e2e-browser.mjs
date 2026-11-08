// Real-browser check of the feature scenarios + screenshots. Not part of `npm test`.
// Needs Playwright (npm i -D playwright, then npx playwright install chromium) and the built app:
//   npm run build && npm run preview   (serves http://localhost:4173)
//   node scripts/e2e-browser.mjs [outDir]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.APP_URL ?? 'http://localhost:4173';
const out = process.argv[2] ?? 'shots';
mkdirSync(out, { recursive: true });
let failed = 0;
const check = (name, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`); if (!ok) failed++; };

const browser = await chromium.launch();
async function open(width, height) {
  const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
  await page.goto(URL);
  return page;
}
const names = async (page) => (await page.locator('section[aria-label="Matching rooms"] button').allInnerTexts()).map((t) => t.split('\n')[0]);
async function times(page, s, e) { await page.getByLabel(/^Start/).fill(s); await page.getByLabel(/^End/).fill(e); await page.getByRole('button', { name: /check availability/i }).click(); }

// Desktop scenarios
let page = await open(1100, 900);
check('all 5 rooms listed at start', (await names(page)).length === 5);
await page.screenshot({ path: `${out}/01_all_rooms.png`, fullPage: true });

await page.getByLabel('Attendees').fill('30');
check('capacity 30 -> A-101 and C-310 (exact capacity matches)', (await names(page)).join('|') === 'Lecture Hall A-101|Computer Lab C-310');
await page.screenshot({ path: `${out}/02_capacity_30_exact.png`, fullPage: true });
await page.getByLabel('Attendees').fill('31');
check('capacity 31 -> only A-101 (insufficient capacity excluded)', (await names(page)).join('|') === 'Lecture Hall A-101');
await page.screenshot({ path: `${out}/03_capacity_31_insufficient.png`, fullPage: true });

await page.getByLabel('Attendees').fill('');
await page.getByLabel('Video conference').check();
check('video conference -> A-101 and Studio E-402', (await names(page)).join('|') === 'Lecture Hall A-101|Studio E-402');
await page.getByLabel('Computers').check();
check('computers + video conference -> empty state', await page.getByText('No rooms match your requirements').isVisible());
await page.screenshot({ path: `${out}/04_empty_state.png`, fullPage: true });
await page.getByRole('button', { name: 'Clear filters' }).click();
check('Clear filters restores all rooms', (await names(page)).length === 5);

// Room switching with the same slot
await times(page, '660', '720');
check('B-204: 660-720 AVAILABLE (touching)', await page.getByText('AVAILABLE', { exact: true }).isVisible());
await page.screenshot({ path: `${out}/05_b204_available.png`, fullPage: true });
await page.getByRole('button', { name: /Lecture Hall A-101/ }).click();
check('switch to A-101: same slot refreshes to UNAVAILABLE (overlap 570-690)', await page.getByText('Overlaps booking 570-690').isVisible());
await page.screenshot({ path: `${out}/06_switch_a101_unavailable.png`, fullPage: true });
await page.getByRole('button', { name: /Seminar Room D-015/ }).click();
check('switch to D-015 (no bookings): AVAILABLE again', await page.getByText('AVAILABLE', { exact: true }).isVisible());
await page.getByRole('button', { name: /Studio E-402/ }).click();
check('switch to blocked E-402: "Room is blocked"', await page.getByText('Room is blocked').isVisible());
await page.screenshot({ path: `${out}/07_blocked_room.png`, fullPage: true });
check('no horizontal scroll on desktop', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

// Mobile 360 px
page = await open(360, 800);
await page.getByLabel('Attendees').fill('10');
await page.getByLabel('Projector').check();
await page.getByRole('button', { name: /Room B-204/ }).click();
await times(page, '630', '690');
check('360px: overlap message visible', await page.getByText('Overlaps booking 600-660').isVisible());
check('360px: no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
await page.screenshot({ path: `${out}/08_mobile_360.png`, fullPage: true });

await browser.close();
console.log(failed === 0 ? '\nALL BROWSER CHECKS PASSED' : `\n${failed} BROWSER CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
