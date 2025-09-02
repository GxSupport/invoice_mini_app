/**
 * Phone number utilities for Uzbekistan phone numbers
 */

// Uzbekistan country code
export const UZ_COUNTRY_CODE = '+998';

/**
 * Format phone number input as user types
 * Example: +998901234567 -> +998 90 123 45 67
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digits except +
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // If empty, return empty
  if (!cleaned) return '';
  
  // If doesn't start with +998, ensure it does
  let phoneNumber = cleaned;
  if (!phoneNumber.startsWith('+998')) {
    // If starts with +, remove it and add +998
    if (phoneNumber.startsWith('+')) {
      phoneNumber = '+998' + phoneNumber.slice(1);
    }
    // If starts with 998, add +
    else if (phoneNumber.startsWith('998')) {
      phoneNumber = '+' + phoneNumber;
    }
    // If starts with 9, assume it's mobile and add +998
    else if (phoneNumber.startsWith('9')) {
      phoneNumber = '+998' + phoneNumber;
    }
    // Otherwise add +998
    else {
      phoneNumber = '+998' + phoneNumber;
    }
  }
  
  // Limit to +998 + 9 digits
  if (phoneNumber.length > 13) {
    phoneNumber = phoneNumber.slice(0, 13);
  }
  
  // Format: +998 XX XXX XX XX
  if (phoneNumber.length > 4) {
    let formatted = phoneNumber.slice(0, 4); // +998
    const remaining = phoneNumber.slice(4);
    
    if (remaining.length > 0) {
      formatted += ' ' + remaining.slice(0, 2);
    }
    if (remaining.length > 2) {
      formatted += ' ' + remaining.slice(2, 5);
    }
    if (remaining.length > 5) {
      formatted += ' ' + remaining.slice(5, 7);
    }
    if (remaining.length > 7) {
      formatted += ' ' + remaining.slice(7, 9);
    }
    
    return formatted;
  }
  
  return phoneNumber;
}

/**
 * Clean phone number for API submission
 * Remove all formatting, keep only +998XXXXXXXXX
 */
export function cleanPhoneNumber(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, '');
  
  if (!cleaned.startsWith('+998')) {
    if (cleaned.startsWith('998')) {
      return '+' + cleaned;
    }
    if (cleaned.startsWith('9') && cleaned.length === 9) {
      return '+998' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Validate Uzbekistan phone number
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const cleaned = cleanPhoneNumber(phoneNumber);
  
  // Should be +998XXXXXXXXX (13 characters total)
  if (cleaned.length !== 13) return false;
  
  // Should start with +998
  if (!cleaned.startsWith('+998')) return false;
  
  // The mobile number should start with 9 (after country code)
  const mobileNumber = cleaned.slice(4); // Remove +998
  if (!mobileNumber.startsWith('9')) return false;
  
  // Should be all digits after +998
  const digits = cleaned.slice(1); // Remove +
  return /^\d{12}$/.test(digits);
}

/**
 * Get phone number validation error message
 */
export function getPhoneNumberError(phoneNumber: string): string | null {
  if (!phoneNumber.trim()) {
    return "Telefon raqami kiritilishi shart";
  }
  
  if (!isValidPhoneNumber(phoneNumber)) {
    return "Telefon raqami noto'g'ri formatda. Namuna: +998 90 123 45 67";
  }
  
  return null;
}