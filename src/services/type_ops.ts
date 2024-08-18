export const isString = (value: any): boolean => typeof value === "string";

export const ifNotThenArrayOf = <T,>(v: any): T[] => {
    const t: T[] = [];
    if (!v) {
        return t;
    }
    if (Array.isArray(v)) {
        return v;
    }

    return [v];
}