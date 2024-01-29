import {collectLettersAndPath} from './map';
import {LCError} from "./domain/LCError";

xtest('Valid maps', () => {
    //A basic example
    let map: string[] = [
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

    //Go straight through intersections
    map = [
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

    //Letters may be found on turns
    map = [
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

    //Do not collect a letter from the same location twice
    map = [
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

    //Keep direction, even in a compact space
    map = [
        " +-L-+",
        " |  +A-+",
        "@B+ ++ H",
        " ++    x"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'BLAH',
        path: '@B+++B|+-L-+A+++A-+Hx'
    });

    //Ignore stuff after end of path
    map = [
        "  @-A--+",
        "       |",
        "       +-B--x-C--D"
    ]
    expect(collectLettersAndPath(map)).toStrictEqual({
        collectedLetters: 'AB',
        path: '@-A--+|+-B--x'
    });

});

xtest('Invalid maps', () => {
    //Contains invalid characters
    let map = [
        "-A---+",
        "-z--  "
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.INVALID_CHARACTER));

    //Missing start character
    map = [
        '    -A---+',
        '          |',
        '  x-B-+   C',
        '      |   |',
        '      +---+'
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.MISSING_START_CHARACTER));

    //Missing end character
    map = [
        "   @--A---+",
        "          |",
        "    B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.MISSING_END_CHARACTER));

    //Multiple starts
    map = [
        "   @--A-@-+",
        "          |",
        "  x-B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.MULTIPLE_STARTS));

    //Fork in path
    map = [
        "       x-B",
        "          |",
        "   @--A---+",
        "          |",
        "     x+   C",
        "      |   |",
        "      +---+"
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.FORK_IN_PATH));

    //Broken path
    map = [
        " @--A-+",
        "        |",
        "         ",
        "        B-x"
    ]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.BROKEN_PATH));

    //Multiple starting paths
    map = ["x-B-@-A-x"]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.MULTIPLE_STARTING_PATHS));

    //Fake turn
    map = ["@-A-+-B-x"]
    expect(collectLettersAndPath(map)).toThrow(new Error(LCError.FAKE_TURN));
})