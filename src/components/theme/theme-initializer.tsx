
'use client';

import { useEffect } from 'react';
import { applyCustomThemeColors, clearCustomThemeColors } from '@/lib/utils';

export function ThemeInitializer() {
  useEffect(() => {
    // Apply base theme (light/dark)
    const baseThemePreference = localStorage.getItem('baseThemePreference');
    if (baseThemePreference === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // Default to light if no preference or preference is 'light'
      document.documentElement.classList.remove('dark');
    }

    // Apply custom primary color if enabled and set
    const useCustomPrimary = localStorage.getItem('useCustomPrimaryColor');
    const customPrimaryColor = localStorage.getItem('customPrimaryColor');

    if (useCustomPrimary === 'true' && customPrimaryColor) {
      applyCustomThemeColors(customPrimaryColor);
    } else {
      // Ensure any lingering custom primary colors are cleared if not in use
      // This can happen if useCustomPrimaryColor was set to false or customPrimaryColor was removed
      // but clearCustomThemeColors wasn't called at that exact moment.
      clearCustomThemeColors();
    }

  }, []);

  return null; // This component does not render anything visible
}
