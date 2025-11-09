import { test, expect } from "@playwright/test";
import { writeFile } from "fs/promises";

// this is the information we want to track for each medication
// good to track for other potential programs
type MedicineInfo = {
  link: string;
  brandNames?: string[];
  sideEffects?: string[];
};

test("Scrape medicine data", async ({ page }) => {
  // variables to eventually save data
  const medicines: Record<string, MedicineInfo> = {};
  const filepath = "medicines.json";

  // navigates to page, makes sure it loads
  const baseURL = "https://www.nhs.uk";
  await page.goto(baseURL + "/medicines");
  await expect(page.getByText("Medicines A to Z")).toBeVisible();

  // collects all medicine names and links from pages, saves
  const allLinks = await page.getByRole("link").all();
  const validRegex = /^\/medicines\/(?!#).+$/;

  for (const linkObj of allLinks) {
    const medName = await linkObj.innerText();
    const medLink = await linkObj.getAttribute("href");
    // mostly safety for sensitive locators
    if (medLink == null) {
      console.log(`link with text ${medName} is null, did your locator break?`);
      continue;
    }
    // makes sure it's a medicine link and removes brand-name duplicates
    if (validRegex.test(medLink) && !medName.includes(", see ")) {
      medicines[medName] = { link: baseURL + medLink };
    }
  }

  // loads each page, makes sure it loaded
  for (const medName of Object.keys(medicines)) {
    await page.goto(medicines[medName].link);
    await expect(page.getByText(medName).first()).toBeVisible();

    // now let's get some information! beginning with brand names
    // for some reason there are two caption classes for brand names
    // one of which has less consistent formatting
    let brandLocator = page.locator(".nhsuk-caption-xl");
    let easyCaption = true;
    if (!(await brandLocator.isVisible())) {
      brandLocator = page.locator(".nhsuk-lede-text");
      easyCaption = false;
    }

    // if brand names are visible, we collect them
    if (await brandLocator.isVisible()) {
      let brandString: string = await brandLocator.innerText();
      if (!easyCaption) {
        if (!brandString.includes("rand name")) {
          brandString = "";
        } else {
          brandString = brandString.split(".").at(0) ?? "";
        }
      }

      // attempts to pull out of string
      brandString = brandString.split(": ").at(-1) ?? "";
      
      // removes leading punctuation and whitespace, which sometimes makes it in
      brandString = brandString.replace(/^[^a-zA-Z0-9_]+/, '');
      
      if (brandString.length > 0) {
        medicines[medName].brandNames = brandString.split(", ");
      }
    }
  }

  await writeFile(filepath, JSON.stringify(medicines));
  await page.close();
});
