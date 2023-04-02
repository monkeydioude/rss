import { describe } from "mocha";
import { assert } from "chai";
import { cleanString, stripHTMLTags } from "../src/service/string";

describe("stripHTMLTags", () => {
    it("should strip html tags from string", () => {
        const [ trial, goal ] = [
            "<p>salut les kids </p>", "salut les kids "
        ]

        assert.equal(stripHTMLTags(trial), goal);
    })
})

describe("cleanString", () => {
    it("should clean a string", () => {
        const [ trial, goal ] = [
            " <p>salut les kids </p> ", "salut les kids"
        ]

        assert.equal(cleanString(trial), goal);
    })
})