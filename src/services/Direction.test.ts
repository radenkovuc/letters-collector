import {findAvailableDirections} from "./Direction";
import {Item} from "../domain/Item";
import {ItemType} from "../domain/ItemType";
import {LCError} from "../domain/LCError";
import {LCErrorType} from "../domain/LCErrorType";
import {Direction} from "../domain/Direction";

test('findAvailableDirections - Error - currentItem type is START, END or SPACE', () => {
    const currentItem: Item = {
        type: ItemType.SPACE,
        value: " ",
        position: {x: 1, y: 1}
    }
    const lastItem: Item = {
        type: ItemType.CHARACTER,
        value: "A",
        position: {x: 1, y: 2}
    }
    expect(() => findAvailableDirections(currentItem, lastItem)).toThrow(new LCError(LCErrorType.ERROR));
})

test('findAvailableDirections - Error - currentItem and lastItem are not neighbors', () => {
    const currentItem: Item = {
        type: ItemType.CHARACTER,
        value: "B",
        position: {x: 1, y: 1}
    }
    const lastItem: Item = {
        type: ItemType.CHARACTER,
        value: "A",
        position: {x: 1, y: 3}
    }
    expect(() => findAvailableDirections(currentItem, lastItem)).toThrow(new LCError(LCErrorType.ERROR));
})

test('findAvailableDirections - currentItem type is CHARACTER', () => {
    //Current direction is DOWN, expect function to return DOWN as directions and [LEFT,RIGHT] as additional directions
    const currentItem: Item = {
        type: ItemType.CHARACTER,
        value: "B",
        position: {x: 1, y: 1}
    }
    let lastItem: Item = {
        type: ItemType.UP_DOWN,
        value: "A",
        position: {x: 1, y: 0}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.DOWN],
        additionalDirections: [Direction.LEFT, Direction.RIGHT]
    })

    //Current direction is RIGHT, expect function to return RIGHT as directions and [UP,DOWN] as additional directions
    lastItem = {
        type: ItemType.UP_DOWN,
        value: "A",
        position: {x: 0, y: 1}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.RIGHT],
        additionalDirections: [Direction.UP, Direction.DOWN]
    })
})

test('findAvailableDirections - currentItem type is TURN', () => {
    //Current direction is DOWN, expect function to return LEFT and RIGHT as directions
    const currentItem: Item = {
        type: ItemType.TURN,
        value: "B",
        position: {x: 1, y: 1}
    }
    const lastItem: Item = {
        type: ItemType.UP_DOWN,
        value: "A",
        position: {x: 1, y: 0}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.LEFT, Direction.RIGHT],
        additionalDirections: []
    })
})

test('findAvailableDirections - currentItem type is UP_DOWN', () => {
    //Current direction is UP, expect function to return same direction
    const currentItem: Item = {
        type: ItemType.UP_DOWN,
        value: "B",
        position: {x: 1, y: 1}
    }
    let lastItem: Item = {
        type: ItemType.UP_DOWN,
        value: "A",
        position: {x: 1, y: 2}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.UP],
        additionalDirections: []
    })

    //Current direction is LEFT and last item type is LEFT_RIGHT, expect function to return same direction
    lastItem = {
        type: ItemType.LEFT_RIGHT,
        value: "A",
        position: {x: 2, y: 1}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.LEFT],
        additionalDirections: []
    })
})

test('findAvailableDirections - currentItem type is LEFT_RIGHT', () => {
    //Current direction is LEFT, expect function to return same direction
    const currentItem: Item = {
        type: ItemType.LEFT_RIGHT,
        value: "B",
        position: {x: 1, y: 1}
    }
    let lastItem: Item = {
        type: ItemType.LEFT_RIGHT,
        value: "A",
        position: {x: 2, y: 1}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.LEFT],
        additionalDirections: []
    })

    //Current direction is UP and last item type is UP_DOWN, expect function to return same direction
    lastItem = {
        type: ItemType.UP_DOWN,
        value: "A",
        position: {x: 1, y: 2}
    }
    expect(findAvailableDirections(currentItem, lastItem)).toStrictEqual({
        directions: [Direction.UP],
        additionalDirections: []
    })
})