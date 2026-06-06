import type { Metadata } from "next";
import { Outfit, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import SiteTracker from '../components/SiteTracker';

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
  title: "Lumière | The K-Beauty Glow Up",
  description: "Your ultimate destination for authentic K-Beauty and premium cosmetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className={`${outfit.variable} ${marcellus.variable} font-sans antialiased flex flex-col min-h-screen bg-cream text-primary`}>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />
        <SiteTracker />
        {children}
      </body>
    </html>
  );
}