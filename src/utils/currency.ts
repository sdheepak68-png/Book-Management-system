/**
 * Indian Rupee (INR - ₹) Currency Formatting Utilities
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Formats a numeric price into standard Indian Rupee notation (e.g. ₹1,499.00 or ₹499)
 */
export const formatINR = (amount: number, showDecimals: boolean = false): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  // If amount has decimal cents (like .50), keep 2 decimals, otherwise allow clean integer or standard 2 decimals
  const hasDecimals = amount % 1 !== 0;

  if (showDecimals || hasDecimals) {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format price with decimals always (for invoices, checkout summaries)
 */
export const formatINRExact = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
