import React, { createContext, useContext } from "react";
import { events } from "../appConfig";
import { EventsContext, Unsubber } from "./eventsContext";
import config, { Config, ConfigProps } from "../service/config";
import { log } from "../service/logchest";

/**
 * Only for setting config and listening to config change.
 * Config reading should be done through the "../service/config singleton".
 * Gonna migrate this context soon to depend only on the singleton, maybe
 */

interface ConfigContext {
    setConfig: (newConf: Partial<ConfigProps>) => void,
    onConfigChange: (cb: (value?: Config) => void) => [Unsubber, Symbol],
}

export const ConfigContext = createContext<ConfigContext>({
    setConfig: () => { },
    onConfigChange: () => { return null },
});

type Props = {
    children: JSX.Element,
}

const ConfigProvider = ({ children }: Props): JSX.Element => {
    const { onEvent, trigger } = useContext(EventsContext);

    const setConfig = async (newConf: Partial<ConfigProps>) => {
        try {
            config.set(newConf);
            await config.save();
            trigger<Config>(events.update_global_config, config);
        } catch (e) {
            log("setConfig " + e);
            console.error("setConfig", e);
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