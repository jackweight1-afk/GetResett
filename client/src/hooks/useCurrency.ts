import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FIXED_LOCAL_PRICE, 
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

  // Detect user's location and currency with instant fallback
  const { data: locationData } = useQuery<LocationData>({
    queryKey: ['user-location'],
    queryFn: async () => {
      // Start with immediate browser locale detection
      let fallbackLocation = { country: 'GB' };
      try {
        const locale = navigator.language || 'en-GB';
        const region = locale.split('-')[1];
        if (region && COUNTRY_CURRENCIES[region]) {
          fallbackLocation = {
            country: region,
            currency: COUNTRY_CURRENCIES[region].currency
          } as LocationData;
        }
      } catch (error) {
        // Use default
      }

      // Try IP geolocation with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return {
            country: data.country_code,
            currency: data.currency
          };
        }
      } catch (error) {
        // Use browser locale fallback
      }
      
      return fallbackLocation;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: false, // Don't retry failed requests
    refetchOnWindowFocus: false
  });

  // Get exchange rates with immediate fallback
  const { data: exchangeRates, isLoading: ratesLoading } = useQuery<ExchangeRates>({
    queryKey: ['exchange-rates'],
    queryFn: async () => {
      // Static fallback rates - always available instantly
      const fallbackRates = {
        USD: 1.27, EUR: 1.20, CAD: 1.71, AUD: 1.89, JPY: 192, KRW: 1654,
        INR: 107, BRL: 7.31, MXN: 25.5, SGD: 1.71, CHF: 1.14, SEK: 13.2,
        NOK: 13.8, DKK: 8.95, PLN: 5.15, CZK: 28.8, HUF: 389, GBP: 1
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return data.rates;
        }
      } catch (error) {
        // Use fallback rates
      }
      
      return fallbackRates;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: false, // Don't retry - use fallback immediately
    refetchOnWindowFocus: false,
    initialData: { // Provide immediate data
      USD: 1.27, EUR: 1.20, CAD: 1.71, AUD: 1.89, JPY: 192, KRW: 1654,
      INR: 107, BRL: 7.31, MXN: 25.5, SGD: 1.71, CHF: 1.14, SEK: 13.2,
      NOK: 13.8, DKK: 8.95, PLN: 5.15, CZK: 28.8, HUF: 389, GBP: 1
    } as ExchangeRates
  });

  // Update detected currency when location data changes
  useEffect(() => {
    if (locationData?.country && COUNTRY_CURRENCIES[locationData.country]) {
      setDetectedCurrency(COUNTRY_CURRENCIES[locationData.country]);
    }
  }, [locationData]);

  // Calculate localized price using fixed local pricing (same numerical value globally)
  const getLocalizedPrice = () => {
    // No need for exchange rates - use fixed price in each currency
    return {
      amount: FIXED_LOCAL_PRICE,
      currency: detectedCurrency.currency,
      symbol: detectedCurrency.symbol,
      formatted: formatPrice(FIXED_LOCAL_PRICE, detectedCurrency.currency, detectedCurrency.symbol),
      isLoading: false
    };
  };

  return {
    detectedCurrency,
    localizedPrice: getLocalizedPrice(),
    isLoading: ratesLoading || !exchangeRates
  };
}