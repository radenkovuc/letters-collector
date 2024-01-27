import { collectLettersAndPath } from './map';

// Example usage:
const map: string[][] = [
  ['@', '-', 'G', '-', '+'],
  [' ', ' ', '|', ' ', '|'],
  ['+', '-', 'O', '-', 'x'],
];

const result = collectLettersAndPath(map);
console.log('Collected Letters:', result.collectedLetters);
console.log('Path:', result.path);
