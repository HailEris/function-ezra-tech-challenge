import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pages/payment-page';

test.describe('Payment - Transactional Integrity', () => {
  test('Identify and report invalid credit card format (Luhn check)', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    // Navigate directly if session allows, or perform setup
    await paymentPage.navigateTo('/payment'); 
    
    // Using a Luhn-invalid test card
    await paymentPage.enterPaymentDetails('4242 4242 4242 4241', '12/30', '123');
    await paymentPage.submitPayment();
    
    const errorText = await paymentPage.getErrorMessageText();
    expect(errorText).toContain('invalid');
  });

  test('Verify session persistence on manual page refresh', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    await paymentPage.navigateTo('/payment');
    
    await page.reload();
    
    // Assert user remains in the payment context and doesn't lose state
    await expect(page).toHaveURL(/.*payment/);
  });
});
