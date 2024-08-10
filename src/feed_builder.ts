import { Item } from "./entity/item";
import { log } from "./service/logchest";
import { add_channel } from "./service/request/panya";
import { addChannel, useDispatch } from "./store/channels";

export const add_feed_source = async (url: string): Promise<number | null> => {
    try {
        const channel = await add_channel(url);
        if (!channel) {
            throw "no channel in response";
        }
        if (!channel.channel_id) {
            throw "missing channel_id";
        }
        return channel.channel_id;
    } catch (err) {
        log(`add_feed_source: Could not add feed source ${url}: ${err}`);
        console.error(`Could not add feed source ${url}`, err);
    }
    return null;
}

// const getURL = (url: string): string => {
//   return `${appConfig.bypassServerAddr}/${url}`;
// }

// // fetchXMLData retrieves a provider's feed
// export const fetchXMLData = async (url: string, timeOut: number): Promise<XMLData | null> => {
//   const ctrl = new AbortController();

//   let parsed: XMLData | null = null;
//   setTimeout(() => ctrl.abort(), timeOut);

//   try {
//     const res = await fetch(getURL(url), {
//       method: "GET",
//       signal: ctrl.signal,
//     });

//     const text = await res.text();
//     parsed = new XMLParser().parse(text);
//   } catch (err) {
//     throw "could not fetch data"
//   }
//   return parsed;
// }

// // isUpdatable compare the sum of the rss provider's date and an update threshold
// // against the now date 
// const isUpdatable = (data: RSSData): boolean => (
//   !data || !data.lastFetchDate || (data.lastFetchDate + appConfig.fetchThreshold < +new Date())
// )

// // fetchAndUpdateCollection fires a request to the feed's provider
// // and update its lastFetchDate
// const fetchAndUpdateCollection = async (
//   url: string,
//   rssColl: DataCollection<RSSData>,
//   timeOut = appConfig.fetchRequestTimeout,
// ) => {
//   try {
//     const newFeeds = await fetchXMLData(url, timeOut);
//     if (!newFeeds || !newFeeds.rss) {
//       return;
//     }

//     newFeeds.rss.lastFetchDate = +new Date();
//     newFeeds.rss.channel.item.forEach((item: RSSItem) => {
//       item.channelTitle = newFeeds.rss.channel.title;
//     })
//     rssColl.set(url, newFeeds.rss);
//   } catch (e) {
//     // @todo: warning/error msg in app
//     log(`Could not fetch feeds from source URL (${url}): ${e}`);
//     console.error(`Could not fetch feeds from source URL (${url}): ${e}`);
//   }
// }

// // addFeed tries to add a new feed url to parse
// // and put it into storage
// export const addFeed = async (
//   url: string,
//   updateCb: (f: RSSItem[]) => void
// ) => {
//   try {
//     const rssColl = await filtersOutUnsubedProviders();
//     // if (!await shouldUpdateFeed(url, rssColl)) {
//     //   return;
//     // }

//     if (rssColl.get(url)) {
//       return
//     }

//     await fetchAndUpdateCollection(url, rssColl);
//     await (new DataCollection<Provider>(appConfig.storageKeys.providers_list)).insert(url, {
//       id: url,
//       url,
//       name: rssColl.get(url)?.channel.title || "",
//       subscribed: true,
//     });
//     await rssColl.write();
//     updateCb(trimFeeds(rssColl.getStack()));
//   } catch (e) {
//     // @todo: warning/error msg in app
//     log("addFeed, could not build data feed:" + e);
//     console.error("addFeed, could not build data feed:", e);
//   }
// }

// export const filtersOutUnsubedProviders = async (): Promise<DataCollection<RSSData>> => {
//   const plist = await new DataCollection<Provider>(appConfig.storageKeys.providers_list).update();
//   const rssColl = await (new DataCollection<RSSData>(appConfig.storageKeys.rss)).update();

//   for (let [url, p] of plist.getStack()) {
//     if (p.subscribed === false) {
//       rssColl.delete(url);
//     }
//   }

//   return rssColl;
// }

// export const resyncSubbedRssFeed = async (rssColl: DataCollection<RSSData>): Promise<void> => {
//   const plist = await new DataCollection<Provider>(appConfig.storageKeys.providers_list).update();

//   const ps: Promise<void>[] = [];
//   for (let [url] of plist.getStack()) {
//     ps.push(fetchAndUpdateCollection(url, rssColl));
//   }

