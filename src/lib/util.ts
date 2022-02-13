import { HasId } from "./types";

let uniqueCounter = 0;
export function nextId() { return uniqueCounter++; }

export function assertExists<T extends HasId>(elm: T, arr: T[]): number {
  const matches = arr
    .map((v, i) => ({ index: i, value: v, }))
    .filter(item => elm.id === item.value.id);
  if (matches.length !== 1) {
    throw new Error('id not found in collection');
  }
  return matches[0].index;
}
export function assertRemove<T extends HasId>(elm: T, arr: T[]): void {
  const index = assertExists(elm, arr);
  arr.splice(index, 1);
}

export function range(length: number): number[] {
  const out = [] as number[];
  for (let i = 0; i < length; i++) {
    out.push(i);
  }
  return out;
}

export function mapReduce<K extends number | string, V>(arr: V[], keyFunc: ((elm: V) => K)): Record<K, V> {
  return arr.reduce((obj, elm: V) => {
    obj[keyFunc(elm)] = elm;
    return obj;
  }, {} as Record<K, V>);
}

export function filterEmpty<T>(arr: (T | undefined)[]): T[] {
  function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }
  return arr.filter(notEmpty);
}

export function flatten<T>(arr: T[][]): T[] {
  // dumb polyfill for jest
  // https://github.com/kulshekhar/ts-jest/issues/828
  const out = [] as T[];
  arr.forEach(subArr => out.push(...subArr));
  return out;
}

export function unique<T>(arr: T[]): T[] {
  const out = [] as T[];
  arr.forEach(elm => {
    if (!out.includes(elm)) {
      out.push(elm);
    }
  });
  return out;
}

export function shuffle<T>(arr: T[]): T[] {
  // https://stackoverflow.com/a/12646864
  const shuffled = arr.concat();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
