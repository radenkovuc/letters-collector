import {Item} from "../../domain/Item";
import {ItemType} from "../../domain/ItemType";
import {LCError} from "../../domain/LCError";
import {Position} from "../../domain/Position";
import {Direction} from "../../domain/Direction";
import {LCErrorType} from "../../domain/LCErrorType";

import {mapItem} from "./Item";

interface InitMapResult {
    itemsMap: Item[][],
    startItem: Item
}


export const initMap = (map: string[]): InitMapResult => {
    let startItem: Item | undefined = undefined, endItemExist = false

    const itemsMap = map.map(((line, lineIndex) => line.split("").map((character, characterIndex) => {
            const item = mapItem(character, characterIndex, lineIndex)
            if (item.type === ItemType.START) {
                if (startItem) {
                    throw new LCError(LCErrorType.MULTIPLE_STARTS)
                } else {
                    startItem = item
                }
            }
            endItemExist = endItemExist || (item.type === ItemType.END)

            return item
        }
    )))

    if (!startItem) {
        throw new LCError(LCErrorType.MISSING_START_CHARACTER)
    }

    if (!endItemExist) {
        throw new LCError(LCErrorType.MISSING_END_CHARACTER)
    }

    return {itemsMap, startItem}
}

export const findNextItem = (itemsMap: Item[][], currentItem: Item, lastItem: Item | null) => {
    //If lastItem is null then we expect that current item is START
    if (!lastItem) {
        if (currentItem.type !== ItemType.START) {
            throw new LCError(LCErrorType.ERROR)
        }
        return findNextItemByDirection(itemsMap, currentItem.position, [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT])
    }
    //Invalid direction is returning to last item
    const invalidDirection = getDirection( currentItem.position,lastItem.position)

    switch (currentItem.type) {
        //if current position is CHARACTER we should check all moves except previous one
        case ItemType.CHARACTER: {
            const availableDirections = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].filter(d => d !== invalidDirection)
            return findNextItemByDirection(itemsMap, currentItem.position, availableDirections)
        }
        case ItemType.TURN: {
            const direction = getDirection(lastItem.position, currentItem.position)
            //For TURN item invalid directions are go back ind continue strait
            const availableDirections = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
                .filter(d => d !== invalidDirection && d !== direction)
            return findNextItemByDirection(itemsMap, currentItem.position, availableDirections)
        }
        case ItemType.LEFT_RIGHT: {
            const availableDirections = [Direction.LEFT, Direction.RIGHT].filter(d => d !== invalidDirection)
            return findNextItemByDirection(itemsMap, currentItem.position, availableDirections)
        }
        case ItemType.UP_DOWN: {
            const availableDirections = [Direction.UP, Direction.DOWN].filter(d => d !== invalidDirection)
            return findNextItemByDirection(itemsMap, currentItem.position, availableDirections)
        }
        //If item is START, END or SPACE, something is wrong
        default:
            throw new LCError(LCErrorType.ERROR)
    }
}

const findNextItemByDirection = (itemsMap: Item[][], {x, y}: Position, directions: Direction[]): Item => {
    const availableMoves: Item[] = [];

    if (directions.some(d => d === Direction.UP) && isValidMove(itemsMap, x, y - 1)) {
        console.log('Direction.UP')
        availableMoves.push(itemsMap[y - 1][x])
    }

    if (directions.some(d => d === Direction.DOWN) && isValidMove(itemsMap, x, y + 1)) {
        console.log('Direction.DOWN')
        availableMoves.push(itemsMap[y + 1][x])
    }

    if (directions.some(d => d === Direction.LEFT) && isValidMove(itemsMap, x - 1, y)) {
        console.log('Direction.LEFT')
        availableMoves.push(itemsMap[y][x - 1])
    }

    if (directions.some(d => d === Direction.RIGHT) && isValidMove(itemsMap, x + 1, y)) {
        console.log('Direction.RIGHT')
        availableMoves.push(itemsMap[y][x + 1])
    }

    if (!availableMoves.length) {
        throw new LCError(LCErrorType.BROKEN_PATH)
    }

    if (availableMoves.length !== 1) {
        throw new LCError(LCErrorType.MULTIPLE_PATHS)

    }

    return availableMoves[0]
}

const isValidMove = (itemsMap: Item[][], x: number, y: number): boolean => {
    //Check is this position valid
    if (x < 0 || y < 0 || y > itemsMap.length - 1 || x > itemsMap[y].length - 1) {
        return false;
    }

    // Start and Space are not valid positions
    return itemsMap[y][x].type !== ItemType.START && itemsMap[y][x].type !== ItemType.SPACE
}

const getDirection = (firstPosition: Position, secondPosition: Position): Direction => {
    const xDiff = firstPosition.x - secondPosition.x
    const yDiff = firstPosition.y - secondPosition.y

    // console.log("currentItem.position lastItem.position", currentItem.position, lastItem.position)
    // console.log("xDiff yDiff", xDiff, yDiff)
    if (xDiff !== 0 && yDiff === 0) {
        if (xDiff === 1) return Direction.LEFT
        if (xDiff === -1) return Direction.RIGHT
    }
    if (yDiff !== 0 && xDiff === 0) {
        if (yDiff === 1) return Direction.UP
        if (yDiff === -1) return Direction.DOWN
    }

    throw new LCError(LCErrorType.ERROR)
}