//   await Promise.all(ps);
// }

// export const reloadFeeds = async (updateCb: (f: RSSItem[]) => void): Promise<void> => {
//   try {
//     const rssColl = await filtersOutUnsubedProviders();
//     const r = trimFeeds(rssColl.getStack());
//     updateCb(r);
//   } catch (e) {
//     // @todo: warning/error msg in app
//     console.error("reloadFeeds, could not build data feed:", e);
//     log("reloadFeeds, could not build data feed:" + e);
//   }

// }

// // loadAndUpdateFeeds loads every feeds put in storage,
// // check if they can be updated, if so request a new version
// // of the feed, then put the updated feed into storage
// // and then triggers the update state callback
// export const loadAndUpdateFeeds = async (
//   updateCb: (f: RSSItem[]) => void,
//   timeOut = appConfig.fetchRequestTimeout,
// ) => {
//   let rssColl = new DataCollection<RSSData>(appConfig.storageKeys.rss);
//   try {

//     try {
//       rssColl = await filtersOutUnsubedProviders();
//     } catch (err) {
//       // @todo: warning/error msg in app
//       console.error(err);
//       log("" + err);
//     }
//     console.log(process.env.EXPO_PUBLIC_PANYA_ENDPOINT)

//     if (rssColl.getStack().size === 0) {
//       throw "Empty stack";
//     }

//     const feeds = rssColl.getStack();
//     const promises: Promise<void>[] = [];
//     let updated = false;

//     // for (const [url, data] of feeds) {
//     //   if (!isUpdatable(data)) {
//     //     continue;
//     //   }
//     //   updated = true;
//     //   promises.push(fetchAndUpdateCollection(url, rssColl, timeOut));
//     // }

//     await Promise.all(promises);

//     if (updated) {
//       await rssColl.write();
//     }

//     updateCb(trimFeeds(rssColl.getStack()));
//   } catch (e) {
//     try {
//       log("error while building data feed: " + e + "\nTrying once more");
//       console.warn("error while building data feed:", e, "\nTrying once more")
//       await resyncSubbedRssFeed(rssColl);
//       if (rssColl.getStack().size === 0) {
//         throw "Really cant read feed sources"
//       }
//       await rssColl.write();
//       updateCb(trimFeeds(rssColl.getStack()));
//     }
//     catch (err) {
//       log("loadAndUpdateFeeds, could not build data feed: " + e);
//       // @todo: warning/error msg in app
//       console.warn("loadAndUpdateFeeds, could not build data feed:", e);
//     }
//   }
// }

// export enum Order {
//   DESC,
//   ASC,
// }

// // bubbleSortNews use the bubble sort algorith to sort feed items
// export const bubbleSortNews = (news: RSSItem[], order: Order): RSSItem[] => {
//   let swap = 0;

//   for (let idx = 0; idx < news.length - 1; idx++) {
//     if (!news[idx] || !news[idx + 1]) {
//       continue
//     }

//     const currentIdxStamp = +new Date(news[idx].pubDate);
//     const nextIdxStamp = +new Date(news[idx + 1].pubDate);

//     if (
//       (order == Order.DESC && nextIdxStamp > currentIdxStamp)
//       || (order == Order.ASC && currentIdxStamp > nextIdxStamp)) {
//       const tmp = news[idx];
//       news[idx] = news[idx + 1];
//       news[idx + 1] = tmp;
//       swap++;
//     }
//   }

//   if (swap > 0) {
//     bubbleSortNews(news, order);
//   }

//   return news;
// }

// // trimfeeds takes a map of RSSData as parameter and output a
// // trimmed and ordered list of feed items
// export const trimFeeds = (feeds: Map<string, RSSData>): RSSItem[] => {
//   try {
//     const rssItems = Array.from(feeds.values())
//       .flatMap((data: RSSData): RSSItem[] => (
//         data.channel.item.splice(0, config.props.maxItemPerFeed)
//       ));

//     // reverse array if order is set to ASC
//     return bubbleSortNews(rssItems, Order.DESC);
//   } catch (e) {
//     // @todo: warning/error msg in app
//     log("" + e);
//     console.error(e);
//     return [];
//   }
// }

// export const getUnsubbedProvidersFeeds = async (): Promise<RSSItem[]> => {
//   return Object.values((await filtersOutUnsubedProviders()).getStack());
// }