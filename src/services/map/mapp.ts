export class Mapp<KT, VT> extends Map<KT, VT> {
    map<T>(cb: (param: [KT, VT]) => T): T[] {
        return Array.from(this).map(cb)
    }
    keys_slice(): KT[] {
        return Array.from(this.keys());
    }
    any(trial: ({ key, value }: { key: KT, value: VT }) => boolean): boolean {
        for (const key of this.keys()) {
            const v = this.get(key);
            if (!v) {
                continue;
            }
            if (trial({key, value: v})) {
                return true;
            }
        }
        return false;
    }
    filter(trial: ({ key, value }: { key: KT, value: VT }) => boolean): Mapp<KT, VT> {
        const res = new Mapp<KT, VT>();
        for (const [k, v] of this) {
            if (trial({ key: k, value: v })) {
                res.set(k, v);
            }
        }
        return res;
    }
    find(trial: ({ key, value }: { key: KT, value: VT }) => boolean): VT | undefined {
        return Array.from(this.filter(trial).values()).pop();
    }
}