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


    while (currentItem.type != ItemType.END) {
        const nextItem = findNextItem(itemsMap, currentItem, lastItem)
        lastItem = currentItem
        currentItem = nextItem
        items.push(currentItem)
        console.log("path", items.map(i => i.value).join(""))
    }
    let collectedLetters = ''
    let path = ""

    items.forEach((item, index) => {
        if (item.type === ItemType.CHARACTER && items.indexOf(item) === index) {
            collectedLetters += item.value;
        }
        path += item.value;
    })

    return {
        collectedLetters,
        path
    };

}


