export function encode<T = string>(payload: T): string {
  return JSON.stringify(payload);
}
export function decode<T>(payload: string): T {
  return JSON.parse(payload) as T;
}
