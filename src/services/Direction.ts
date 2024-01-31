import {Item} from "../domain/Item";
import {ItemType} from "../domain/ItemType";
import {LCError} from "../domain/LCError";
import {Position} from "../domain/Position";
import {Direction} from "../domain/Direction";
import {LCErrorType} from "../domain/LCErrorType";

interface FindAvailableDirectionsResult {
    directions: Direction[],
    additionalDirections: Direction[]
}

export const findAvailableDirections = (currentItem: Item, lastItem: Item): FindAvailableDirectionsResult => {
    //Invalid direction is returning to last item
    const directionToLastItem = getDirection(currentItem.position, lastItem.position)
    const currentDirection = getDirection(lastItem.position, currentItem.position)

    let directions: Direction[] = [], additionalDirections: Direction[] = []

    switch (currentItem.type) {
        case ItemType.CHARACTER:
            if (currentDirection === Direction.RIGHT || currentDirection === Direction.LEFT) {
                directions = [Direction.LEFT, Direction.RIGHT].filter(d => d !== directionToLastItem)
                additionalDirections = [Direction.UP, Direction.DOWN]
            } else {
                directions = [Direction.UP, Direction.DOWN,].filter(d => d !== directionToLastItem)
                additionalDirections = [Direction.LEFT, Direction.RIGHT]
            }
            break;
        case ItemType.TURN:
            //For TURN item invalid directions are go back and continue strait
            directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
                .filter(d => d !== directionToLastItem && d !== currentDirection)
            break;
        case ItemType.UP_DOWN: {
            if (lastItem.type === ItemType.LEFT_RIGHT && (currentDirection === Direction.LEFT || currentDirection === Direction.RIGHT)) {
                directions = [Direction.LEFT, Direction.RIGHT].filter(d => d !== directionToLastItem)
            } else {
                directions = [Direction.UP, Direction.DOWN].filter(d => d !== directionToLastItem)
            }
            break;
        }
        case ItemType.LEFT_RIGHT: {
            if (lastItem.type === ItemType.UP_DOWN && (currentDirection === Direction.UP || currentDirection === Direction.DOWN)) {
                directions = [Direction.UP, Direction.DOWN].filter(d => d !== directionToLastItem)
            } else {
                directions = [Direction.LEFT, Direction.RIGHT].filter(d => d !== directionToLastItem)
            }
        }
            break;
        //If item is START, END or SPACE, something is wrong
        default:
            throw new LCError(LCErrorType.ERROR)
    }
    return {directions, additionalDirections}
}

const getDirection = (firstPosition: Position, secondPosition: Position): Direction => {
    const xDiff = firstPosition.x - secondPosition.x
    const yDiff = firstPosition.y - secondPosition.y

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
