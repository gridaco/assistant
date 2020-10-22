// normalizing value to rounded. I.E 4.999999523162842. to 5
export function roundNumber(num: number): number {
  if (num === 0) { return 0 }
  if (num) {
    return +num.toFixed(2)
  }
}
