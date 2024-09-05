import { AllPosts } from './AllPosts';
import { ModeToggle } from '@/components/mode-toggle';
import { SignInOrComposer } from './SignInOrComposer';

export default function Home() {
  return (
    <main>
      <ModeToggle />
      <SignInOrComposer />
      <AllPosts />
    </main>
  );
}
