import { test, expect } from "@playwright/test";
import { writeFile } from "fs/promises";

// this is the information we want to track for each medication
// good to track for other potential programs
type MedicineInfo = {
  link: string;
};

test("Scrape medicine data", async ({ page }) => {
  await page.goto("https://www.nhs.uk/medicines/");
  await expect(page.getByText("Medicines A to Z")).toBeVisible();

  const medicines: Record<string, MedicineInfo> = {};
  const filepath = "medicines.json";

  const allLinks = await page.getByRole("link").all();
  const validRegex = /^\/medicines\/(?!#).+$/;
  for (const linkObj of allLinks) {
    const medName = await linkObj.innerText();
    const medLink = await linkObj.getAttribute("href");
    if (medLink == null) {
      console.log(`link with text ${medName} is null, did your locator break?`);
      continue;
    }
    if (validRegex.test(medLink) && !medName.includes(", see ")) {
      medicines[medName] = { link: medLink };
    }
  }

  await writeFile(filepath, JSON.stringify(medicines));
  await page.close();
});
