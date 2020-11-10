/**
 * retursn the most Appearanced element in the list
 * @param arr the input array
 * the givven order, lower index has more higher order.
 * e.g. ['a', 'b', 'c'] -> (index) a: 0, b: 1, c: 2 -> (importance) a > b > c
 */
export function mostFrequent(arr: Array<string>, orders?: string[]): string | undefined {
    if (arr.length == 0)
        return null;
    var modeMap: Map<string, string> = new Map<string, string>();
    const providedOrdeersLength = orders ? orders.length : 0

    function orderOfElement(el: string): number {
        return orders ? orders.includes(el) ? orders.indexOf(el) : providedOrdeersLength + 1 : 1
    }

    let maxEl: string = arr[0]
    let maxCount: number = 1;
    for (var i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] >= maxCount) {

            // region check order
            const elOrder = orderOfElement(el)
            const lastMaxElOrder = orderOfElement(maxEl)
            // change max el only if has higher order (in this case lower inde).
            if (lastMaxElOrder > elOrder) {
                maxEl = el;
            }
            // endregion check order

            maxCount = modeMap[el];
        }
    }
    return maxEl;


    // return arr
    //     .sort(
    //         (a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    //     )
    //     .pop();
}