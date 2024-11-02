export type CharacterType =
  | 'airlock'
  | 'android'
  | 'chestburster'
  | 'facehugger'
  | 'man'
  | 'mostly'
  | 'spacesuit'
  | 'woman'
  | 'xenomorph';

export type Sprites = Record<CharacterType, string>;

export type CellType = 'empty' | 'wall' | 'player' | 'npc' | 'airlock';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Position {
  x: number;
  y: number;
}

export interface NPC {
  id: number;
  position: Position;
  previousMove?: string;
  type: 'facehugger' | 'xenomorph';
}
