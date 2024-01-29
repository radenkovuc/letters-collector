interface CollectLettersAndPathResult {
    collectedLetters: string,
    path: string
}

export function collectLettersAndPath(_map: string[]): CollectLettersAndPathResult {
    return {collectedLetters: '', path: ''};
}
