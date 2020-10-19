/**
 * retursn true / false by checking if givven value is null or undefined
 * @param value 
 */
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}