import { Banner } from '@/components/banner';
import MonsterGallery from '@/components/monsters/monster-gallery';
import MonsterGalleryPaginated from '@/components/monsters/monster-gallery-paginated';
import { Navbar } from '@/components/navbar';
import { paginateMonstersFlag } from '@/flags';

export default async function Home() {
  const paginatedMonsters = await paginateMonstersFlag();

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Banner />
        {paginatedMonsters ? <MonsterGalleryPaginated /> : <MonsterGallery />}
      </main>
    </div>
  );
}
