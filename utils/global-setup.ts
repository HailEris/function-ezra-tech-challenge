import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${baseURL}/login`);
  await page.fill('input[name="email"]', 'test-user@ezra.com'); // Replace with actual test credentials
  await page.fill('input[name="password"]', 'Password123!'); 
  await page.click('button[type="submit"]');

  // Wait for the dashboard or booking page to load to confirm success
  await page.waitForURL(`${baseURL}/booking`);

  // Save the session state (cookies/storage) to a file
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
