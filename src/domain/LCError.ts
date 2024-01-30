import {LCErrorType} from "./LCErrorType";

export class LCError extends Error {
    constructor(type: LCErrorType) {
        super(type);
    }
}