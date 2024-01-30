import {LCError} from "./domain/LCError";

import {collectLettersAndPath} from './Map';

// Example usage:
const map: string[] = [
    "@---A---+",
    "        |",
    "x-B-+   C",
    "    |   |",
    "    +---+"
]

try {
    const result = collectLettersAndPath(map);
    console.log('Collected Letters:', result.collectedLetters);
    console.log('Path:', result.path);
} catch (e) {
    if (e instanceof LCError) {
        console.log(e.message)
    }
}
