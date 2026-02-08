export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(\+971|971|0)?[0-9]{9,10}$/;
export const NATIONAL_ID_REGEX = /^784-?[0-9]{4}-?[0-9]{7}-?[0-9]$/;

export function validateLuhn(id: string): boolean {
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length !== 15) return false;

  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let n = parseInt(cleaned[i], 10);
    // Multiply every second digit by 2 starting from the right (index 13, 11, 9...)
    // Since total length is 15, index 14 is the check digit.
    // So we double digits at index 13, 11, 9, 7, 5, 3, 1.
    if (i % 2 === 1 && i < 14) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('971')) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith('0')) {
    return `+971${cleaned.substring(1)}`;
  }

  if (cleaned.length === 9) {
    return `+971${cleaned}`;
  }

  return phone;
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return PHONE_REGEX.test(cleaned);
}

export function validateNationalId(id: string): boolean {
  return NATIONAL_ID_REGEX.test(id);
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export interface TimeAgoResult {
  key: string;
  count?: number;
}

export function getTimeAgoKey(date: Date): TimeAgoResult {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return { key: 'autosave.justNow' };
  }

  if (diffMins < 60) {
    return { key: 'autosave.minutesAgo', count: diffMins };
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return {
      key: diffHours === 1 ? 'autosave.hoursAgo' : 'autosave.hoursAgoPlural',
      count: diffHours,
    };
  }

  const diffDays = Math.floor(diffHours / 24);
  return {
    key: diffDays === 1 ? 'autosave.daysAgo' : 'autosave.daysAgoPlural',
    count: diffDays,
  };
}
