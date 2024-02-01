import {LCError} from "../../domain/LCError";
import {LCErrorType} from "../../domain/LCErrorType";
import {mapItem} from "./Item";
import {ItemType} from "../../domain/ItemType";

test('mapItem - Error - Invalid character', () => {
    expect(() => mapItem("c", 1, 1)).toThrow(new LCError(LCErrorType.INVALID_CHARACTER));
})

test('mapItem - Map character', () => {
    expect(mapItem("C", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.CHARACTER,
        value: "C"
    });
})

test('mapItem - Map other types', () => {
    expect(mapItem("@", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.START,
        value: "@"
    });

    expect(mapItem("x", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.END,
        value: "x"
    });

    expect(mapItem("-", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.LEFT_RIGHT,
        value: "-"
    });

    expect(mapItem("|", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.UP_DOWN,
        value: "|"
    });

    expect(mapItem("+", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.TURN,
        value: "+"
    });

    expect(mapItem(" ", 1, 1)).toStrictEqual({
        position: {x: 1, y: 1},
        type: ItemType.SPACE,
        value: " "
    });
})