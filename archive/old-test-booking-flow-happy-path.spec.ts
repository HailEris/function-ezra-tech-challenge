import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking-page';
import { BaseUtils } from '../utils/base-utils';

test.describe('Booking Flow - Step 1', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    // Navigate using the helper in BasePage
    await bookingPage.navigateTo('/booking'); 
  });

  test('Case #1: Successful Step 1 Completion (Happy Path)', async ({ page }) => {
    const validDob = BaseUtils.getDobByAge(30); // Dynamic age 30
    await bookingPage.enterIdentityInfo(validDob, 'MALE');
    
    // Assert using the 'page' fixture directly to avoid "protected" errors
    const isEnabled = await bookingPage.isButtonEnabled('button:has-text("Next")');
    expect(isEnabled).toBeTruthy();
    
    await bookingPage.clickNext();
    
    // Validate we transitioned to the next step
    await expect(page).toHaveURL(/.*step2/);
  });

  test('Case #15: Underage User Validation (Boundary)', async ({ page }) => {
    const underageDob = BaseUtils.getDobByAge(17); // Dynamic age 17
    await bookingPage.enterIdentityInfo(underageDob, 'FEMALE');
    
    // Verify the error message logic from the source code
    const errorVisible = await bookingPage.isAgeErrorVisible();
    expect(errorVisible).toBe(true);
    
    // Verify "Next" remains disabled (Case #7)
    const isEnabled = await bookingPage.isButtonEnabled('button:has-text("Next")');
    expect(isEnabled).toBeFalsy();
  });
});
