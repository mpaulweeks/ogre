import { GridKey, HasKey } from "./types";

export class Grid<T extends HasKey> {
  private readonly data: Record<GridKey, T> = {};

  set(value: T): void {
    this.data[value.key] = value;
  }
  get(key: GridKey): T | undefined {
    return this.data[key];
  }

}
