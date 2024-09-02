import { normalize } from "./normalization";

export const remove_scheme = (url: string): string => {
    return url.replace(/^https?:\/\//i, "");
}

export const remove_schemes = (url: string): string => {
    while (url.startsWith("http://") || url.startsWith("https://"))
        url = remove_scheme(url);
    return url;
}

export const remove_trailing_slash = (url: string): string => {
    if (url.endsWith("/"))
        return url.substring(0, url.length - 1);
    return url;
}

export const remove_trailing_slashes = (url: string): string => {
    while (url.endsWith("/"))
        url = remove_trailing_slash(url);
    return url;
}

export const clean_url = (url: string): string => {
    return normalize([
        remove_schemes,
        remove_trailing_slashes,
    ], url).trim();
}

export const add_scheme = (url: string): string => {
    return !url.startsWith("http") ? `https://${url}` : url;
}