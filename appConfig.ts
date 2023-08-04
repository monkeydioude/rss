export enum ChannelTitleMode {
    Inline,
    NewLine,
}

export const events = {
    set_feeds: "set_feeds",
    update_global_config: "update_global_config",
    feed_desc_open: "feed_desc_open",
};

const appConfig = {
    logchestAPIURL: process.env && process.env.NODE_ENV && process.env.NODE_ENV === "development" ? "http://0.0.0.0:8080" : "http://4thehoard.com/logchest",
    fetchRequestTimeout: 4 * 1000, // in millisecond
    bootFetchRequestTimeout: 8 * 1000,
    fetchThreshold: 30 * 1000, // in millisecond
    bypassServerAddr: "http://4thehoard.com/bypasscors",
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
    appVersion: "v0.0.2",
}

export default appConfig;