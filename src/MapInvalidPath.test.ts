import {LCError} from "./domain/LCError";
import {LCErrorType} from "./domain/LCErrorType";

import {collectLettersAndPath} from './Map';

test('Contains invalid characters', () => {
    const map = ["-Aw--+",]
    expect(() => collectLettersAndPath(map)).toThrow(LCErrorType.INVALID_CHARACTER);
})

test('Missing start character', () => {
    const map = [
        '    -A---+',
        '          |',
        '  x-B-+   C',
        '      |   |',
        '      +---+'
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MISSING_START_CHARACTER));

})

test('Missing end character', () => {
    const map = [
        "   @--A---+",
        "          |",
        "    B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MISSING_END_CHARACTER));

})

test('Multiple starts', () => {
    const map = [
        "   @--A-@-+",
        "          |",
        "  x-B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MULTIPLE_STARTS));
})

test('Multiple paths', () => {
    //Fork in path
    let map = [
        "       x-B",
        "          |",
        "   @--A---+",
        "          |",
        "     x+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MULTIPLE_PATHS));

    //Multiple starting paths
    map = ["x-B-@-A-x"]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MULTIPLE_PATHS));
})

test('Broken path', () => {
    //Broken path
    let map = [
        " @--A-+",
        "        |",
        "         ",
        "        B-x"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.BROKEN_PATH));

    //Fake turn
    map = ["@-A-+-B-x"]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.BROKEN_PATH));
})