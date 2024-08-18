import appConfig from "../appConfig";
import { getRandomInt } from "./math";

export const emojiDispenser = (kind: "error" | "not_found"): string => {
    if (!appConfig.emojis[kind]) {
        return "¯\_(ツ)_/¯";
    }

    const list = appConfig.emojis[kind];
    return list[getRandomInt(list.length)];
}