'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { useQuery } from 'convex/react';
import MonsterCard from '@/components/monsters/monster-card';
import MonsterLeaderboard from '@/components/monsters/monster-leaderboard';
import { api } from '@/convex/_generated/api';
import { type CarouselApi } from '@/components/ui/carousel';
import _ from 'lodash';

export default function MonsterGallery() {
  const monsters = useQuery(api.monsters.top50monsters);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const requestedMonsterId = searchParams.get('slide') || '';
  const [currentSlide, setCurrentSlide] = useState(0);

  const findMonsterIndex = useCallback(
    (id: string) => {
      return monsters?.findIndex((monster) => monster._id === id) ?? -1;
    },
    [monsters]
  );

  useEffect(() => {
    const initializeCarousel = async () => {
      if (carouselApi && monsters) {
        let index = findMonsterIndex(requestedMonsterId);
        if (index === -1) {
          index = 1;
          carouselApi.scrollTo(index, true);
          setCurrentSlide(index);
        }
        if (index !== -1) {
          carouselApi.scrollTo(index, true);
          setCurrentSlide(index);
        } else {
          carouselApi.scrollTo(0, true);
          setCurrentSlide(0);
        }
      }
    };

    initializeCarousel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselApi, monsters, requestedMonsterId, findMonsterIndex]);

  useEffect(() => {
    if (carouselApi) {
      const onSelect = () => {
        const selectedIndex = carouselApi.selectedScrollSnap();
        setCurrentSlide(selectedIndex);
        const selectedMonsterId = monsters?.[selectedIndex]?._id;
        if (selectedMonsterId) {
          router.push(`?slide=${selectedMonsterId}`, { scroll: false });
        }
      };

      carouselApi.on('select', onSelect);
      return () => {
        carouselApi.off('select', onSelect);
      };
    }
  }, [carouselApi, router, monsters]);

  const handlePaginationClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  const renderPaginationItems = () => {
    if (!monsters) return null;

    const items = [];
    const totalPages = monsters.length;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePaginationClick(i)}
              isActive={currentSlide === i}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const startPage = Math.max(
        0,
        Math.min(currentSlide - 2, totalPages - maxVisiblePages)
      );
      const endPage = Math.min(startPage + maxVisiblePages, totalPages);

      if (startPage > 0) {
        items.push(
          <PaginationItem key='start'>
            <PaginationLink onClick={() => handlePaginationClick(0)}>
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 1) {
          items.push(<PaginationEllipsis key='ellipsis-start' />);
        }
      }

      for (let i = startPage; i < endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePaginationClick(i)}
              isActive={currentSlide === i}
            >
              {i + 1}
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
            <PaginationLink
              onClick={() => handlePaginationClick(totalPages - 1)}
            >
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
                      <CarouselItem key={monster._id}>
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
                          handlePaginationClick(Math.max(0, currentSlide - 1))
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePaginationClick(
                            Math.min(monsters.length - 1, currentSlide + 1)
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
