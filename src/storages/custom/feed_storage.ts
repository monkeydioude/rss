import appConfig from "src/appConfig";
import { Item } from "src/entity/item";
import { JSONStorage } from "../json_storage";

export const FeedStorage = new JSONStorage<Item[]>(appConfig.storageKeys.feed_items); 