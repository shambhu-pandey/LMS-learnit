import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const [, , email, password, courseId, outDir] = process.argv;

if (!email || !password || !outDir) {
  throw new Error("Usage: node temp-capture-ui.mjs <email> <password> <courseId> <outDir>");
}

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });

await page.goto("http://127.0.0.1:5173/signin", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(outDir, "signin.png"),
  fullPage: true,
});

await page.fill("#signin-email", email);
await page.fill("#signin-password", password);

await Promise.all([
  page.waitForURL("**/dashboard", { timeout: 15000 }),
  page.click('button[type="submit"]'),
]);

await page.waitForLoadState("networkidle");
await page.waitForSelector(".dashboard-hero", { timeout: 15000 });
await page.screenshot({
  path: path.join(outDir, "dashboard.png"),
  fullPage: true,
});

await page.goto("http://127.0.0.1:5173/courses", { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(outDir, "courses.png"),
  fullPage: true,
});

if (courseId) {
  await page.goto(`http://127.0.0.1:5173/course/${courseId}`, {
    waitUntil: "networkidle",
  });
  await page.screenshot({
    path: path.join(outDir, "course-view.png"),
    fullPage: true,
  });
}

await browser.close();
