import { HasTicks } from "./types";

export class HistoryTracker<T extends HasTicks> {
  // store as serialized strings
  private readonly lookup: Map<number, string> = new Map();
  constructor(seedRecords?: T[]) {
    seedRecords?.forEach(r => this.set(r));
  }

  get(tick: number): T | undefined {
    const recordJson = this.lookup.get(tick);
    if (recordJson) {
      return JSON.parse(recordJson) as T;
    }
  }
  set(record: T) {
    const recordJson = JSON.stringify(record);
    this.lookup.set(record.tick, recordJson);
  }
}
