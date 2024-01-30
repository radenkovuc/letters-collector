import {Item} from "../../domain/Item";
import {ItemType} from "../../domain/ItemType";
import {LCErrorType} from "../../domain/LCErrorType";

export const mapItem = (item: string, x: number, y: number): Item => ({
    position: {x, y},
    type: mapItemType(item),
    value: item
})

const mapItemType = (item: string): ItemType => {
    switch (item) {
        case "@":
            return ItemType.START
        case "x":
            return ItemType.END
        case "-":
            return ItemType.LEFT_RIGHT
        case "|":
            return ItemType.UP_DOWN
        case "+":
            return ItemType.TURN
        case " ":
            return ItemType.SPACE
        default: {
            if (/[A-W]/.test(item)) {
                return ItemType.CHARACTER
            }
            throw new Error(LCErrorType.INVALID_CHARACTER)
        }
    }
}