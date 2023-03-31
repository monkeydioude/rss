import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import config from "../../config";
import { JSONStorage } from "../service/data_storage";
import { EventsContext, Unsubber } from "./eventsContext";

export enum ChannelTitleMode {
    Inline,
    NewLine,
}

export type Config = {
    displayChannelTitle: ChannelTitleMode;
    itemsPerChannel: number;
};

interface ConfigContext {
    setConfig: <T,>(key: string, value: T) => void,
    getConfig: <T,>(key: string) => T,
    onConfigChange: (cb: (value?: Config) => void) => [Unsubber, Symbol],
    loadConfig: () => void,
}

export const ConfigContext = createContext<ConfigContext>({
    setConfig: () => {},
    getConfig: <T,>(): T => null,
    onConfigChange: () => {return null},
    loadConfig: () => {},
});

type Props = {
    children: JSX.Element,
}


const ConfigProvider = ({ children }: Props): JSX.Element => {
    const configStorage = useRef(new JSONStorage<Config>(config.storageKeys.global_config));
    const { onEvent, trigger } = useContext(EventsContext);
    const [ fullConfig, setFullConfig ] = useState<Config>({
        displayChannelTitle: ChannelTitleMode.NewLine,
        itemsPerChannel: config.maxItemPerFeed,
    });

    const loadConfig = async () => {
        try {
            let res = await configStorage.current.retrieve();
            if (!res) {
                res = fullConfig;
            }
            setFullConfig({...res});
            trigger<Config>(config.events.update_global_config, res);
        } catch (e) {
            // @todo: warning/error msg in app
            console.error(e);
        }
    };

    const setConfig = async <T,>(key: string, value: T) => {
        try {
            if (fullConfig[key] === undefined) {
                return;
            }
            fullConfig[key] = value;
            await configStorage.current.update(fullConfig);
            setFullConfig({...fullConfig});
            trigger<Config>(config.events.update_global_config, fullConfig);
        } catch (e) {
          // @todo: warning/error msg in app
          console.error(e);
        }
    }

    const getConfig = <T,>(key: string): T => {
        if (fullConfig[key] === undefined) {
            return null;
        }
        return fullConfig[key];
    }

    const onConfigChange = (kcb: (value: Config) => void): [Unsubber, Symbol] => {
        return onEvent(config.events.update_global_config, kcb);
    }

    return (
        <ConfigContext.Provider value={{
            setConfig,
            getConfig,
            onConfigChange,
            loadConfig,
        }}>{children}</ConfigContext.Provider>
    )
}

export default ConfigProvider;