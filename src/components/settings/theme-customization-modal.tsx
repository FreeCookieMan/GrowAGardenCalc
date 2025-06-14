
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
    if (typeof window !== 'undefined') {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setSelectedThemeOption(currentTheme);
        const storedCustomColor = localStorage.getItem('customPrimaryColor');
        if (storedCustomColor) {
            setCustomColor(storedCustomColor);
        }
    }
  }, []);

  const handleThemeOptionChange = (newThemeValue: string) => {
    const newTheme = newThemeValue as 'light' | 'dark' | 'custom';
    setSelectedThemeOption(newTheme);

    if (typeof window !== 'undefined') {
        if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('themePreference', 'light');
        } else if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('themePreference', 'dark');
        }
    }
  };

  const handleApplyCustomColor = () => {
    if (selectedThemeOption === 'custom' && typeof window !== 'undefined') {
      // This part is still experimental as full theme update is complex.
      // For now, we'll just save the color preference.
      localStorage.setItem('customPrimaryColor', customColor);
      // To truly apply, you'd update CSS variables like:
      // document.documentElement.style.setProperty('--primary', customColor);
      // And convert HEX to HSL for other variables.
      alert("Custom color preference saved. Full theme application is experimental and requires CSS variable updates.");
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
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
              <Label htmlFor="custom-color-text-input" className="font-medium">Primary Color (HEX)</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="custom-color-text-input"
                  type="text"
                  value={customColor}
                  onChange={handleColorInputChange}
                  placeholder="#ADDF6F"
                  className="flex-grow"
                />
                <Input
                  id="custom-color-wheel-input"
                  type="color"
                  value={customColor}
                  onChange={handleColorInputChange}
                  className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
                  aria-label="Color picker"
                />
              </div>
              <Button onClick={handleApplyCustomColor} variant="outline" size="sm" className="mt-2">Apply Color</Button>
              <p className="text-xs text-muted-foreground pt-1">
                Note: Full theme integration requires updating HSL variables in CSS. This saves your preference.
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
