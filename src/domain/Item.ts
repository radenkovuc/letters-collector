import {ItemType} from "./ItemType";
import {Position} from "./Position";

export type Item = {
    value: string
    type: ItemType
    position: Position
}