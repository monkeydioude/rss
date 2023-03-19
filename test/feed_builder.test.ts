import { describe } from "mocha";
import { bubbleSortNews, Order } from "../src/feed_builder";
import { assert } from "chai";

describe("bubble sort tests", () => {
    it("should sort a RSSItem[] by descending date", () => {
        const tgs = [
            [4, 5, 1, 2], [5, 4, 2, 1]
        ]
        const trial = []
        const goal = []
        tgs[0].forEach((v: number, idx: number) => {
            trial.push({
                pubDate: new Date(v*1000).toString(),
            })
            goal.push({
                pubDate: new Date(tgs[1][idx]*1000).toString(),
            })
        })
        const result = bubbleSortNews(trial, 0, 0, Order.DESC);
        assert.deepEqual(result, goal);
    });
    it("should sort a RSSItem[] by ascending date", () => {
        const tgs = [
            [4, 5, 1, 2], [1, 2, 4, 5]
        ]
        const trial = []
        const goal = []
        tgs[0].forEach((v: number, idx: number) => {
            trial.push({
                pubDate: new Date(v*1000).toString(),
            })
            goal.push({
                pubDate: new Date(tgs[1][idx]*1000).toString(),
            })
        })
        const result = bubbleSortNews(trial, 0, 0, Order.ASC);
        assert.deepEqual(result, goal);
    });
})