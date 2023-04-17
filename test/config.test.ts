import { describe } from "mocha";
import { Config } from "../src/service/config";
import { assert } from "chai";

describe("config operations", () => {
    it("should be able to save config", () => {
        const trial = new Config().update({
            displayChannelTitle: 0,
            maxItemPerFeed: 0
        });

        const goal = {...trial.props, maxItemPerFeed: 1};

        trial.set({
            maxItemPerFeed: 1,
        })

        assert.deepEqual(trial.props, goal);
    });

    // it("should not be able to save non existing prop", () => {
    //     const trial = new Config().update({
    //         displayChannelTitle: 0,
    //         maxItemPerFeed: 0
    //     });

    //     const goal = {...trial.props};

    //     trial.set({
    //         pouet: 1,
    //     } as Partial<ConfigProps>)

    //     assert.deepEqual(trial.props, goal);
    // });
})