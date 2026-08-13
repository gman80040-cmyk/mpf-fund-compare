/** 港島理財報章：驗證新手從教學、搜尋、資料頁分享至比較籃的完整中立資訊閱讀流程。 */
import { expect, test } from "@playwright/test";

const siteBase = process.env.GITHUB_ACTIONS ? "/mpf-fund-compare" : "";

test("starter guide explains the neutral MPF reading path and cites official resources", async ({ page }) => {
  await page.goto(`${siteBase}/`);
  await page.getByRole("link", { name: "新手傻瓜包" }).click();
  await expect(page.getByRole("heading", { name: /第一次睇 MPF/ })).toBeVisible();
  await expect(page.getByText("6 步，建立自己的 MPF 閱讀習慣。")).toBeVisible();
  await expect(page.getByRole("link", { name: "積金局：MPF 傻瓜包" })).toHaveAttribute("href", /mpfa\.org\.hk/);
  await expect(page.getByText("排名及數字不等於建議。")).toBeVisible();
});

test("search leads to a shareable data sheet rather than a recommendation", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`${siteBase}/`);
  const search = page.getByPlaceholder("搜尋基金、供應商或計劃，例如「香港股票」");
  await expect(search).toBeVisible();
  await search.fill("AIA");
  await page.getByRole("link", { name: "大中華股票基金", exact: true }).click();
  await expect(page.getByRole("heading", { name: "大中華股票基金" })).toBeVisible();
  await page.getByRole("button", { name: "複製連結" }).click();
  await expect(page.getByText("已複製目前連結")).toBeVisible();
  await expect(page.getByText(/排名只反映所選同類別/)).toBeVisible();
});

test("comparison tray accepts two fund records and opens the side-by-side page", async ({ page }) => {
  await page.goto(`${siteBase}/`);
  await expect(page.getByText(/296 隻基金/)).toBeVisible();
  const addButtons = page.getByRole("button", { name: "加入比較" });
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
  await page.getByRole("link", { name: "比較已選基金" }).click();
  await expect(page.getByRole("heading", { name: "把數字放回同一張資料表。" })).toBeVisible();
});
