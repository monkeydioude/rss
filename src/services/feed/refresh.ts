import appConfig from "src/appConfig";

export const shouldReload = (
    lastRefresh: number,
    feedsRefreshTimer?: number,
): [boolean, Error] => {
    if (!feedsRefreshTimer)
        feedsRefreshTimer = appConfig.feedsRefreshTimer;
    const res = lastRefresh + (feedsRefreshTimer * 0.75) <= +new Date();
    let err: Error = new Error();
    if (!res) {
        err = new Error(`should not refresh, too early: ${lastRefresh} + ${feedsRefreshTimer} > ${+new Date()}`)
    }
    return [res, err];
}