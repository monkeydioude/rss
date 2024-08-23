import React, { useState } from "react";
import { ChannelTitleMode } from "src/appConfig";
// import { ConfigContext } from "src/context/configContext";
import { useConfig } from "src/global_states/config";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const ChannelTitle = (): JSX.Element => {
    // const { setConfig } = useContext(ConfigContext);
    const config = useConfig();
    const [checked, setChecked] = useState<boolean>(config.displayChannelTitle === ChannelTitleMode.NewLine);

    return (
        <SettingWithSwitch
            label="Inline channel and date"
            checked={checked}
            onValueChange={() => {
                // setConfig({
                //     displayChannelTitle: checked ? ChannelTitleMode.NewLine : ChannelTitleMode.Inline
                // });
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;