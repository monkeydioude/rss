import AsyncStorage from '@react-native-async-storage/async-storage';
import sleep from './sleep';
import { sendError } from './logchest';

let locked = false;

export const lock = (): void => {
  locked = true;
}

export const unlock = (): void => {
  locked = false;
}

export const isLocked = (): boolean => {
  return locked;
}

export class Locker {
  readonly checkThreshold = 100;
  readonly checkRetry = 3;

  async onUnlock(cb: () => Promise<void>) {
    if (!isLocked()) {
      return cb();
    }

    for (let tries = 1; tries <= this.checkRetry; tries++) {
      if (!isLocked()) {
        lock();
        await cb();
        unlock();
        return;
      }
      await sleep(this.checkThreshold);
      continue;
    }

    throw "lock was not released";
  }
}

export interface DBStorage {
  insert(data: string): Promise<void>;
  select(): Promise<string>;
  delete(): Promise<void>;
}

export class Storage implements DBStorage {
  readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  getKeyStorageKey(): string {
    return this.key;
  }

  async insert(data: string): Promise<void> {
    try {
      await new Locker().onUnlock(async () => AsyncStorage.setItem(this.key, data))
    } catch (e) {
      throw e;
    }
  }

  async select(): Promise<string> {
    try {
      let res: string = "";
      await new Locker().onUnlock(async () => {
        res = await AsyncStorage.getItem(this.key)
      })
      return res;
    } catch (e) {
      throw e;
    }
  }

  async delete(): Promise<void> {
    try {
      await new Locker().onUnlock(async () => AsyncStorage.removeItem(this.key))
    } catch (e) {
      throw e;
    }
  }
}

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // @todo: warning/error msg in app
    sendError("" + e);
    console.error(e);
  }
}

export const getAllData = async (): Promise<Map<string, string>> => {
  const data: Map<string, string> = new Map();
  try {
    for (const key of await AsyncStorage.getAllKeys()) {
      data.set(key, await AsyncStorage.getItem(key));
    };
  } catch (e) {
    sendError("" + e);
    console.error(e);
  }
  return data;
}

export interface Entity<T> {
  update(entity: T): Promise<void>;
  retrieve(): Promise<T>;
}

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
      sendError("" + e);
      console.error(e);
    }
  }

  async retrieve(): Promise<T> {
    try {
      const res = await this.storage.select();
      return JSON.parse(res);
    } catch (e) {
      // @todo: warning/error msg in app
      sendError("" + e);
      console.error(e);
    }
  }
}