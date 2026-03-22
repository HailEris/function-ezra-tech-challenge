import { BasePage } from './base-page';

export class PaymentPage extends BasePage {
  // Use a fuzzy match for the Stripe iframe title
  private readonly stripeFrame = this.page.frameLocator('iframe[title*="Secure card payment content"]');
  
  // Locators inside the Stripe iframe
  private readonly cardNumberInput = this.stripeFrame.locator('input[name="cardnumber"]');
  private readonly expiryInput = this.stripeFrame.locator('input[name="exp-date"]');
  private readonly cvcInput = this.stripeFrame.locator('input[name="cvc"]');
  
  // Locators on the Ezra main page
  private readonly payButton = 'button:has-text("Confirm Booking")'; // Update to exact button text
  private readonly paymentErrorMessage = '.error-message-container'; // Update to actual Ezra error selector

  async enterPaymentDetails(number: string, expiry: string, cvc: string) {
    // Ensuring the frame is attached and visible before typing
    await this.cardNumberInput.waitFor({ state: 'visible' });
    await this.cardNumberInput.fill(number);
    await this.expiryInput.fill(expiry);
    await this.cvcInput.fill(cvc);
  }

  async submitPayment() {
    await this.page.click(this.payButton);
  }

  async getErrorMessageText() {
    return await this.page.textContent(this.paymentErrorMessage);
  }
}
