import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { AlertCircle } from 'lucide-react';

export function Banner() {
  return (
    <Alert
      variant='default'
      className='bg-primary text-center text-primary-foreground'
    >
      <AlertTitle>New Monsters Incoming!</AlertTitle>
      <AlertDescription className='animate-pulse'>
        A new monster is generated every hour. Stay tuned for fresh creatures!
      </AlertDescription>
    </Alert>
  );
}
