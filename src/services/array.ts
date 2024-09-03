const merge = (left: number[], right: number[]): number[] => {
    let res: number[] = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] > right[0]) {
            res.push(right[0]);
            right = right.splice(1);
        } else {
            res.push(left[0]);
            left = left.splice(1);
        }
    }
    for (let n of left) {
        res.push(n);
    }
    for (let n of right) {
        res.push(n);
    }

    return res;
}

export const mergeSort = (list: number[]): number[] => {
    const len = list.length;
    if (len <= 1) {
        return list;
    }
    let left: number[] = [];
    let right: number[] = [];
    list.forEach((n, i) => {
        if (i < len / 2) {
            left.push(n);
        } else {
            right.push(n);
        }
    });
    left = mergeSort(left);
    right = mergeSort(right);
    return merge(left, right);
}

export const deepEquality = (a: number[], b: number[]): boolean => {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
        return false;
    }
    
    return a.every((v, idx) => v === b[idx]);
}

export const unorderedDeepEquality = (a: number[], b: number[]): boolean => {
    return deepEquality(mergeSort(a), mergeSort(b));
}