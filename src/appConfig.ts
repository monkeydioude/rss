export enum ChannelTitleMode {
    Inline,
    NewLine,
}


export const isDev = (): boolean => (
    !!process.env && !!process.env.NODE_ENV && process.env.NODE_ENV === "development"
)

const getLogchestAPIURL = (): string => (
    isDev() ?
        (process.env && process.env.EXPO_PUBLIC_LOGCHEST_ENDPOINT ? `http://${process.env.EXPO_PUBLIC_LOGCHEST_ENDPOINT}/logchest` : "http://0.0.0.0:8081/logchest") :
    "https://4thehoard.com/logchest"
)

const getBypassServerAddr = (): string => (
    isDev() ? 
        (process.env && process.env.EXPO_PUBLIC_BYPASSCORS_ENDPOINT ? `http://${process.env.EXPO_PUBLIC_BYPASSCORS_ENDPOINT}/bypasscors` : "http://0.0.0.0:8080/bypasscors") :
    "https://4thehoard.com/bypasscors"
)

export const events = {
    set_feeds: "set_feeds",
    update_global_config: "update_global_config",
    feed_desc_open: "feed_desc_open",
};

const appConfig = {
    emojis: {
        "error": [
            "(•᷄- •᷅ ;)", "(ᗒᗣᗕ)՞", "щ(ﾟДﾟщ)", "(ס_ס;;)", "┣¨キ(*ﾟДﾟ*)┣¨キ"
        ],
        "not_found": [
            "૮₍˶Ó﹏Ò ⑅₎ა", "¯\\_(ツ)_/¯", "(つ﹏⊂)", "(´･ω･`)?", "(눈‸눈)"
        ]
    },
    logchestAPIURL: getLogchestAPIURL(),
    fetchRequestTimeout: 4 * 1000, // in millisecond
    bootFetchRequestTimeout: 8 * 1000,
    fetchThreshold: 30 * 1000, // in millisecond
    bypassServerAddr: getBypassServerAddr(),
    recommendedFeeds: [{
        url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
        title: "WSJ: Markets"
    }, {
        url: "https://www.lemonde.fr/economie/rss_full.xml",
        title: "LeMonde: La Une Economique"
    }, {
        url: "https://moscowtimes.ru/rss/news",
        title: "Moscow Times" 
    }],
    storageKeys: {
        rss: "rss",
        providers_list: "providers_list",
        global_config: "global_config",
    },
    events: events,
    maxHeightFeedDescAnimation: 500,
    openSpeedDescAnimation: 500,
    maxItemPerFeed: 10,
    maxItemPerFeedChoices: [5, 10, 15, 20],
    feedsRefreshTimer: 20 * 1000, // in millisecond
    appTitle: "RSS",
    settingsMenuAnimationDuration: 450,
    swipeBaseRange: 4,
    swipCancelPressDist: 2,
    displayChannelTitle: ChannelTitleMode.NewLine,
    displayCategories: true,
    maxAmntCategories: 4,
    appVersion: "v0.0.5"
}

export default appConfig;