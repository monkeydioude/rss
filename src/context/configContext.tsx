import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { events } from "../../defaultConfig";
import { EventsContext, Unsubber } from "./eventsContext";
import config, { Config, ConfigProps } from "../service/config";

interface ConfigContext {
    setConfig: (newConf: Partial<ConfigProps>) => void,
    onConfigChange: (cb: (value?: Config) => void) => [Unsubber, Symbol],
}

export const ConfigContext = createContext<ConfigContext>({
    setConfig: () => {},
    onConfigChange: () => {return null},
});

type Props = {
    children: JSX.Element,
}

const ConfigProvider = ({ children }: Props): JSX.Element => {
    const { onEvent, trigger } = useContext(EventsContext);

    const setConfig = async (newConf: Partial<ConfigProps>) => {
        try {
            config.set(newConf);
            console.log("ConfigProvider", config.props);
            await config.save();
            trigger<Config>(events.update_global_config, config);
        } catch (e) {
          // @todo: warning/error msg in app
          console.error(e);
        }
    }

    const onConfigChange = (kcb: (value: Config) => void): [Unsubber, Symbol] => {
        return onEvent(events.update_global_config, kcb);
    }

    return (
        <ConfigContext.Provider value={{
            setConfig,
            onConfigChange,
        }}>{children}</ConfigContext.Provider>
    )
}

export default ConfigProvider;