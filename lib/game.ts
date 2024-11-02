import { CellType, Difficulty, Sprites } from '@/lib/types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 40;

export const sprites: Sprites = {
  airlock:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/airlock.webp',
  android: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/droid.png',
  chestburster:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/chestburster.png',
  facehugger:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/facehugger.png',
  man: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/marine2.webp',
  mostly: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/mostly.png',
  spacesuit:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/astronaut.png',
  woman: 'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/woman.png',
  xenomorph:
    'https://ourqmsy63pjkoxcb.public.blob.vercel-storage.com/xenomorph.png'
};

export function generateMaze(
  size: number,
  difficulty: Difficulty
): CellType[][] {
  const difficultySettings = {
    easy: { deadEndChance: 0.1, pathWidenChance: 0.3 },
    medium: { deadEndChance: 0.3, pathWidenChance: 0.1 },
    hard: { deadEndChance: 0.5, pathWidenChance: 0.0 }
  };

  const { deadEndChance, pathWidenChance } = difficultySettings[difficulty];

  function isInBounds(x: number, y: number): boolean {
    return x > 0 && x < size - 1 && y > 0 && y < size - 1;
  }

  function carvePath(maze: CellType[][], x: number, y: number) {
    maze[y][x] = 'empty';

    const directions = [
      [0, -2], // Up
      [0, 2], // Down
      [-2, 0], // Left
      [2, 0] // Right
    ].sort(() => Math.random() - 0.5); // Shuffle directions

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isInBounds(nx, ny) && maze[ny][nx] === 'wall') {
        maze[y + dy / 2][x + dx / 2] = 'empty'; // Clear the wall in between
        maze[ny][nx] = 'empty';
        carvePath(maze, nx, ny);
      }
    }
  }

  function generateAndValidateMaze(): CellType[][] {
    // Initialize the maze with all walls
    const maze: CellType[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill('wall'));

    // Start carving from the top-left corner
    carvePath(maze, 1, 1);

    // Add dead ends for complexity
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        if (maze[y][x] === 'empty' && Math.random() < deadEndChance) {
          const directions = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0]
          ];
          for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isInBounds(nx, ny) && maze[ny][nx] === 'wall') {
              maze[ny][nx] = 'empty';
              break;
            }
          }
        }
      }
    }

    // Widen paths for easier difficulties
    if (difficulty === 'easy') {
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          if (maze[y][x] === 'empty' && Math.random() < pathWidenChance) {
            const directions = [
              [0, -1],
              [0, 1],
              [-1, 0],
              [1, 0]
            ];
            for (const [dx, dy] of directions) {
              const nx = x + dx;
              const ny = y + dy;
              if (isInBounds(nx, ny) && maze[ny][nx] === 'wall') {
                maze[ny][nx] = 'empty';
              }
            }
          }
        }
      }
    }

    // Ensure the airlock is placed at the bottom-right corner
    maze[size - 2][size - 2] = 'airlock';

    return maze;
  }

  function isSolvable(
    maze: CellType[][],
    startX: number,
    startY: number,
    goalX: number,
    goalY: number
  ): boolean {
    const queue: [number, number][] = [[startX, startY]];
    const visited: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false));

    visited[startY][startX] = true;

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      if (x === goalX && y === goalY) {
        return true; // Path to the goal found
      }

      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
      ];
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (isInBounds(nx, ny) && !visited[ny][nx] && maze[ny][nx] !== 'wall') {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
        }
      }
    }

    return false; // No path found
  }

  // Generate and validate until we get a solvable maze
  let maze = generateAndValidateMaze();
  while (!isSolvable(maze, 1, 1, size - 2, size - 2)) {
    maze = generateAndValidateMaze();
  }

  return maze;
}
