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
