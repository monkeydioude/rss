import React, { useContext, useState } from "react";
import { ChannelTitleMode } from "src/appConfig";
import { ConfigContext } from "src/context/configContext";
import config from "src/services/config";
import SettingWithSwitch from "./settingWithSwitch";

const ChannelTitle = (): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);
    const [checked, setChecked] = useState<boolean>(config.props.displayChannelTitle === ChannelTitleMode.NewLine);

    return (
        <SettingWithSwitch
            label="Inline channel and date"
            checked={checked}
            onValueChange={() => {
                setConfig({
                    displayChannelTitle: checked ? ChannelTitleMode.NewLine : ChannelTitleMode.Inline
                });
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;