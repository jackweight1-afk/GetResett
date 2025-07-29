export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

export interface CountryCurrency {
  country: string;
  currency: string;
  symbol: string;
}

// Base price in GBP (our reference currency)
export const BASE_PRICE_GBP = 1.99;

// Common currency mappings
export const COUNTRY_CURRENCIES: Record<string, CountryCurrency> = {
  'US': { country: 'United States', currency: 'USD', symbol: '$' },
  'GB': { country: 'United Kingdom', currency: 'GBP', symbol: '£' },
  'CA': { country: 'Canada', currency: 'CAD', symbol: 'C$' },
  'AU': { country: 'Australia', currency: 'AUD', symbol: 'A$' },
  'DE': { country: 'Germany', currency: 'EUR', symbol: '€' },
  'FR': { country: 'France', currency: 'EUR', symbol: '€' },
  'IT': { country: 'Italy', currency: 'EUR', symbol: '€' },
  'ES': { country: 'Spain', currency: 'EUR', symbol: '€' },
  'NL': { country: 'Netherlands', currency: 'EUR', symbol: '€' },
  'JP': { country: 'Japan', currency: 'JPY', symbol: '¥' },
  'KR': { country: 'South Korea', currency: 'KRW', symbol: '₩' },
  'IN': { country: 'India', currency: 'INR', symbol: '₹' },
  'BR': { country: 'Brazil', currency: 'BRL', symbol: 'R$' },
  'MX': { country: 'Mexico', currency: 'MXN', symbol: '$' },
  'SG': { country: 'Singapore', currency: 'SGD', symbol: 'S$' },
  'CH': { country: 'Switzerland', currency: 'CHF', symbol: 'Fr' },
  'SE': { country: 'Sweden', currency: 'SEK', symbol: 'kr' },
  'NO': { country: 'Norway', currency: 'NOK', symbol: 'kr' },
  'DK': { country: 'Denmark', currency: 'DKK', symbol: 'kr' },
  'PL': { country: 'Poland', currency: 'PLN', symbol: 'zł' },
  'CZ': { country: 'Czech Republic', currency: 'CZK', symbol: 'Kč' },
  'HU': { country: 'Hungary', currency: 'HUF', symbol: 'Ft' },
  'RO': { country: 'Romania', currency: 'RON', symbol: 'lei' },
  'BG': { country: 'Bulgaria', currency: 'BGN', symbol: 'лв' },
  'HR': { country: 'Croatia', currency: 'EUR', symbol: '€' },
  'SI': { country: 'Slovenia', currency: 'EUR', symbol: '€' },
  'SK': { country: 'Slovakia', currency: 'EUR', symbol: '€' },
  'LT': { country: 'Lithuania', currency: 'EUR', symbol: '€' },
  'LV': { country: 'Latvia', currency: 'EUR', symbol: '€' },
  'EE': { country: 'Estonia', currency: 'EUR', symbol: '€' },
  'IE': { country: 'Ireland', currency: 'EUR', symbol: '€' },
  'PT': { country: 'Portugal', currency: 'EUR', symbol: '€' },
  'GR': { country: 'Greece', currency: 'EUR', symbol: '€' },
  'CY': { country: 'Cyprus', currency: 'EUR', symbol: '€' },
  'MT': { country: 'Malta', currency: 'EUR', symbol: '€' },
  'LU': { country: 'Luxembourg', currency: 'EUR', symbol: '€' },
  'BE': { country: 'Belgium', currency: 'EUR', symbol: '€' },
  'AT': { country: 'Austria', currency: 'EUR', symbol: '€' },
  'FI': { country: 'Finland', currency: 'EUR', symbol: '€' },
};

// Default fallback currency
export const DEFAULT_CURRENCY: CountryCurrency = COUNTRY_CURRENCIES['GB'];

export function formatPrice(amount: number, currency: string, symbol: string): string {
  // Special formatting for currencies
  switch (currency) {
    case 'JPY':
    case 'KRW':
      // No decimal places for these currencies
      return `${symbol}${Math.round(amount)}`;
    case 'USD':
    case 'CAD':
    case 'AUD':
    case 'SGD':
      return `${symbol}${amount.toFixed(2)}`;
    case 'EUR':
    case 'GBP':
      return `${symbol}${amount.toFixed(2)}`;
    case 'INR':
      return `${symbol}${amount.toFixed(0)}`;
    case 'BRL':
    case 'MXN':
      return `${symbol}${amount.toFixed(2)}`;
    default:
      return `${symbol}${amount.toFixed(2)}`;
  }
}