// Normalizer defines a general method for applying data normalization
export interface Normalizer<T> {
    (pubDate: T): T;
}

// normalize uses a stack of Normalizer<T>[] upon a data
export const normalize = <T,>(normalizers: Normalizer<T>[], value: T): T => {
    normalizers.forEach((normalizer: Normalizer<T>) => {
        value = normalizer(value);
    });
    return value;
}