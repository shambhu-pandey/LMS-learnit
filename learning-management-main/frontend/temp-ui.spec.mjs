import fs from "fs";
import path from "path";
import { test } from "@playwright/test";

const email = process.env.UI_CAPTURE_EMAIL;
const password = process.env.UI_CAPTURE_PASSWORD;
const courseId = process.env.UI_CAPTURE_COURSE_ID;
const outDir = process.env.UI_CAPTURE_DIR;

test("capture updated ui", async ({ page }) => {
  if (!email || !password || !outDir) {
    throw new Error("Missing capture environment variables.");
  }

  fs.mkdirSync(outDir, { recursive: true });

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
});
