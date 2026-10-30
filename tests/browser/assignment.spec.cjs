const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
if (!process.env.COURSEMASTER_BROWSER_FIXTURES || !process.env.COURSEMASTER_BROWSER_CONTROL) throw Error("Set COURSEMASTER_BROWSER_FIXTURES and COURSEMASTER_BROWSER_CONTROL to the isolated fixture and control JSON files.");
const fixtures = JSON.parse(fs.readFileSync(process.env.COURSEMASTER_BROWSER_FIXTURES, "utf8"));
const controlFile = process.env.COURSEMASTER_BROWSER_CONTROL;
const evidence = process.env.COURSEMASTER_BROWSER_EVIDENCE || path.resolve(__dirname, "../../../../../outputs/course-master/evidence/browser");
fs.mkdirSync(evidence, { recursive: true });
const control = (state) => fs.writeFileSync(controlFile, JSON.stringify(state));
const player = "/courses/" + fixtures.courseId + "/player";
async function login(page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').fill(fixtures.email);
  await page.locator('input[name="password"]').fill("BrowserTest123!");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
}
async function capture(page, name) {
  await page.screenshot({ path: path.join(evidence, name + ".png"), fullPage: true });
}
test.describe.configure({ mode: "default" });
test.beforeEach(async ({ page, request }, testInfo) => {
  control({});
  fixtures.email = "browser.student." + Date.now() + "." + Math.random().toString(16).slice(2) + "@example.test";
  const registration = process.env.COURSEMASTER_BROWSER_API || "http://127.0.0.1:5001/api/auth/register";
  const response = await request.post(registration, { data: { name: "Browser Verification Student", email: fixtures.email, password: "BrowserTest123!" } });
  expect(response.status()).toBe(201);
  const auth = await response.json();
  if (!testInfo.title.includes("BUG-021")) {
    const enrollment = await request.post(registration.replace("/auth/register", "/enrollments/") + fixtures.courseId, { headers: { Authorization: "Bearer " + auth.token }, data: { batchId: fixtures.batchId } });
    expect(enrollment.status()).toBe(201);
  }
  await page.route("**/*youtube.com/**", (route) => route.abort());
});
test.afterEach(() => control({}));
test("BUG-021 first batch enrollment sends its actual identifier", async ({ page }) => {
  await login(page);
  await page.goto("/courses/" + fixtures.courseId);
  await page.getByText("First Browser Batch", { exact: true }).click();
  await expect(page.getByText("Batch selected for enrollment", { exact: false })).toBeVisible();
  const requestPromise = page.waitForRequest((r) => r.url().includes("/api/enrollments/" + fixtures.courseId) && r.method() === "POST");
  const responsePromise = page.waitForResponse((r) => r.url().includes("/api/enrollments/" + fixtures.courseId) && r.request().method() === "POST");
  await page.getByRole("button", { name: "Enroll Now", exact: true }).click();
  const request = await requestPromise;
  expect(request.postDataJSON().batchId).toBe(fixtures.batchId);
  expect((await responsePromise).status()).toBe(201);
  await expect(page).toHaveURL(/\/student$/);
  await capture(page, "bug-021-enrollment");
});
test("BUG-022 completed lesson button is disabled and persists after reload", async ({ page }) => {
  await login(page);
  await page.goto(player);
  const button = page.getByRole("button", { name: "Mark as Complete", exact: false });
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.getByRole("button", { name: "Completed", exact: false })).toBeDisabled();
  await page.reload();
  await expect(page.getByRole("button", { name: "Completed", exact: false })).toBeDisabled();
  await capture(page, "bug-022-completed");
});
test("BUG-023 and BUG-019 mobile and desktop layout fit their containers", async ({ page }) => {
  await login(page);
  for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(player);
    const video = page.locator('iframe[title="Lesson One"]');
    await expect(video).toBeVisible();
    const rect = await video.boundingBox();
    expect(rect.width).toBeGreaterThan(200);
    expect(Math.abs(rect.width / rect.height - 16 / 9)).toBeLessThan(0.05);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await capture(page, "bug-023-video-" + viewport.width);
    await page.goto("/courses");
    const heading = page.getByRole("heading", { name: "Browser Course One With A Long Title For Responsive Layout Testing", exact: true });
    const titleRect = await heading.boundingBox();
    expect(titleRect.x).toBeGreaterThanOrEqual(0);
    expect(titleRect.x + titleRect.width).toBeLessThanOrEqual(viewport.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await capture(page, "bug-019-cards-" + viewport.width);
  }
});
test("BUG-024 only the current desktop navigation link is active", async ({ page }) => {
  await page.goto("/courses");
  const home = page.getByRole("banner").getByRole("link", { name: "Home", exact: true });
  const courses = page.getByRole("banner").getByRole("link", { name: "Courses", exact: true });
  await expect(courses).toHaveClass(/(^|\s)text-primary(\s|$)/);
  await expect(home).not.toHaveClass(/(^|\s)text-primary(\s|$)/);
  await home.click();
  await expect(home).toHaveClass(/(^|\s)text-primary(\s|$)/);
  await expect(courses).not.toHaveClass(/(^|\s)text-primary(\s|$)/);
  await capture(page, "bug-024-active-navigation");
});
test("BUG-025 lesson switching resets drafts, quiz choices, and submission display", async ({ page }) => {
  await login(page);
  await page.goto(player);
  const textarea = page.getByPlaceholder("Enter your answer or paste Google Drive link");
  await textarea.fill("Draft for the first lesson");
  await page.locator('input[name="quiz-' + fixtures.lessonIds[0] + '-0"]').nth(1).check();
  await page.locator('input[name="quiz-' + fixtures.lessonIds[0] + '-1"]').nth(0).check();
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(2);
  await page.getByRole("button", { name: "Lesson Two", exact: false }).click();
  await expect(textarea).toHaveValue("");
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(page.getByText("Explain lesson two", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Lesson One", exact: false }).click();
  await expect(textarea).toHaveValue("");
  await page.locator('input[name="quiz-' + fixtures.lessonIds[0] + '-0"]').nth(1).check();
  await page.locator('input[name="quiz-' + fixtures.lessonIds[0] + '-1"]').nth(0).check();
  await page.getByRole("button", { name: "Submit Quiz", exact: true }).click();
  await expect(page.getByText("Previously Submitted", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Lesson Two", exact: false }).click();
  await expect(page.getByText("Previously Submitted", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Submit Quiz", exact: true })).toBeVisible();
  await capture(page, "bug-025-independent-lesson-state");
});
test("BUG-026 bypass flags and failed session verification cannot grant access", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("dev_bypass", "true"));
  await page.goto("/student?bypass=true");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Sign In", exact: true })).toBeVisible();
  await login(page);
  control({ failAuth: true });
  await page.goto("/student?bypass=true");
  await expect(page.getByRole("alert")).toContainText("Simulated session verification failure");
  await capture(page, "bug-026-failed-verification");
  control({});
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Retry", exact: true })).toHaveCount(0);
});
test("BUG-027 searching from page two requests and displays page one", async ({ page }) => {
  await page.goto("/courses");
  await page.getByPlaceholder("Search by title / instructor").fill("Browser Course");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Page 2 / 2", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Search by title / instructor").fill("Browser Course 02");
  const requestPromise = page.waitForRequest((r) => r.url().includes("/api/courses?") && new URL(r.url()).searchParams.get("search") === "Browser Course 02");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const url = new URL((await requestPromise).url());
  expect(url.searchParams.get("page")).toBe("1");
  await expect(page.getByRole("heading", { name: "Browser Course 02", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browser Course 09", exact: true })).toHaveCount(0);
  await capture(page, "bug-027-search-page-reset");
});
test("BUG-029 course loading and completion failures are visible and recoverable", async ({ page }) => {
  await login(page);
  control({ failEnrollments: true });
  await page.goto(player);
  await expect(page.getByRole("alert")).toContainText("Simulated enrollment loading failure");
  control({});
  await page.reload();
  await expect(page.getByRole("heading", { name: "Lesson One", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Lesson Two", exact: false }).click();
  control({ failCompletion: true });
  await page.getByRole("button", { name: "Mark as Complete", exact: false }).click();
  await expect(page.getByRole("alert")).toContainText("Simulated lesson completion failure");
  await capture(page, "bug-029-completion-error");
  control({});
  await page.getByRole("button", { name: "Mark as Complete", exact: false }).click();
  await expect(page.getByRole("button", { name: "Completed", exact: false })).toBeDisabled();
  await page.goto("/courses/" + fixtures.otherCourseId + "/player");
  await expect(page.getByRole("heading", { name: "Browser Course 02", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browser Course One With A Long Title For Responsive Layout Testing", exact: true })).toHaveCount(0);
});
