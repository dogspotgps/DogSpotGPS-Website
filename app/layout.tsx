
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DogSpotGPS | Find Lost Dogs Faster',
  description: `Community-powered lost dog recovery. Spot a loose dog, snap a live photo, get paid when the owner confirms.`,
  openGraph: {
    title: 'DogSpotGPS',
    description: `Snap a loose dog. Get paid. Picture-first GPS recovery.`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
