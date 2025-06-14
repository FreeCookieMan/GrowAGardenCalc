
'use client';

import { useEffect } from 'react';
import { applyCustomThemeColors } from '@/lib/utils';

export function ThemeInitializer() {
  useEffect(() => {
    const themePreference = localStorage.getItem('themePreference');
    
    if (themePreference === 'custom') {
      const customPrimaryColor = localStorage.getItem('customPrimaryColor');
      if (customPrimaryColor) {
        applyCustomThemeColors(customPrimaryColor);
      }
      // Determine if base dark mode should be applied under custom theme.
      // For simplicity, let's assume custom themes are built on a light base
      // unless explicitly designed otherwise. Or, we could have another
      // localStorage item for 'customThemeBase': 'light' | 'dark'.
      // For now, custom theme overrides --background directly.
      // We still need to set the dark class if the custom theme is meant to be "dark overall".
      // Let's default custom themes to a light base for body text etc., then apply colors.
      // The `applyCustomThemeColors` will set the actual --background variable.
      // The `dark` class influences other non-themed parts of shadcn.
      // We can refine this logic: if custom, also check for a "customBaseIsDark" flag.
      // For now, custom themes remove the .dark class to avoid conflicts unless --background is very dark.
      // The `applyCustomThemeColors` handles the background, so the .dark class's background isn't needed.
      // We still need to manage the .dark class for other component stylings that might rely on it.
      // A simple approach: if custom theme is applied, also check if the user preferred dark mode *before* custom.
      // This is getting complex. Let's assume custom themes define their own overall light/dark feel via --background.
      // The .dark class on html is mostly for ShadCN's own component variants.
      // If custom color is set, we should probably remove .dark class to ensure custom --background takes precedence without conflict.
      // However, some components might still rely on .dark for their internal styling.
      // Let's make custom themes clear the .dark class by default, and specific --foreground etc variables will handle text color.
      document.documentElement.classList.remove('dark');


    } else if (themePreference === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // Default to light if no preference or preference is 'light'
      document.documentElement.classList.remove('dark');
    }

  }, []);

  return null; // This component does not render anything visible
}
