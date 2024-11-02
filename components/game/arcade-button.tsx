import * as React from 'react';

import { Button } from '@/components/ui/button';

interface ArcadeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function ArcadeButton({ text, className, ...props }: ArcadeButtonProps) {
  return (
    <Button
      className={`relative h-24 w-24 overflow-hidden rounded-full bg-red-600 text-lg font-bold text-white shadow-[inset_0_-8px_0_0_rgba(0,0,0,0.3)] transition-all duration-200 ease-in-out hover:bg-red-700 hover:shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.3)] active:shadow-[inset_0_4px_0_0_rgba(0,0,0,0.3)] ${className} `}
      {...props}
    >
      <span className='relative z-10'>{text}</span>
      <span className='absolute inset-0 overflow-hidden rounded-full'>
        <span className='absolute -inset-[100%] bg-gradient-to-br from-red-400 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100' />
      </span>
    </Button>
  );
}
