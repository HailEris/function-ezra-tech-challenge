import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/booking-page';
import { PaymentPage } from '../pages/payment-page';
import { BaseUtils } from '../utils/base-utils';

test.describe('Booking - End-to-End Smoke Test', () => {
  test('Complete successful booking flow with valid credentials', async ({ page }) => {
    const bookingPage = new BookingPage(page);
    const paymentPage = new PaymentPage(page);

     // 1. Perform Login using the injected Env Vars
    await bookingPage.navigateTo('/sign-in');
    await bookingPage.handleOverlays();
    await page.fill('input[name="email"]', process.env.MEM_PORTAL_UN!);
    await page.fill('input[name="password"]', process.env.MEM_PORTAL_PW!);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

     // 2. Proceed with the Booking Flow
    await bookingPage.navigateTo('/booking');
    await bookingPage.enterIdentityInfo(BaseUtils.getDobByAge(30), 'MALE');
    await bookingPage.clickNext();

    // Step 3: Transition to Payment
    await expect(page).toHaveURL(/.*payment/);

    // Step 4: Secure Checkout via Stripe
    // Using standard Stripe test card (Success)
    await paymentPage.enterPaymentDetails('4242 4242 4242 4242', '12/30', '123');
    await paymentPage.submitPayment();

    // Final Assertion
    await expect(page).toHaveURL(/.*confirmation/);
  });
});
