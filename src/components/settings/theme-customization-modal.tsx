
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ThemeCustomizationModal({ isOpen, onOpenChange }: ThemeCustomizationModalProps) {
  const [selectedThemeOption, setSelectedThemeOption] = useState<'light' | 'dark' | 'custom'>('light');
  const [customColor, setCustomColor] = useState<string>("#ADDF6F"); // Default primary

  useEffect(() => {
    // Initialize theme based on current document class or localStorage
    if (typeof window !== 'undefined') {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setSelectedThemeOption(currentTheme);
        // You could also load a saved 'custom' preference and its color here
    }
  }, []);

  const handleThemeOptionChange = (newThemeValue: string) => {
    const newTheme = newThemeValue as 'light' | 'dark' | 'custom';
    setSelectedThemeOption(newTheme);

    if (typeof window !== 'undefined') {
        if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            // localStorage.setItem('theme', 'light'); // Persist choice
        } else if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            // localStorage.setItem('theme', 'dark'); // Persist choice
        }
        // If 'custom' is selected, we don't change light/dark class here.
        // The custom color application would handle that or be based on current light/dark.
    }
  };

  const handleApplyCustomColor = () => {
    if (selectedThemeOption === 'custom' && typeof window !== 'undefined') {
      console.log("Applying custom primary color (HEX):", customColor);
      // Actual application would involve updating CSS variables.
      // This is a simplified example:
      // document.documentElement.style.setProperty('--primary-hue', extractHue(customColor));
      // document.documentElement.style.setProperty('--primary-saturation', extractSaturation(customColor));
      // document.documentElement.style.setProperty('--primary-lightness', extractLightness(customColor));
      // Or directly set: document.documentElement.style.setProperty('--primary', customColor);
      // Needs more robust logic to update HSL variables in globals.css for full theme effect.
      alert("Custom color application is experimental. Full theme update via CSS variables requires more setup.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] md:sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose your preferred theme or set a custom primary color.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <RadioGroup
            value={selectedThemeOption}
            onValueChange={handleThemeOptionChange}
            className="space-y-2"
          >
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">Light Mode</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6 pt-1">A clean and bright interface.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">Dark Mode</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6 pt-1">A darker, subdued interface.</p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="theme-custom" />
                <Label htmlFor="theme-custom">Custom Primary Color</Label>
              </div>
               <p className="text-xs text-muted-foreground pl-6 pt-1">Choose your own primary color (experimental).</p>
            </div>
          </RadioGroup>

          {selectedThemeOption === 'custom' && (
            <div className="space-y-3 pl-6 pt-2 border-l ml-3">
              <Label htmlFor="custom-color-input" className="font-medium">Primary Color (HEX)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-color-input"
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#ADDF6F"
                  className="w-full"
                />
                <Button onClick={handleApplyCustomColor} variant="outline" size="sm">Apply</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a HEX color code (e.g., #ADDF6F).
                Note: Full theme integration requires updating HSL variables in CSS.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
