import '@/assets/globals.css';

import { Inter, Press_Start_2P } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p'
});

export const runtime = 'edge';

export const metadata: Metadata = {
  title: '8-bit Alien Escape - Multiplayer 2D Space Station Maze Game',
  description:
    'Join the adventure in 8-bit Alien Escape, a thrilling multiplayer 2D game. Navigate through a space station maze, avoid face huggers and xenomorphs, and survive the challenges. Play as humans, androids, or aliens in this immersive web app built with Next.js and Convex backend.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.className} ${pressStart2P.variable} flex flex-col bg-black text-white`}
      >
        <ConvexClientProvider>
          <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
          >
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <main className='flex flex-grow'>{children}</main>
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
