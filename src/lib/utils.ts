import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): HSLColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return null;
  }

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToCssString(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}

export function getContrastHsl(hsl: HSLColor): HSLColor {
  // Using a simple lightness threshold for contrast
  // More sophisticated methods (like WCAG contrast ratio) exist but are more complex
  return hsl.l > 50 ? { h: 0, s: 0, l: 10 } : { h: 0, s: 0, l: 98 }; // Dark text for light bg, light text for dark bg
}

const THEME_CSS_VARIABLES = [
  '--primary',
  '--primary-foreground',
  '--accent',
  '--accent-foreground',
  '--ring',
  '--background',
];

export function applyCustomThemeColors(hexColor: string): void {
  const primaryHsl = hexToHsl(hexColor);
  if (!primaryHsl) {
    console.error("Invalid HEX color for custom theme:", hexColor);
    return;
  }

  // Primary
  const primaryCss = hslToCssString(primaryHsl.h, primaryHsl.s, primaryHsl.l);
  document.documentElement.style.setProperty('--primary', primaryCss);
  document.documentElement.style.setProperty('--ring', primaryCss);

  // Primary Foreground
  const primaryFgHsl = getContrastHsl(primaryHsl);
  const primaryFgCss = hslToCssString(primaryFgHsl.h, primaryFgHsl.s, primaryFgHsl.l);
  document.documentElement.style.setProperty('--primary-foreground', primaryFgCss);

  // Accent (Shift hue from primary, adjust saturation/lightness for visibility)
  const accentHsl = {
    h: (primaryHsl.h + 45) % 360,
    s: Math.min(100, Math.max(40, primaryHsl.s)), // Ensure decent saturation
    l: Math.min(90, Math.max(30, primaryHsl.l)),   // Ensure decent lightness
  };
  const accentCss = hslToCssString(accentHsl.h, accentHsl.s, accentHsl.l);
  document.documentElement.style.setProperty('--accent', accentCss);

  // Accent Foreground
  const accentFgHsl = getContrastHsl(accentHsl);
  const accentFgCss = hslToCssString(accentFgHsl.h, accentFgHsl.s, accentFgHsl.l);
  document.documentElement.style.setProperty('--accent-foreground', accentFgCss);
  
  // Background (Pale version of primary)
  const backgroundHsl = {
    h: primaryHsl.h,
    s: Math.max(5, primaryHsl.s - 50), // Greatly desaturate
    l: Math.min(96, primaryHsl.l + (primaryHsl.l < 50 ? 50 : 30)), // Make very light
  };
  const backgroundCss = hslToCssString(backgroundHsl.h, backgroundHsl.s, backgroundHsl.l);
  document.documentElement.style.setProperty('--background', backgroundCss);
}

export function clearCustomThemeColors(): void {
  THEME_CSS_VARIABLES.forEach(variable => {
    document.documentElement.style.removeProperty(variable);
  });
}
