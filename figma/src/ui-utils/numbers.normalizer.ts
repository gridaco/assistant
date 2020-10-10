// normalizing value to rounded. I.E 4.999999523162842. to 5
export function roundNumber(num: number): string {
  return num.toFixed(2)
}
