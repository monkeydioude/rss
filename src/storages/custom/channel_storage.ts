import appConfig from "src/appConfig";
import { Channel } from "src/entity/channel";
import { MapStorage } from "../map_storage";

export const ChannelStorage = new MapStorage<number, Channel>(appConfig.storageKeys.channel_ids);