
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
import { applyCustomThemeColors, clearCustomThemeColors } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ThemeCustomizationModal({ isOpen, onOpenChange }: ThemeCustomizationModalProps) {
  const [selectedThemeOption, setSelectedThemeOption] = useState<'light' | 'dark' | 'custom'>('light');
  const [customColor, setCustomColor] = useState<string>("#ADDF6F"); // Default initial custom color
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
        const currentTheme = localStorage.getItem('themePreference') as 'light' | 'dark' | 'custom' || 'light';
        setSelectedThemeOption(currentTheme);
        const storedCustomColor = localStorage.getItem('customPrimaryColor');
        if (storedCustomColor) {
            setCustomColor(storedCustomColor);
        }
    }
  }, [isOpen]);

  const handleThemeOptionChange = (newThemeValue: string) => {
    const newTheme = newThemeValue as 'light' | 'dark' | 'custom';
    setSelectedThemeOption(newTheme);

    if (typeof window !== 'undefined') {
        if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            clearCustomThemeColors();
            localStorage.setItem('themePreference', 'light');
            localStorage.removeItem('customPrimaryColor'); // Clear custom color if switching to standard theme
        } else if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            clearCustomThemeColors();
            localStorage.setItem('themePreference', 'dark');
            localStorage.removeItem('customPrimaryColor'); // Clear custom color if switching to standard theme
        } else if (newTheme === 'custom') {
            // Apply current customColor immediately if switching to custom
            // or wait for user to press "Apply Color"
            localStorage.setItem('themePreference', 'custom');
            // Optionally apply directly: applyCustomThemeColors(customColor);
            // For now, let's require explicit "Apply Color" click for custom.
            // If a custom color was previously set, ThemeInitializer would have applied it.
            // If switching to 'custom' and a customColor is already in state (e.g. from previous save),
            // we might want to re-apply it.
            const storedCustom = localStorage.getItem('customPrimaryColor');
            if(storedCustom) {
                 applyCustomThemeColors(storedCustom);
            } else {
                 applyCustomThemeColors(customColor); // Apply default custom if none stored
            }
        }
    }
  };

  const handleApplyCustomColor = () => {
    if (selectedThemeOption === 'custom' && typeof window !== 'undefined') {
      try {
        applyCustomThemeColors(customColor);
        localStorage.setItem('customPrimaryColor', customColor);
        localStorage.setItem('themePreference', 'custom'); // Ensure preference is set to custom
         toast({
          title: "Custom Theme Applied",
          description: "Your custom primary color has been applied.",
        });
      } catch (error) {
         console.error("Error applying custom theme:", error);
         toast({
          title: "Error",
          description: "Could not apply custom theme color.",
          variant: "destructive",
        });
      }
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    // Optionally apply live if 'custom' is selected, or wait for "Apply" button
    // if (selectedThemeOption === 'custom') {
    //   applyCustomThemeColors(e.target.value);
    //   localStorage.setItem('customPrimaryColor', e.target.value);
    // }
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
                <Label htmlFor="theme-custom">Custom Colors</Label>
              </div>
               <p className="text-xs text-muted-foreground pl-6 pt-1">Set your own primary, accent, and background colors.</p>
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
              <Button onClick={handleApplyCustomColor} variant="outline" size="sm" className="mt-2">Apply Custom Colors</Button>
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
