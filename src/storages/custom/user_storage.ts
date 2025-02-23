import appConfig from "src/appConfig";
import { UserState } from "src/global_states/user";
import { JSONStorage } from "../json_storage";

export const UserStorage = new JSONStorage<UserState>(appConfig.storageKeys.user); 