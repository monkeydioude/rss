import { JSONStorage } from "./json_storage";
import { Entity } from "./storage";

export class Mapp<KT, VT> extends Map<KT, VT> {
    map<T>(cb: (param: [KT, VT]) => T): T[] {
        return Array.from(this).map(cb)
    }
}

export class MapStorage<KeyType, ValueType> implements Entity<Mapp<KeyType, ValueType>> {
    readonly storage: JSONStorage<[KeyType, ValueType][]>;
    constructor(key: string) {
        this.storage = new JSONStorage(key);
    }
    async update(entity: Mapp<KeyType, ValueType>): Promise<void> {
        return await this.storage.update(Array.from(entity.entries()))
    }
    async retrieve(): Promise<Mapp<KeyType, ValueType> | null> {
        return new Mapp<KeyType, ValueType>(await this.storage.retrieve());
    }
    async map<T>(cb: (param: [KeyType, ValueType]) => T): Promise<T[]> {
        return Array.from(await this.retrieve() || new Map<KeyType, ValueType>()).map(cb)
    }
    async push(key: KeyType, value: ValueType) {
        const mapp = await this.retrieve();
        if (!mapp)
            return;
        mapp.set(key, value);
        await this.update(mapp);
    }
}