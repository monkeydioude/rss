import appConfig from "src/appConfig";
import { IdentityToken } from "src/services/identity/types";
import { JSONStorage } from "../json_storage";

export const TokenStorage = new JSONStorage<IdentityToken | null>(appConfig.storageKeys.identity_token); 