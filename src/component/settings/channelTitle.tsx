import React, { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../context/configContext";
import SettingWithSwitch from "./settingWithSwitch";
import config from "../../service/config";
import { ChannelTitleMode } from "../../../defaultConfig";

const ChannelTitle = (): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);
    const [ checked, setChecked ] = useState<boolean>(config.props.displayChannelTitle === ChannelTitleMode.NewLine);

    return (
        <SettingWithSwitch
            label="Channel title breaks line"
            checked={checked}
            onValueChange={() => {
                setConfig({
                    displayChannelTitle: checked ? ChannelTitleMode.Inline : ChannelTitleMode.NewLine
                });
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;