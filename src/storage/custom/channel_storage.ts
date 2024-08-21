import appConfig from "src/appConfig";
import { MapStorage } from "../map_storage";

export const ChannelStorage = new MapStorage<number, string>(appConfig.storageKeys.channel_ids);