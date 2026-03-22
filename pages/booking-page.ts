import { BasePage } from './base-page';

export class BookingPage extends BasePage {
  // Locators based on the source code keys
  private readonly dobInput = 'input[name="dob"]';
  private readonly sexDropdown = 'select[name="sex"]';
  private readonly nextButton = 'button:has-text("Next")';
  private readonly adultAgeError = 'text=You need to be 18 years or older';

  async enterIdentityInfo(dob: string, sex: 'MALE' | 'FEMALE') {
    await this.page.fill(this.dobInput, dob);
    await this.page.selectOption(this.sexDropdown, sex);
  }

  async selectSex(sex: 'MALE' | 'FEMALE') {
    await this.page.selectOption(this.sexDropdown, sex);
  }

  async clickNext() {
    await this.page.click(this.nextButton);
  }

  async isAgeErrorVisible() {
    return await this.page.isVisible(this.adultAgeError);
  }
}