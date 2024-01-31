import {LCError} from "./domain/LCError";
import {LCErrorType} from "./domain/LCErrorType";

import {collectLettersAndPath} from './Map';

test('A basic example', () => {
    const map: string[] = [
        "@---A---+",
        "        |",
        "x-B-+   C",
        "    |   |",
        "    +---+"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'ACB',
        path: '@---A---+|C|+---+|+-B-x'
    });
})

test('Go straight through intersections', () => {
    const map = [
        "  @",
        "  | +-C--+",
        "  A |    |",
        "  +---B--+",
        "    |      x",
        "    |      |",
        "    +---D--+"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'ABCD',
        path: '@|A+---B--+|+--C-+|-||+---D--+|x'
    });

})

test('Letters may be found on turns', () => {
    const map = [
        "  @---A---+",
        "          |",
        "  x-B-+   |",
        "      |   |",
        "      +---C"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'ACB',
        path: '@---A---+|||C---+|+-B-x'
    });
})

test('Do not collect a letter from the same location twice', () => {
    const map = [
        "     +-O-N-+",
        "     |     |",
        "     |   +-I-+",
        " @-G-O-+ | | |",
        "     | | +-+ E",
        "     +-+     S",
        "             |",
        "             x"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'GOONIES',
        path: '@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x'
    });
})

test('Keep direction, even in a compact space', () => {
    const map = [
        " +-L-+",
        " |  +A-+",
        "@B+ ++ H",
        " ++    x"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'BLAH',
        path: '@B+++B|+-L-+A+++A-+Hx'
    });
})

test('Ignore stuff after end of path', () => {
    const map = [
        "  @-A--+",
        "       |",
        "       +-B--x-C--D"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'AB',
        path: '@-A--+|+-B--x'
    });

});

test('Error - Contains invalid characters', () => {
    const map = ["-Aw--+",]
    expect(() => collectLettersAndPath(map)).toThrow(LCErrorType.INVALID_CHARACTER);
})

test('Error - Missing start character', () => {
    const map = [
        '    -A---+',
        '          |',
        '  x-B-+   C',
        '      |   |',
        '      +---+'
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MISSING_START_CHARACTER));

})

test('Error - Missing end character', () => {
    const map = [
        "   @--A---+",
        "          |",
        "    B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MISSING_END_CHARACTER));

})

test('Error - Multiple starts', () => {
    const map = [
        "   @--A-@-+",
        "          |",
        "  x-B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => collectLettersAndPath(map)).toThrow(new LCError(LCErrorType.MULTIPLE_STARTS));
})

test('Error - Multiple paths', () => {
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

test('Error - Broken path', () => {
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