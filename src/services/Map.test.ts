import {Item} from "../domain/Item";
import {ItemType} from "../domain/ItemType";
import {LCError} from "../domain/LCError";
import {LCErrorType} from "../domain/LCErrorType";
import {findNextItemOnMap, initMap} from "./Map";


test('initMap - Error - number of start or end characters are not correct', () => {
    //Missing start character
    let map = [
        '    -A---+',
        '          |',
        '  x-B-+   C',
        '      |   |',
        '      +---+'
    ]
    expect(() => initMap(map)).toThrow(new LCError(LCErrorType.MISSING_START_CHARACTER));

    //Missing end character
    map = [
        "   @--A---+",
        "          |",
        "    B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => initMap(map)).toThrow(new LCError(LCErrorType.MISSING_END_CHARACTER));

    //Multiple starts
    map = [
        "   @--A-@-+",
        "          |",
        "  x-B-+   C",
        "      |   |",
        "      +---+"
    ]
    expect(() => initMap(map)).toThrow(new LCError(LCErrorType.MULTIPLE_STARTS));
})

test('initMap - mapped correctly', () => {
    const map = ['@-x']
    const startItem: Item = {
        value: "@",
        type: ItemType.START,
        position: {x: 0, y: 0}
    }
    const itemsMap: Item[][] = [[startItem, {
        value: "-",
        type: ItemType.LEFT_RIGHT,
        position: {x: 1, y: 0}
    }, {
        value: "x",
        type: ItemType.END,
        position: {x: 2, y: 0}
    }]];

    expect(initMap(map)).toStrictEqual({
        itemsMap,
        startItem
    })
})

test('findNextItemOnMap - Error - currentItem type is not START and lastItem is not sent', () => {
    const itemsMap: Item[][] = []
    const currentItem: Item = {
        type: ItemType.END,
        value: "x",
        position: {x: 1, y: 1}
    }
    expect(() => findNextItemOnMap(itemsMap, currentItem)).toThrow(new LCError(LCErrorType.ERROR));
})
