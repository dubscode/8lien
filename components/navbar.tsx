import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { SignInOrOut } from '@/components/auth/sign-in-or-out';

export function Navbar() {
  return (
    <nav className='border-b bg-background'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex-shrink-0'>
            <Link href='/' className='text-xl font-bold text-primary'>
              Monster Research Incorporated
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <ModeToggle />
            <SignInOrOut />
          </div>
        </div>
      </div>
    </nav>
  );
}
