
'use client';

import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    const themePreference = localStorage.getItem('themePreference');
    if (themePreference === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // Default to light if no preference or preference is 'light'
      document.documentElement.classList.remove('dark');
    }

    // Note: Applying a custom primary color from localStorage to live CSS HSL variables
    // is more complex and not handled here. This initializer only handles light/dark mode.
    // The ThemeCustomizationModal handles saving the custom color preference.
  }, []);

  return null; // This component does not render anything visible
}
