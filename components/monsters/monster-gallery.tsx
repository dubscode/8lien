'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { usePaginatedQuery } from 'convex/react';
import MonsterCard from '@/components/monsters/monster-card';
import MonsterLeaderboard from '@/components/monsters/monster-leaderboard';
import { api } from '@/convex/_generated/api';
import { type CarouselApi } from '@/components/ui/carousel';
import _ from 'lodash';

export default function MonsterGallery() {
  const {
    results: monsters,
    status,
    loadMore
  } = usePaginatedQuery(
    api.monsters.paginatedMonsters,
    {},
    { initialNumItems: 20 }
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const initialSlide = Math.max(
    1,
    parseInt(searchParams.get('slide') || '1', 10)
  );
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  useEffect(() => {
    status === 'CanLoadMore' && loadMore(50);

    if (carouselApi && monsters) {
      const validInitialSlide = Math.min(
        Math.max(initialSlide, 1),
        monsters.length
      );
      carouselApi.scrollTo(validInitialSlide - 1, true);
      setCurrentSlide(validInitialSlide);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselApi, monsters, initialSlide, status]);

  useEffect(() => {
    if (carouselApi) {
      const onSelect = () => {
        const selectedIndex = carouselApi.selectedScrollSnap() + 1;
        setCurrentSlide(selectedIndex);
        router.push(`?slide=${selectedIndex}`, { scroll: false });
      };

      carouselApi.on('select', onSelect);
      return () => {
        carouselApi.off('select', onSelect);
      };
    }
  }, [carouselApi, router]);

  const handlePaginationClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index - 1);
    }
  };

  const renderPaginationItems = () => {
    if (!monsters) return null;

    const items = [];
    const totalPages = monsters.length;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePaginationClick(i)}
              isActive={currentSlide === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const startPage = Math.max(
        1,
        Math.min(currentSlide - 2, totalPages - maxVisiblePages + 1)
      );
      const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (startPage > 1) {
        items.push(
          <PaginationItem key='start'>
            <PaginationLink onClick={() => handlePaginationClick(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          items.push(<PaginationEllipsis key='ellipsis-start' />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePaginationClick(i)}
              isActive={currentSlide === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(<PaginationEllipsis key='ellipsis-end' />);
        }
        items.push(
          <PaginationItem key='end'>
            <PaginationLink onClick={() => handlePaginationClick(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className='container mx-auto flex flex-col space-y-8 p-8'>
      <div className='flex flex-col md:flex-row md:space-x-8'>
        <div className='mb-8 w-full md:mb-0 md:w-1/3'>
          <MonsterLeaderboard />
        </div>

        <div className='w-full md:w-2/3'>
          {monsters && monsters.length > 0 && (
            <>
              <Carousel
                setApi={setCarouselApi}
                className='mx-auto w-full max-w-2xl'
              >
                <CarouselContent>
                  {_.orderBy(monsters, '_creationTime').map(
                    (monster, index) => (
                      <CarouselItem key={index}>
                        <MonsterCard monster={monster} />
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious variant='default' />
                <CarouselNext variant='default' />
              </Carousel>
              <div className='mt-4 flex justify-center'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePaginationClick(Math.max(1, currentSlide - 1))
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePaginationClick(
                            Math.min(monsters.length, currentSlide + 1)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
