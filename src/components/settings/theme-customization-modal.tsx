
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
import { Separator } from "@/components/ui/separator";

interface ThemeCustomizationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ThemeCustomizationModal({ isOpen, onOpenChange }: ThemeCustomizationModalProps) {
  const [baseTheme, setBaseTheme] = useState<'light' | 'dark'>('light');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>("#ADDF6F"); // Default initial custom color
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
        const storedBaseTheme = localStorage.getItem('baseThemePreference') as 'light' | 'dark' || 'light';
        setBaseTheme(storedBaseTheme);

        const storedCustomColor = localStorage.getItem('customPrimaryColor');
        if (storedCustomColor) {
            setCustomPrimaryColor(storedCustomColor);
        }
    }
  }, [isOpen]);

  const handleBaseThemeChange = (newThemeValue: string) => {
    const newBaseTheme = newThemeValue as 'light' | 'dark';
    setBaseTheme(newBaseTheme);

    if (typeof window !== 'undefined') {
        if (newBaseTheme === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('baseThemePreference', 'light');
        } else if (newBaseTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('baseThemePreference', 'dark');
        }
        // If a custom primary color is active, it should remain applied on top of the new base theme
        if (localStorage.getItem('useCustomPrimaryColor') === 'true') {
            const storedColor = localStorage.getItem('customPrimaryColor');
            if (storedColor) {
                applyCustomThemeColors(storedColor);
            }
        }
    }
  };

  const handleApplyCustomPrimaryColor = () => {
    if (typeof window !== 'undefined') {
      try {
        applyCustomThemeColors(customPrimaryColor);
        localStorage.setItem('customPrimaryColor', customPrimaryColor);
        localStorage.setItem('useCustomPrimaryColor', 'true');
         toast({
          title: "Custom Primary Color Applied",
          description: "Your custom primary color has been applied over the base theme.",
        });
      } catch (error) {
         console.error("Error applying custom primary color:", error);
         toast({
          title: "Error",
          description: "Could not apply custom primary color.",
          variant: "destructive",
        });
      }
    }
  };

  const handleResetCustomPrimaryColor = () => {
    if (typeof window !== 'undefined') {
        clearCustomThemeColors();
        localStorage.removeItem('customPrimaryColor');
        localStorage.removeItem('useCustomPrimaryColor');
        setCustomPrimaryColor("#ADDF6F"); // Reset to default input
        toast({
            title: "Custom Primary Color Reset",
            description: "Primary color has been reset to the base theme's default.",
        });
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrimaryColor(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] md:sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>
            Choose a base theme and optionally apply a custom primary color.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <Label className="font-medium text-base">Base Theme</Label>
            <RadioGroup
              value={baseTheme}
              onValueChange={handleBaseThemeChange}
              className="space-y-2 mt-2"
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
            </RadioGroup>
          </div>

          <Separator />

          <div>
             <Label className="font-medium text-base">Custom Primary Color</Label>
             <p className="text-xs text-muted-foreground pt-1 mb-3">Optionally override the primary and accent colors of the selected base theme.</p>
            <div className="space-y-3">
              <Label htmlFor="custom-color-text-input" className="font-medium sr-only">Primary Color (HEX)</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="custom-color-text-input"
                  type="text"
                  value={customPrimaryColor}
                  onChange={handleColorInputChange}
                  placeholder="#ADDF6F"
                  className="flex-grow"
                />
                <Input
                  id="custom-color-wheel-input"
                  type="color"
                  value={customPrimaryColor}
                  onChange={handleColorInputChange}
                  className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
                  aria-label="Color picker"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleApplyCustomPrimaryColor} variant="default" size="sm" className="mt-2">Apply Primary</Button>
                <Button onClick={handleResetCustomPrimaryColor} variant="outline" size="sm" className="mt-2">Reset Primary</Button>
              </div>
            </div>
          </div>
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
