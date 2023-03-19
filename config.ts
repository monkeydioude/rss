export default {
    fetchThreshold: 30 * 1000, // in millisecond
    bypassServerAddr: "192.168.1.12:8080",
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
    },
    events: {
        set_feeds: "set_feeds",
    },
    maxItemPerFeed: 10,
    feedsRefreshTimer: 60 * 1000, // in millisecond
    appTitle: "RSS",
    settingsMenuAnimationDuration: 300,
}