import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from 'src/services/request/logchest';
import sleep from '../services/sleep';

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

// Locker acts as a really poor man's blocking mutex
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

// Storage is used to store any kind of local data
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
      let res: string | null = "";
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

export interface Entity<T> {
  update(entity: T): Promise<void>;
  retrieve(): Promise<T | null>;
}

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // @todo: warning/error msg in app
    log("Storage.clearAllData() " + e);
    console.error("Storage.clearAllData()", e);
  }
}