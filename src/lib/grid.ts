import { GridKey, GridPoint, HasKey } from "./types";


export class Grid<T extends HasKey> {
  private readonly data: Record<GridKey, T> = {};

  set(value: T): void {
    this.data[value.key] = value;
  }
  get(key: GridKey): T | undefined {
    return this.data[key];
  }

  static parseKey(key: GridKey): GridPoint {
    const [x, y] = key.split(',');
    return {
      x: parseFloat(x),
      y: parseFloat(y),
    }
  }
  static makeKey(point: GridPoint): GridKey {
    return point.x + ',' + point.y;
  }
}
