import appConfig from "src/appConfig";
import { ConfigState } from "src/global_states/config";
import { JSONStorage } from "../json_storage";

export const ConfigStorage = new JSONStorage<ConfigState>(appConfig.storageKeys.global_config); 