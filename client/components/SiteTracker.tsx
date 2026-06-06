"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

export default function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackView = async () => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stats/site`);
      } catch (error) {
        console.error('Failed to track site view', error);
      }
    };
    trackView();
  }, [pathname]);

  return null;
}
