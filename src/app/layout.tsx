
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeInitializer } from '@/components/theme/theme-initializer';
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: 'Grow a Garden Value Calculator',
  description: 'Calculate the value of items from Grow a Garden with various multipliers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeInitializer />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
