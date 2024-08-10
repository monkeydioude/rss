import {decodeXML} from "entities";
import { normalize } from "./normalization";

export const stripHTMLTags = (text?: string): string => {
    return text?.replace(/(<([^>]+)>)/ig, "") || "";
}

export const cleanString = (text: string): string => {
    return normalize([
        stripHTMLTags,
        decodeXML,
    ], text).trim();
}