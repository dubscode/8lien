import { api } from './_generated/api';
import { cronJobs } from 'convex/server';

const crons = cronJobs();

crons.interval(
  'generate a new monster',
  { minutes: 5 }, // every 5 minutes
  api.genMonster.generateMonsterObject,
  {}
);

export default crons;
