import { api } from './_generated/api';
import { cronJobs } from 'convex/server';

const crons = cronJobs();

// crons.interval(
//   'generate a new monster',
//   { hours: 1 }, // every 1 hour
//   api.genMonster.generateMonsterObject,
//   {}
// );

export default crons;
