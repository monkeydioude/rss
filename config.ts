export default {
    fetchRequestTimeout: 2 * 1000, // in millisecond
    fetchThreshold: 30 * 1000, // in millisecond
    bypassServerAddr: "https://bypasscors-mtwkyutmvq-uc.a.run.app",
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
    events: {
        set_feeds: "set_feeds",
        swipe_config: "swipe_config",
        update_global_config: "update_global_config",
        feed_desc_open: "feed_desc_open",
    },
    maxItemPerFeed: 10,
    feedsRefreshTimer: 60 * 1000, // in millisecond
    appTitle: "RSS",
    settingsMenuAnimationDuration: 450,
    swipeBaseRange: 10,
}