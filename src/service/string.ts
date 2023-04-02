export const stripHTMLTags = (text: string): string => {
    return text.replace(/(<([^>]+)>)/ig, "");
}

export const cleanString = (text: string): string => {
    text = stripHTMLTags(text);
    return text.trim();
}