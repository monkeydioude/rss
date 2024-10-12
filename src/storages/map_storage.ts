import { Mapp } from "src/services/map/mapp";
import { JSONStorage } from "./json_storage";
import { Entity } from "./storage";

export class MapStorage<KT, VT> implements Entity<Mapp<KT, VT>> {
    readonly storage: JSONStorage<[KT, VT][]>;
    constructor(key: string) {
        this.storage = new JSONStorage(key);
    }
    async update(entity: Mapp<KT, VT>): Promise<void> {
        return await this.storage.update(Array.from(entity.entries()))
    }
    async retrieve(): Promise<Mapp<KT, VT> | null> {
        return new Mapp<KT, VT>(await this.storage.retrieve());
    }
    async retrieveOrNew(): Promise<Mapp<KT, VT>> {
        return new Mapp<KT, VT>((await this.storage.retrieve()) || []);
    }
    async map<T>(cb: (param: [KT, VT]) => T): Promise<T[]> {
        return Array.from(await this.retrieve() || new Map<KT, VT>()).map(cb)
    }
    async push(key: KT, value: VT) {
        const mapp = await this.retrieve();
        if (!mapp)
            return;
        mapp.set(key, value);
        await this.update(mapp);
    }
    async removeOne(key: KT): Promise<boolean> {
        const mapp = await this.retrieve();
        if (!mapp)
            return false;
        return mapp.delete(key);
    }
}