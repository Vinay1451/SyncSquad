import { useHealthData } from '@/context/HealthDataContext';
import { useTheme } from '@/context/ThemeContext';
import { defaultHealthData } from '@/lib/healthData';

export function useSafeTheme() {
  const defaultTheme = { theme: 'light', toggleTheme: () => {} };
  try {
    return useTheme();
  } catch (e) {
    console.warn('Theme context not available, using default theme');
    return defaultTheme;
  }
}

export function useSafeHealthData() {
  const defaultHealthDataContext = { 
    healthData: defaultHealthData, 
    refreshData: async () => {}, 
    isLoading: false 
  };
  try {
    return useHealthData();
  } catch (e) {
    console.warn('Health data context not available, using default health data');
    return defaultHealthDataContext;
  }
}