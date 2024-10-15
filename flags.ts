import { unstable_flag as flag } from '@vercel/flags/next';

export const paginateMonstersFlag = flag({
  key: 'paginate-monsters',
  defaultValue: false,
  description: 'Use paginated monster query to get more results',
  decide: async () => false
});

export const precomputeFlags = [paginateMonstersFlag] as const;
