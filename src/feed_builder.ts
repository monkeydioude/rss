import { XMLParser } from "fast-xml-parser";
import config from "../config";
import { RSSData, DataCollection, RSSItem, XMLData, Provider } from "./data_struct";

const getURL = (url: string): string => {
  return `${config.bypassServerAddr}/${url}`;
}

// fetchXMLData retrieves a provider's feed
export const fetchXMLData = async (url: string, timeOut: number): Promise<XMLData> => {
  const ctrl = new AbortController();
  
  setTimeout(() => ctrl.abort(), timeOut); 
  return fetch(getURL(url), {
      method: "GET",
      signal: ctrl.signal,
    })
    .then(async (res: Response) => {
      return new XMLParser().parse(await res.text());
    })
    .catch((err) => {
      console.log("fetchXMLData", err);
      throw "took too long"
    })
}

// isUpdatable compare the sum of the rss provider's date and an update threshold
// against the now date 
const isUpdatable = (data: RSSData): boolean => (data.lastFetchDate + config.fetchThreshold < +new Date())

const shouldUpdateFeed = async (url: string, coll: DataCollection<RSSData>): Promise<boolean> => {
  try {
    const data = coll.get(url);
    if (!data) {
      return true;
    }
    return isUpdatable(data);
  } catch (e) {
    // @todo: warning/error msg in app
    console.error(e);
    return false
  }
}

// fetchAndUpdateCollection fires a request to the feed's provider
// and update its lastFetchDate
const fetchAndUpdateCollection = async (url: string, rssColl: DataCollection<RSSData>, timeOut = config.fetchRequestTimeout) => {
  try {
    const newFeeds = await fetchXMLData(url, timeOut);
    if (!newFeeds || !newFeeds.rss) {
      return;
    }
    newFeeds.rss.lastFetchDate = +new Date();
    newFeeds.rss.channel.item.forEach((item: RSSItem) => {
      item.channelTitle = newFeeds.rss.channel.title;
    })
    rssColl.set(url, newFeeds.rss);
  } catch (e) {
      // @todo: warning/error msg in app
      console.error("Could not fetch feeds from source URL:", e);
  }
}

// addFeed tries to add a new feed url to parse
// and put it into storage
export const addFeed = async (
  url: string,
  updateCb: (f: RSSItem[]) => void
) => {
  try {
    const rssColl = await filtersOutUnsubedProviders();
    if (!await shouldUpdateFeed(url, rssColl)) {
      return;
    }

    await fetchAndUpdateCollection(url, rssColl);
    await (new DataCollection<Provider>(config.storageKeys.providers_list)).insert(url, {
      id: url,
      url,
      name: rssColl.get(url).channel.title,
      subscribed: true,
    });
    await rssColl.write();
    updateCb(trimFeeds(rssColl.getStack()));
  } catch (e) {
    // @todo: warning/error msg in app
    console.error("Could not build data feed:", e);
  }
}

export const filtersOutUnsubedProviders = async (): Promise<DataCollection<RSSData>> => {
  const plist = await new DataCollection<Provider>(config.storageKeys.providers_list).update();
  const rssColl = await (new DataCollection<RSSData>(config.storageKeys.rss)).update();
  console.log("plist", plist);

  for (let [url, p] of plist.getStack()) {
    if (p.subscribed === false) {
      rssColl.delete(url);
    }
  }

  console.log("rssColl", rssColl);

  return rssColl;
}

export const reloadFeeds = async (updateCb: (f: RSSItem[]) => void): Promise<void> => {
  try {
    const rssColl = await filtersOutUnsubedProviders();
    updateCb(trimFeeds(rssColl.getStack()));
  } catch (e) {
    // @todo: warning/error msg in app
    console.error("Could not build data feed:", e);
  }

}

// loadAndUpdateFeeds loads every feeds put in storage,
// check if they can be updated, if so request a new version
// of the feed, then put the updated feed into storage
// and then triggers the update state callback
export const loadAndUpdateFeeds = async (updateCb: (f: RSSItem[]) => void, timeOut = config.fetchRequestTimeout) => {
  try {
    const rssColl = await filtersOutUnsubedProviders();
    const feeds = rssColl.getStack();
    const promises: Promise<void>[] = [];
    let updated = false;

    for (const [url, data] of feeds) {
      if (!isUpdatable(data)) {
        continue;
      }
      updated = true;
      promises.push(fetchAndUpdateCollection(url, rssColl, timeOut));
    }

    await Promise.all(promises);

    if (updated){
      await rssColl.write();
    }

    updateCb(trimFeeds(rssColl.getStack()));
  } catch (e) {
    // @todo: warning/error msg in app
    console.error("Could not build data feed:", e);
  }
}

export enum Order {
  DESC,
  ASC,
}

// bubbleSortNews use the bubble sort algorith to sort feed items
export const bubbleSortNews = (news: RSSItem[], idx: number, swap: number, order: Order): RSSItem[] => {
  if (idx >= news.length - 1) {
    if (swap == 0) {
      return news;
    }
    return bubbleSortNews(news, 0, 0, order);
  }

  if (!news[idx].pubDate || news[idx].pubDate === "") {
    return bubbleSortNews(news, idx+1, swap, order);
  }

  const currentIdxStamp = +new Date(news[idx].pubDate);
  const nextIdxStamp = +new Date(news[idx+1].pubDate);

  if (
    (order == Order.DESC && nextIdxStamp > currentIdxStamp)
    || (order == Order.ASC && currentIdxStamp > nextIdxStamp)) {
    const tmp = news[idx];
    news[idx] = news[idx+1];
    news[idx+1] = tmp;
    swap++;
  }

  return bubbleSortNews(news, idx+1, swap, order);
}

// trimfeeds takes a map of RSSData as parameter and output a
// trimmed and ordered list of feed items
export const trimFeeds = (feeds: Map<string, RSSData>): RSSItem[] => {
  try {
    const rssItems = Array.from(feeds.values())
    .flatMap((data: RSSData): RSSItem[] => (
      data.channel.item.splice(0, config.maxItemPerFeed)
    ));

  // reverse array if order is set to ASC
  return bubbleSortNews(rssItems, 0, 0, Order.DESC);
  } catch (e) {
    // @todo: warning/error msg in app
    console.error(e);
    return [];
  }
}

export const getUnsubbedProvidersFeeds =  async(): Promise<RSSItem[]> => {
  return Object.values((await filtersOutUnsubedProviders()).getStack());
}