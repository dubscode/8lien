'use client';

import { Doc } from '@/convex/_generated/dataModel';

type MonsterDossierProps = {
  monster: Doc<'monsters'>;
  showResearch: boolean;
};

export const MonsterDossier = ({
  monster,
  showResearch
}: MonsterDossierProps) => {
  if (!showResearch) return null;

  return (
    <div className='bg-secondary/10 w-full rounded-lg p-4'>
      <h3 className='mb-2 text-xl font-semibold'>Research Dossier</h3>
      <div className='space-y-2 text-sm'>
        <p>
          <strong>Abilities:</strong> {monster.abilities.join(', ')}
        </p>
        <p>
          <strong>Appearance:</strong> {monster.appearance}
        </p>
        <p>
          <strong>Average Lifespan:</strong> {monster.averageLifespan} years
        </p>
        <p>
          <strong>Biography:</strong> {monster.biography}
        </p>
        <p>
          <strong>Eating Habits:</strong> {monster.eatingHabits.join(', ')}
        </p>
        <p>
          <strong>Estimated Population:</strong> {monster.estimatedPopulation}
        </p>
        <p>
          <strong>Favorite Foods:</strong> {monster.favoriteFoods.join(', ')}
        </p>
        <p>
          <strong>Habitat:</strong> {monster.habitat || 'Unknown'}
        </p>
        <p>
          <strong>Home Origin:</strong> {monster.homeOrigin}
        </p>
        <p>
          <strong>Offspring Survival Rate:</strong>{' '}
          {(monster.offspringSurvivalRate * 100).toFixed(2)}%
        </p>
        <p>
          <strong>Rarity:</strong> {monster.rarity}
        </p>
        <p>
          <strong>Reproduction Behavior:</strong> {monster.reproductionBehavior}
        </p>
        <p>
          <strong>Reproductive Season:</strong>{' '}
          {monster.reproductiveSeason || 'Unknown'}
        </p>
        <p>
          <strong>Safety Level:</strong> {monster.safetyLevel}
        </p>
        <p>
          <strong>Size:</strong> {monster.size}
        </p>
        <p>
          <strong>Threat Level:</strong> {monster.threatLevel}/10
        </p>
        <p>
          <strong>Typical Behavior:</strong> {monster.typicalBehavior}
        </p>
        <p>
          <strong>Variations:</strong> {monster.variations.join(', ')}
        </p>
        <p>
          <strong>Weaknesses:</strong> {monster.weaknesses.join(', ')}
        </p>
        {monster.notes && (
          <p>
            <strong>Additional Notes:</strong> {monster.notes}
          </p>
        )}
      </div>
    </div>
  );
};
