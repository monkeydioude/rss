import i18n from "src/i18n";

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const canIRefresh = (date_a: number, threshold: number, should_be_bigger_than_b: number): boolean => {
    return date_a - threshold > should_be_bigger_than_b;
}

export const remainingWaitTime = (date_a: number, threshold: number, last_update: number): number => {
    return (Math.floor((last_update + threshold - date_a) / 1000));
}

export const displayRemainingTime = (date_a: number, threshold: number, last_update: number): string => {
    return i18n.en.TOO_SOON_TO_UPDATE_2.replace("%d", remainingWaitTime(date_a, threshold, last_update).toString());
}

export default sleep;