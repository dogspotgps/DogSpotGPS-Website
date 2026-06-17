
import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DogSpotGPS | Find Lost Dogs Faster',
  description: 'Community-powered lost dog recovery with live photo sightings, GPS timestamps, protected previews, owner confirmation, rewards, and recovery command center.',
  metadataBase: new URL('https://dogspotgps.com'),
  openGraph: { title:'DogSpotGPS', description:'See dog. Snap picture. Owner confirms. Location unlocks. Reward pays.', url:'https://dogspotgps.com', siteName:'DogSpotGPS', images:['/images/dogspotgps-hero.png'], type:'website'},
  twitter: { card:'summary_large_image', title:'DogSpotGPS', description:'Picture-first lost dog recovery.', images:['/images/dogspotgps-hero.png']},
  icons: { icon:'/images/dogspotgps-icon.png', apple:'/images/dogspotgps-icon.png' }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
