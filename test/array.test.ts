import { assert } from "chai";
import { describe } from "mocha";
import { deepEquality, mergeSort, unorderedDeepEquality } from "../src/services/array";

describe("array", () => {
    it("should be able to mergeSort an array", () => {
        const tests: [number[], number[]][] = [
            [[1, 3, 4], [1, 3, 4]],
            [[445454545, 42, 269], [42, 269, 445454545]],
            [[6, 3, 5, 2, 4, 8, 1, 7], [1, 2, 3, 4, 5, 6, 7, 8]],
        ];
        tests.forEach(([trial, goal]) => assert.deepEqual(mergeSort(trial), goal))
    })

    it("should be able to tell that an array has a deep equality with an other", () => {
        const tests: [number[], number[], boolean][] = [
            [[1, 3, 4], [1, 3, 4], true],
            [[445454545, 42, 269], [42, 269, 445454545], false],
        ];
        tests.forEach(([trialA, trialB, goal]) => deepEquality(trialA, trialB) === goal)
    })
    it("should be able to tell that 2 unordered arrays have a deep equality", () => {
        const tests: [number[], number[], boolean][] = [
            [[1, 3, 4], [1, 3, 4], true],
            [[445454545, 42, 269], [42, 269, 445454545], true],
            [[1, 2], [1, 2, 3], false],
            [[3, 1, 2], [1, 2], false],
            [[1], [1], true],
            [[1], [2], false],
        ];
        tests.forEach(([trialA, trialB, goal]) => unorderedDeepEquality(trialA, trialB) === goal)
    })
})
