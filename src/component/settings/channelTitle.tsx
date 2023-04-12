import React, { useContext, useEffect, useState } from "react";
import { ChannelTitleMode, Config, ConfigContext } from "../../context/configContext";
import SettingBlock from "./settingBlock";
import { Text, View } from "react-native";
import { Switch } from "@react-native-material/core";
import tw from 'twrnc';
import SettingWithSwitch from "./settingWithSwitch";

const ChannelTitle = (): JSX.Element => {
    const { setConfig, onConfigChange } = useContext(ConfigContext);
    const [ checked, setChecked ] = useState<boolean>(true);

    useEffect(() => {
        const [ unsub ] = onConfigChange((config: Config) => {
            setChecked(config.displayChannelTitle === ChannelTitleMode.NewLine);
        })
        return unsub;
    }, []);

    return (
        <SettingWithSwitch
            label="Channel title breaks line"
            checked={checked}
            onValueChange={() => {
                setConfig<ChannelTitleMode>(
                    "displayChannelTitle",
                    // Opposite, cause defining next state, aftet hitting the switch
                    checked ? ChannelTitleMode.Inline : ChannelTitleMode.NewLine
                );
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;