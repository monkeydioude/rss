import React, { useContext, useState } from "react";
import { ConfigContext } from "../../context/configContext";
import SettingWithSwitch from "./settingWithSwitch";
import config from "../../service/config";
import { ChannelTitleMode } from "../../appConfig";

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