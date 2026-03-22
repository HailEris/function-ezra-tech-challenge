import { Page, Response } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async handleOverlays() {
    // 1. Dismiss Google One-Tap (Pressing Escape is the most reliable way)
    await this.page.keyboard.press('Escape');

    // 2. Attempt to dismiss the Cookie Banner with a short, non-blocking timeout
    const acceptButton = this.page.getByRole('button', { name: 'Accept' });
    
    try {
      await acceptButton.waitFor({ state: 'visible', timeout: 3000 });
      await acceptButton.click();
    } catch (e) {
      console.log('Cookie banner not present or already dismissed.');
    }
  }

  // Common navigation helper
  async navigateTo(path: string = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  // Wrapper for clicking to add custom waits or logging later
  async clickElement(selector: string) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  // Wrapper for filling inputs (clears field first by default)
  async typeInto(selector: string, text: string) {
    const element = this.page.locator(selector);
    await element.fill(text);
  }

  // Useful for "Next" button validation
  async isButtonEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  // Global helper to check for specific error text on any page
  async isErrorVisible(errorText: string): Promise<boolean> {
    return await this.page.isVisible(`text=${errorText}`);
  }
}