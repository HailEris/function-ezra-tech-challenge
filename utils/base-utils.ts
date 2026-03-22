import { expect } from '@playwright/test';

export class BaseUtils {

// Generates a DOB string based on an age offset from today.
// * Useful for testing "Exactly 18" vs "Under 18" without hardcoding years.
   
  static getDobByAge(yearsAgo: number): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    
    // Formatting as MM-DD-YYYY per the observed input mask in the source code
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    return `${mm}-${dd}-${yyyy}`;
  }

 //  Simple random string generator for unique test data (if needed for emails/names)
  static generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

 //  Formats a date object to the Ezra-specific ##-##-#### mask
  static formatToEzraDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '-');
  }
}