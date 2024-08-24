import { assert } from "chai";
import { describe } from "mocha";
import { clean_url, remove_schemes, remove_trailing_slashes } from "../src/services/normalization/url";

describe("remove_schemes", () => {
    it("should remove the leading scheme (or schemes in case of mistype/bug) from an url", () => {
        [
            ["https://www3.nhk.or.jp/news/easy/", "www3.nhk.or.jp/news/easy/"],
            ["https://http://https://http://https://http://https://http://www3.nhk.or.jp/news/easy/", "www3.nhk.or.jp/news/easy/"],
        ].forEach(([trial, goal]) => assert.equal(remove_schemes(trial), goal))
    })
})

describe("remove_trailing_slashes", () => {
    it("should remove all trailing slashes", () => {
        [
            ["test1/////", "test1"],
            ["test2////", "test2"],
            ["test3///", "test3"],
        ].forEach(([trial, goal]) => assert.equal(remove_trailing_slashes(trial), goal))
    })
})

describe("clean_url", () => {
    it("should clean an url and make it proper for panya", () => {
        [
            ["https://www3.nhk.or.jp/news/easy/", "www3.nhk.or.jp/news/easy"],
            ["test", "test"],
            ["https://http://https://test/a/b/c/////", "test/a/b/c"],
        ].forEach(([trial, goal]) => assert.equal(clean_url(trial), goal))
    })
})