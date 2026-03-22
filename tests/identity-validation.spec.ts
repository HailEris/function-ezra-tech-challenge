import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking-page';
import { BaseUtils } from '../utils/base-utils';

test.describe('Identity Form - Clinical Eligibility Logic', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    await bookingPage.navigateTo('/booking');
  });

  test('Verify minimum age requirement (18+) is enforced', async () => {
    const underageDob = BaseUtils.getDobByAge(17);
    await bookingPage.enterIdentityInfo(underageDob, 'FEMALE');
    
    // Assert clinical safety error is visible
    expect(await bookingPage.isAgeErrorVisible()).toBe(true);
    
    // Assert progression is blocked
    const isEnabled = await bookingPage.isButtonEnabled('button:has-text("Next")');
    expect(isEnabled).toBeFalsy();
  });

  test('Prevent navigation when mandatory fields are incomplete', async () => {
    // Leave DOB empty, only fill Sex
    await bookingPage.selectSex('MALE');
    
    const isEnabled = await bookingPage.isButtonEnabled('button:has-text("Next")');
    expect(isEnabled).toBeFalsy();
  });
});
