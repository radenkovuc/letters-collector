import {Item} from "../domain/Item";
import {ItemType} from "../domain/ItemType";
import {LCError} from "../domain/LCError";
import {LCErrorType} from "../domain/LCErrorType";
import {findNextItemOnMap, getCollectedLetters, initMap} from "./Map";


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

test('findNextItemOnMap - Error - multiple or broken paths', () => {
    // Broken path
    const lastItem: Item = {
        value: "-",
        type: ItemType.LEFT_RIGHT,
        position: {x: 0, y: 0}
    }
    let currentItem: Item = {
        type: ItemType.CHARACTER,
        value: "x",
        position: {x: 1, y: 0}
    }
    let itemsMap: Item[][] = [[
        lastItem,
        currentItem, {
            value: " ",
            type: ItemType.SPACE,
            position: {x: 2, y: 0}
        }]];
    expect(() => findNextItemOnMap(itemsMap, currentItem, lastItem)).toThrow(new LCError(LCErrorType.BROKEN_PATH));

    // current item is START and there are 2 available paths
    currentItem = {
        type: ItemType.START,
        value: "@",
        position: {x: 0, y: 0}
    }
    itemsMap = [[
        currentItem,
        {
            value: "-",
            type: ItemType.LEFT_RIGHT,
            position: {x: 1, y: 0}
        }],
        [{
            value: "|",
            type: ItemType.UP_DOWN,
            position: {x: 0, y: 1}
        }]];
    expect(() => findNextItemOnMap(itemsMap, currentItem)).toThrow(new LCError(LCErrorType.MULTIPLE_PATHS));
})

test('findNextItemOnMap - currentItem type is START', () => {
    const currentItem: Item = {
        type: ItemType.START,
        value: "x",
        position: {x: 0, y: 0}
    }
    const nextItem: Item = {
        value: "-",
        type: ItemType.LEFT_RIGHT,
        position: {x: 1, y: 0}
    }
    const itemsMap: Item[][] = [[
        currentItem,
        nextItem, {
            value: "x",
            type: ItemType.END,
            position: {x: 2, y: 0}
        }]];
    expect(findNextItemOnMap(itemsMap, currentItem)).toStrictEqual(nextItem);
})

test('getCollectedLetters - return correct letters', () => {


    //Simple case, expect to show all letters
    const letterB = {
        value: "B",
        type: ItemType.CHARACTER,
        position: {x: 1, y: 0}
    }
    const items: Item[] = [
        letterB,
        {
            value: "-",
            type: ItemType.LEFT_RIGHT,
            position: {x: 1, y: 4}
        }, {
            value: "A",
            type: ItemType.CHARACTER,
            position: {x: 2, y: 2}
        }];
    expect(getCollectedLetters(items)).toStrictEqual("BA");

    // Letter B is visited twice, expect to show it only once
    items.push(letterB)
    expect(getCollectedLetters(items)).toStrictEqual("BA");
})