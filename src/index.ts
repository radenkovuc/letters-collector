import {collectLettersAndPath} from './map';

// Example usage:
const map: string[] = [
    "@---A---+",
    "        |",
    "x-B-+   C",
    "    |   |",
    "    +---+"
]

const result = collectLettersAndPath(map);
console.log('Collected Letters:', result.collectedLetters);
console.log('Path:', result.path);
