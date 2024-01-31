import {Item} from "../domain/Item";
import {ItemType} from "../domain/ItemType";
import {LCError} from "../domain/LCError";
import {Position} from "../domain/Position";
import {Direction} from "../domain/Direction";
import {LCErrorType} from "../domain/LCErrorType";

import {mapItem} from "./mappers/Item";
import {findAvailableDirections} from "./Direction";

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

export const findNextItemOnMap = (itemsMap: Item[][], currentItem: Item, lastItem?: Item):Item => {
    //If lastItem is null then we expect that current item is START
    if (!lastItem) {
        if (currentItem.type !== ItemType.START) {
            throw new LCError(LCErrorType.ERROR)
        }
        return findNextItemByDirection(itemsMap, currentItem.position, [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT])
    }

    const {directions, additionalDirections} = findAvailableDirections(currentItem, lastItem)
    return findNextItemByDirection(itemsMap, currentItem.position, directions, additionalDirections)
}

const findNextItemByDirection = (itemsMap: Item[][], position: Position, directions: Direction[], additionalDirections?: Direction[]): Item => {
    const availableMoves: Item[] = [];
    const {x, y} = position

    if (directions.some(d => d === Direction.UP) && isValidMove(itemsMap, x, y - 1)) {
        availableMoves.push(itemsMap[y - 1][x])
    }

    if (directions.some(d => d === Direction.DOWN) && isValidMove(itemsMap, x, y + 1)) {
        availableMoves.push(itemsMap[y + 1][x])
    }

    if (directions.some(d => d === Direction.LEFT) && isValidMove(itemsMap, x - 1, y)) {
        availableMoves.push(itemsMap[y][x - 1])
    }

    if (directions.some(d => d === Direction.RIGHT) && isValidMove(itemsMap, x + 1, y)) {
        availableMoves.push(itemsMap[y][x + 1])
    }

    if (!availableMoves.length) {
        if (additionalDirections?.length) {
            availableMoves.push(findNextItemByDirection(itemsMap, position, additionalDirections))
        } else {
            throw new LCError(LCErrorType.BROKEN_PATH)
        }
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

export const getCollectedLetters = (items: Item[]): string => {
    return items.reduce((collectedLetters, item, index) => {
        if (item.type === ItemType.CHARACTER && items.indexOf(item) === index) {
            collectedLetters += item.value;
        }
        return collectedLetters
    }, '')
}
