import { newProviderDataCollection, Provider } from "../data_struct";
import { log } from "./request/logchest";

export const providersUnsub = async (providerName: string): Promise<void> => {
    await providersChangeSub(providerName, false);
}

export const providersResub = async (providerName: string): Promise<void> => {
    await providersChangeSub(providerName, true);
}

export const providersChangeSub = async (providerName: string, subscribed: boolean): Promise<Provider[]> => {
    try {
        const plist = await newProviderDataCollection().update();
        const provider = plist.get(providerName);
        provider.subscribed = subscribed;
        plist.set(providerName, provider);

        await plist.write();
        return Object.values(plist.getStack());
    } catch (e) {
        // @todo: warning/error msg in app
        log("providersChangeSub() " + e);
        console.error("providersChangeSub() " + e);
    }
}

export const providersChangeURL = async (urlBefore: string, urlNow: string): Promise<boolean> => {
    try {
        if (urlBefore === urlNow) {
            return false;
        }
        const plist = await newProviderDataCollection().update();
        const provider = plist.get(urlBefore);
        const newProvider: Provider = {
            id: urlNow,
            url: urlNow,
            subscribed: provider.subscribed,
            name: provider.name,
        }
        plist.set(urlNow, newProvider);
        plist.delete(urlBefore);

        await plist.write();
    } catch (e) {
        // @todo: warning/error msg in app
        log("providersChangeURL() " + e);
        console.error("providersChangeURL() " + e);
        return false;
    }
    return true;
}
