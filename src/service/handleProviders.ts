import { newProviderDataCollection, Provider } from "../data_struct"

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
        console.error(e);
    }
}

export const providersChangeURL = async (urlBefore: string, urlNow: string) => {
    try {
        const plist = await newProviderDataCollection().update();
        const provider = plist.get(urlBefore);
        provider.url = urlNow;
        provider.id = urlNow;
        plist.set(urlNow, provider);
        plist.delete(urlBefore);

        await plist.write();
    } catch (e) {
        // @todo: warning/error msg in app
        console.error(e);
    }
}
