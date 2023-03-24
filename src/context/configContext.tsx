import React, { createContext, useState } from "react";

export enum ChannelTitleMode {
    Inline,
    NewLine,
}

type Config = {
    displayChannelTitle: ChannelTitleMode
};

export enum ConfigKeys {
    DisplayChannelTitle = "displayChannelTitle",
}

type ConfigContext = {
    setConfig: <T,>(key: string, value: T) => void,
    getConfig: <T,>(key: string) => T,
    onConfigChange: (key: string, cb: () => void) => void,
}

export const ConfigContext = createContext<ConfigContext>({
    setConfig: () => {},
    getConfig: <T,>(): T => null,
    onConfigChange: () => {},
});

type Props = {
    children: JSX.Element,
}

const ConfigProvider = ({ children }: Props): JSX.Element => {
    const listeners = new Map<string, (() => void)[]>();
    const [ fullConfig, setFullConfig ] = useState<Config>({
        displayChannelTitle: ChannelTitleMode.NewLine,
    });

    const setConfig = <T,>(key: string, value: T) => {
        if (fullConfig[key] === undefined) {
            return;
        }
        fullConfig[key] = value;
        setFullConfig({...fullConfig});
        const c = listeners.get(key);
        if (!c) {
            return;
        }
        c.forEach(cb => cb());
    }

    const getConfig = <T,>(key: string): T => {
        if (fullConfig[key] === undefined) {
            return null;
        }
        return fullConfig[key];
    }

    const onConfigChange = (key: string, cb: () => void) => {
        let c = listeners.get(key);

        if (!c) {
            c = [];
        }
        c.push(cb)
        listeners.set(key, c);
    }

    return (
        <ConfigContext.Provider value={{
            setConfig,
            getConfig,
            onConfigChange,
        }}>{children}</ConfigContext.Provider>
    )
}

export default ConfigProvider;