import { Item } from "src/entity/item";
import { log } from "src/services/request/logchest";
import { isString } from "../type_ops";

export interface FeedItemFilter {
    (text: string, item: Item): boolean;
}

export const applyFilters = (filters: FeedItemFilter[], match: string, item: Item): boolean => {
    try {
        if (filters.length === 0) {
            return true;
        }

        return filters.every((fc: FeedItemFilter) => {
            try {
                return fc(match, item);
            }
            catch (err) {
                log("filters.current.every: err with filter "+ fc + ": "+ err)
                console.error("filters.current.every: err with filter "+ fc + ": "+ err)
            }
        })
    }
    catch (err) {
        log("applyFilters: error: "+ err)
        console.error("applyFilters: error:"+ err)
        return false
    }
}

export const textFilter: FeedItemFilter = (text: string, item: Item) => {
    let textL = text.toLowerCase();
    const res = 
        (!!item.category && isString(item.category) && !!(item.category as string).toLowerCase().match(textL)) || 
        (!!item.description && !!item.description.toLowerCase().match(textL)) ||
        (!!item.title && !!item.title.toLowerCase().match(textL));
    
    const reg = new RegExp(`(${textL})`, "gi");

    if (item.title) {
        item.title = item.title.replaceAll(reg, "**$1**");
    }
    if (item.description) {
        item.description = item.description.replaceAll(reg, "**$1**");
    }
    return res
};