export function makeSafelyAsList<T>(maybeList: Array<T> | T): Array<T> {
    if (Array.isArray(maybeList)) {
        return maybeList;
    } else {
        return [maybeList]
    }
}