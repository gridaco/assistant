export function encode<T = string>(payload: T): string {
  return JSON.stringify(payload);
}

export function decode<T>(payload: string): T {
  try {
    if (payload !== null && payload !== undefined) {
      return JSON.parse(payload) as T;
    }
    return null;
  } catch (_) {
    return null;
  }
}
