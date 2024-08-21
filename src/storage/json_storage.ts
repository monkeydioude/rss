import { log } from "src/services/request/logchest";
import { Entity, Storage } from "./storage";

export class JSONStorage<T> implements Entity<T> {
  readonly storage: Storage;

  constructor(key: string) {
    this.storage = new Storage(key);
  }

  async update(entity: T): Promise<void> {
    try {
      await this.storage.insert(JSON.stringify(entity));
    } catch (e) {
      // @todo: warning/error msg in app
      log("JSONStorage.update() " + e);
      console.error("JSONStorage.update() " + e);
    }
  }

  async retrieve(): Promise<T | null> {
    try {
      const res = await this.storage.select();
      return JSON.parse(res);
    } catch (e) {
      // @todo: warning/error msg in app
      log("JSONStorage.retrieve() " + e);
      console.error("JSONStorage.retrieve() " + e);
    }
    return null;
  }
}