export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(\+971|971|0)?[0-9]{9,10}$/;
export const NATIONAL_ID_REGEX = /^[0-9]{15}$/;

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

export function getTimeAgo(date: Date, locale: 'en' | 'ar'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return locale === 'ar' ? 'الآن' : 'Just now';
  }

  if (diffMins < 60) {
    return locale === 'ar' ? `${diffMins} دقيقة مضت` : `${diffMins} min ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return locale === 'ar' ? `${diffHours} ساعة مضت` : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return locale === 'ar' ? `${diffDays} يوم مضى` : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
