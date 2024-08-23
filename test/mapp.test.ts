import { assert } from "chai";
import { describe } from "mocha";
import { Mapp } from "../src/services/map/mapp";

describe("mapp", () => {
    type TestType = { key: number, value: string };
    it("should be able to use any", () => {
        const mapp = new Mapp<number, string>([[1, "salut"], [2, "ciao"]]);
        const tests: [({ key, value }: TestType) => boolean, boolean][] = [
            [({ value }): boolean => (value == "salut"), true],
            [({ key }): boolean => (key == 3), false],
        ];
        tests.forEach(([trial, goal]) => assert.equal(mapp.any(trial), goal))
    })

    it("should be able to filter", () => {
        const mapp = new Mapp<number, string>([[1, "salut"], [2, "ciao"]]);
    
        const tests: [({ key, value }: TestType) => boolean, Mapp<number, string>][] = [
            [({ value }): boolean => (value == "salut"), new Mapp([[1, "salut"]])],
            [({ key }): boolean => (key == 3), new Mapp()],
            [({ key }): boolean => (key == 2), new Mapp([[2, "ciao"]])],
        ];
    
        tests.forEach(([trial, goal]) => assert.equal(
            JSON.stringify(Array.from(mapp.filter(trial).values())),
            JSON.stringify(Array.from(goal.values())))
        );
    })
})
