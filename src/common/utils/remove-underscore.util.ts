export function removeUnderscore<T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = key.startsWith('_') ? key.slice(1) : key;
    newObj[newKey] = value;
  }

  return newObj;
}

export type RemoveUnderscore<T> = {
  [K in keyof T as K extends `_${infer R}` ? R : K]: T[K];
};
