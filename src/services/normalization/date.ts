import { normalize } from "./normalization";

// replaceUTC is a normalizer for replacing UT/UTC text from some items' publish date
export const replaceUTC = (d: string): string => {
    return (d).replace(/UTC?/, "+0000") || ""
}

// normalizePubDate helps standardizing items' publish dates
export const normalizePubDate = (pubDate: string): string => {
    return normalize([
        replaceUTC,
    ], ""+pubDate);
}