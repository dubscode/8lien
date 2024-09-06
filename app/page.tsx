import MonsterGallery from '@/components/monsters/monster-gallery';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <MonsterGallery />
      </main>
    </div>
  );
}
