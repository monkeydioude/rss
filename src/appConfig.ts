import env from "src/services/env";
import { ChannelsErrorEnum } from "./entity/channel";

export enum ChannelTitleMode {
    Inline,
    NewLine,
}

export const isDev = (): boolean => (
    !!env && !!process.env.NODE_ENV && process.env.NODE_ENV === "development"
)

const getLogchestAPIURL = (): string => (
    isDev() ?
        (env && env.EXPO_PUBLIC_LOGCHEST_ENDPOINT ? `http://${env.EXPO_PUBLIC_LOGCHEST_ENDPOINT}/logchest` : "http://0.0.0.0:8081/logchest") :
        "https://4thehoard.com/logchest"
)

const getPanyaServerAddr = (): string => (
    isDev() ?
        (env && env.EXPO_PUBLIC_PANYA_ENDPOINT ? `${env.EXPO_PUBLIC_PANYA_ENDPOINT}/panya` : "http://0.0.0.0:8083/panya") :
        "https://4thehoard.com/panya"
)

const getIdentityServerAddr = (): string => (
    isDev() ?
        (env && env.EXPO_PUBLIC_IDENTITY_ENDPOINT ? `${env.EXPO_PUBLIC_IDENTITY_ENDPOINT}/identity` : "http://0.0.0.0:8100/identity") :
        "https://4thehoard.com/identity"
)

const appConfig = {
    emojis: {
        "error": [
            "(•᷄- •᷅ ;)", "(ᗒᗣᗕ)՞", "щ(ﾟДﾟщ)", "(ס_ס;;)", "┣¨キ(*ﾟДﾟ*)┣¨キ"
        ],
        "not_found": [
            "૮₍˶Ó﹏Ò ⑅₎ა", "¯\\_(ツ)_/¯", "(つ﹏⊂)", "(´･ω･`)?", "(눈‸눈)"
        ]
    },
    panyaAPIURL: getPanyaServerAddr(),
    logchestAPIURL: getLogchestAPIURL(),
    fetchRequestTimeout: 4 * 1000, // in millisecond
    bootFetchRequestTimeout: 8 * 1000,
    fetchThreshold: 30 * 1000, // in millisecond
    identityAPIURL: getIdentityServerAddr(),
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
        channel_ids: "channel_ids",
        feed_items: "feed_items",
        identity_token: "identity_token"
    },
    maxHeightFeedDescAnimation: 500,
    openSpeedDescAnimation: 500,
    maxItemPerFeed: 10,
    maxItemPerFeedChoices: [5, 10, 15, 20],
    feedsRefreshTimer: 20 * 1000, // in millisecond
    feedsManualRefreshTimer: 10 * 1000, // in ms
    appTitle: "RSS",
    settingsMenuAnimationDuration: 450,
    tokenRefreshInterval: 5 * 60 * 1000,
    swipeBaseRange: 4,
    swipCancelPressDist: 2,
    displayChannelTitle: ChannelTitleMode.NewLine,
    displayCategories: true,
    maxAmntCategories: 4,
    appVersion: "v0.1.1",
    requestTimeout: 5000,
    toastTimer: 2500,
    channelsErrorEnum: {
        [ChannelsErrorEnum.AlreadyExists]: "This source already exists.",
        [ChannelsErrorEnum.URLIssue]: "Maybe an invalid URL?"
    },
    labels: {
        "en": {
            "SESSION_EXPIRED_1": "Your session expired",
            "SESSION_EXPIRED_2": "Please sign in again",
            "UNAUTHORIZED_RELOG": "Unauthorized. Please sign in again",
            "SERVICE_ERROR": "The service is experiencing errors",
            "SETTINGS_LOGOUT_BUTTON": "Logout",
            "LOG_OUT_ASK_1": "About to logout",
            "LOG_OUT_ASK_2": "Are you sure?",
            "LOG_OUT_SUCCESS_1": "🍪 Logged out 👍",
            "LOG_IN_SUCCESS_1": "🍪 Logged in 🍪👍",
            "LOG_IN_ERR_1": "Could not log in",
            "SIGN_UP_SUCCESS_1": "🍪 Signed up 👍",
            "SIGN_UP_ERR_1": "Could not sign up",
            "SIGN_UP_SUCCESS_2": "You can now log in",
            "SETTINGS_FEEDS_SECTION_TITLE": "Feeds subscriptions",
            "SETTINGS_APP_SECTION_TITLE": "App settings",
        }
    }
}

export default appConfig;