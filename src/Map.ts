import {ItemType} from "./domain/ItemType";
import {Item} from "./domain/Item";

import {findNextItemOnMap, getCollectedLetters, initMap} from "./services/Map";

interface CollectLettersAndPathResult {
    collectedLetters: string,
    path: string
}

export const collectLettersAndPath = (map: string[]): CollectLettersAndPathResult => {
    const {itemsMap, startItem} = initMap(map)
    let lastItem = undefined
    let currentItem = startItem
    const collectedItems: Item[] = [currentItem]

    while (currentItem.type != ItemType.END) {
        const nextItem = findNextItemOnMap(itemsMap, currentItem, lastItem)
        collectedItems.push(nextItem)
        lastItem = currentItem
        currentItem = nextItem
    }

    return {
        collectedLetters: getCollectedLetters(collectedItems),
        path: collectedItems.map(i => i.value).join('')
    };
}




