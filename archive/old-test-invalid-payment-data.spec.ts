import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking-page';
import { PaymentPage } from '../pages/payment-page';
import { BaseUtils } from '../utils/base-utils';

test.describe('Payment Step - Security & Validation', () => {
  let bookingPage: BookingPage;
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
    paymentPage = new PaymentPage(page);
    
    // Step 1: Complete initial flow to reach Payment Step
    await bookingPage.navigateTo('/booking');
    await bookingPage.enterIdentityInfo(BaseUtils.getDobByAge(35), 'FEMALE');
    await bookingPage.clickNext();
    
    // Ensure we are on the payment step before proceeding
    await expect(page).toHaveURL(/.*payment/);
  });

  test('Case #8: Invalid Card - Luhn Algorithm Failure', async ({ page }) => {
    // 4242...4241 is a standard Stripe "Luhn-invalid" test card
    await paymentPage.enterPaymentDetails('4242 4242 4242 4241', '12/30', '123');
    
    await paymentPage.submitPayment();

    // Assert that the UI captures the validation error
    const errorText = await paymentPage.getErrorMessageText();
    expect(errorText).toContain('Your card number is invalid');
  });

  test('Case #11: Page Refresh - Data Persistence', async ({ page }) => {
    await paymentPage.enterPaymentDetails('4242 4242 4242 4242', '12/30', '123');
    
    await page.reload();
    
    // After reload, verify the session hasn't been lost (Case #4 & #11 logic)
    await expect(page).toHaveURL(/.*payment/);
  });
});