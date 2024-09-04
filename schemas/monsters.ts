import { z } from 'zod';

export const GenerateMonsterSchema = z.object({
  generationId: z
    .string()
    .describe(
      'This is required. This will be passed to you during the API generation request.'
    ),
  name: z
    .string()
    .describe(
      'The name of the monster. Provide a unique and descriptive name.'
    ),
  biography: z
    .string()
    .describe(
      'A brief biography of this particular monster. Try to make it around 5 sentences, and provide some fun and unique details to fill in their backstory.'
    ),
  size: z
    .string()
    .describe(
      "A description of the monster's size. Could include height, weight, or general scale (e.g., 'Large as a mountain' or 'Small like a cat')."
    ),
  abilities: z
    .array(z.string())
    .describe(
      "A list of the monster's abilities or special skills, such as 'Invisibility', 'Flight', or 'Breathes fire'."
    ),
  appearance: z
    .string()
    .describe(
      "A brief description of the monster's appearance, including skin texture, number of limbs, and distinctive features."
    ),
  eatingHabits: z
    .array(z.string())
    .describe(
      "A list of eating habits or preferences, such as 'Carnivorous' or 'Omnivorous'."
    ),
  favoriteFoods: z.array(z.string()).describe('A list of 5-7 favorite foods.'),
  habitat: z
    .string()
    .optional()
    .describe(
      "The specific habitat or environment the monster resides in, such as 'Volcanic caves' or 'Deep forest'. Optional field."
    ),
  averageLifespan: z.number().describe('The average lifespan of the monster.'),
  estimatedPopulation: z
    .number()
    .describe('The estimated population of the monster.'),
  threatLevel: z
    .number()
    .min(1)
    .max(10)
    .describe(
      "A numeric ranking from 1 to 10 that describes the monster's level of danger, with 1 being very safe and 10 being extremely dangerous."
    ),
  reproductionBehavior: z
    .string()
    .describe(
      "Describe the monster's reproduction or breeding behavior. Include unique traits such as whether the male or female carries the offspring, the number of offspring produced, the gestation period, or any special reproductive methods (e.g., egg-laying, live birth, external fertilization). For example, 'The male carries and hatches the eggs' or 'The monster reproduces by budding.'"
    ),
  offspringSurvivalRate: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "A ratio (0-1) indicating the likelihood that the monster's offspring will survive into adulthood."
    ),
  reproductiveSeason: z
    .string()
    .optional()
    .describe(
      "The season or time period when the monster reproduces, such as 'Every spring' or 'Once every 100 years'. Optional field."
    ),
  notes: z
    .string()
    .optional()
    .describe(
      'Additional comments or notes about the monster. Could include fun facts, trivia, or other relevant details.'
    ),
  homeOrigin: z
    .string()
    .describe(
      'The home planet, dimension, or realm where the monster originates from. Should be a single location.'
    ),
  safetyLevel: z
    .union([z.literal('SAFE'), z.literal('DANGEROUS')])
    .describe(
      "Indicates if the monster is 'SAFE' or 'DANGEROUS'. This is based on research studies and user votes."
    ),
  rarity: z
    .enum(['Common', 'Rare', 'Legendary'])
    .describe(
      "The rarity of the monster, from 'Common' to 'Legendary'. This indicates how often the monster is seen or encountered."
    ),
  similarMonsters: z
    .array(z.string())
    .describe(
      'An array of monster IDs that represent similar monsters. These are references to other monsters. This value is _id from existing monsters table.'
    ),
  typicalBehavior: z
    .string()
    .describe(
      "A description of the monster's typical behavior, such as 'Aggressive', 'Shy', or 'Playful'."
    ),
  variations: z
    .array(z.string())
    .describe(
      "Different versions or subspecies of the monster, such as 'Fire-breathing variant'."
    ),
  weaknesses: z
    .array(z.string())
    .describe(
      "A list of known weaknesses for the monster, such as 'Weak to sunlight' or 'Vulnerable to fire'. Optional field."
    )
});
