/**
 * Converts a snake_case string to camelCase.
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all keys of an object from snake_case to camelCase.
 * Handles plain objects and arrays (converts keys of objects inside arrays).
 */
export function keysSnakeToCamel<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => keysSnakeToCamel(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelKey = snakeToCamel(key);
        (acc as Record<string, unknown>)[camelKey] = keysSnakeToCamel(
          (obj as Record<string, unknown>)[key],
        );
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }

  return obj;
}
