/**
 * retrieves the nearest value of givven @param goal in @param array
 * @param goal 
 * @param array 
 */
export function nearestValue(goal: number, array: Array<number>): number {
  return array.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });
}
