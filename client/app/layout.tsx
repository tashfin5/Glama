import type { Metadata } from "next";
import { Outfit, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({ 
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-sans',
});

const marcellus = Marcellus({
  weight: '400',
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Glama | The K-Beauty Glow Up",
  description: "Your ultimate destination for authentic K-Beauty and premium cosmetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${marcellus.variable} font-sans antialiased flex flex-col min-h-screen bg-cream text-gray-900`}>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        {children}
      </body>
    </html>
  );
}