/**
 * Format amount in UZS without currency symbol, with space as thousand separator
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(amount).replace(/,/g, ' ');
};

/**
 * Format date in dd.MM.yyyy format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Format date for input fields (yyyy-MM-dd)
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Parse date from input format to ISO string
 */
export const parseDateFromInput = (dateString: string): string => {
  return new Date(dateString).toISOString();
};