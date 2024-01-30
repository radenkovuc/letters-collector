import {ItemType} from "./domain/ItemType";
import {Item} from "./domain/Item";

import {findNextItem, initMap} from "./services/mappers/Map";

interface CollectLettersAndPathResult {
    collectedLetters: string,
    path: string
}

export const collectLettersAndPath = (map: string[]): CollectLettersAndPathResult => {
    const {itemsMap, startItem} = initMap(map)
    let lastItem = null
    let currentItem = startItem
    const items: Item[] = [currentItem]

    console.log("start item", currentItem)

    while (currentItem.type != ItemType.END) {
        const nextItem = findNextItem(itemsMap, currentItem, lastItem)
        console.log("nextItem", nextItem)
        lastItem = currentItem
        currentItem = nextItem
        items.push(currentItem)
    }
    return {
        collectedLetters: items.filter(i => i.type === ItemType.CHARACTER).map(i => i.value).join(""),
        path: items.map(i => i.value).join("")
    };

}


