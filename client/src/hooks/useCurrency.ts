import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BASE_PRICE_GBP, 
  COUNTRY_CURRENCIES, 
  DEFAULT_CURRENCY,
  formatPrice,
  type CountryCurrency 
} from '@shared/currency';

interface LocationData {
  country: string;
  currency?: string;
}

interface ExchangeRates {
  [key: string]: number;
}

export function useCurrency() {
  const [detectedCurrency, setDetectedCurrency] = useState<CountryCurrency>(DEFAULT_CURRENCY);

  // Detect user's location and currency
  const { data: locationData } = useQuery<LocationData>({
    queryKey: ['user-location'],
    queryFn: async () => {
      try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          return {
            country: data.country_code,
            currency: data.currency
          };
        }
      } catch (error) {
        console.log('Could not detect location, using default');
      }
      
      // Fallback: try to detect from browser locale
      try {
        const locale = navigator.language || 'en-GB';
        const region = locale.split('-')[1];
        if (region && COUNTRY_CURRENCIES[region]) {
          return {
            country: region,
            currency: COUNTRY_CURRENCIES[region].currency
          };
        }
      } catch (error) {
        console.log('Could not detect from locale');
      }
      
      return { country: 'GB' };
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 1
  });

  // Get exchange rates
  const { data: exchangeRates, isLoading: ratesLoading } = useQuery<ExchangeRates>({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      try {
        // Use a free exchange rate API with error handling
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
        if (response.ok) {
          const data = await response.json();
          return data.rates;
        }
        throw new Error('Exchange rate API failed');
      } catch (error) {
        console.log('Could not fetch exchange rates, using fallback');
      }
      
      // Fallback rates if API fails
      return {
        USD: 1.27,
        EUR: 1.20,
        CAD: 1.71,
        AUD: 1.89,
        JPY: 192,
        KRW: 1654,
        INR: 107,
        BRL: 7.31,
        MXN: 25.5,
        SGD: 1.71,
        CHF: 1.14,
        SEK: 13.2,
        NOK: 13.8,
        DKK: 8.95,
        PLN: 5.15,
        CZK: 28.8,
        HUF: 389,
        GBP: 1
      };
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    retry: 1
  });

  // Update detected currency when location data changes
  useEffect(() => {
    if (locationData?.country && COUNTRY_CURRENCIES[locationData.country]) {
      setDetectedCurrency(COUNTRY_CURRENCIES[locationData.country]);
    }
  }, [locationData]);

  // Calculate localized price
  const getLocalizedPrice = () => {
    if (!exchangeRates || ratesLoading) {
      return {
        amount: BASE_PRICE_GBP,
        currency: DEFAULT_CURRENCY.currency,
        symbol: DEFAULT_CURRENCY.symbol,
        formatted: formatPrice(BASE_PRICE_GBP, DEFAULT_CURRENCY.currency, DEFAULT_CURRENCY.symbol),
        isLoading: true
      };
    }

    const rate = exchangeRates[detectedCurrency.currency] || 1;
    const localAmount = BASE_PRICE_GBP * rate;
    
    return {
      amount: localAmount,
      currency: detectedCurrency.currency,
      symbol: detectedCurrency.symbol,
      formatted: formatPrice(localAmount, detectedCurrency.currency, detectedCurrency.symbol),
      isLoading: false
    };
  };

  return {
    detectedCurrency,
    localizedPrice: getLocalizedPrice(),
    isLoading: ratesLoading || !exchangeRates
  };
}