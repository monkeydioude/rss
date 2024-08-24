import React, { useState } from "react";
import { ChannelTitleMode } from "src/appConfig";
import { updateConfig, useConfig, useDispatch } from "src/global_states/config";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const ChannelTitle = (): JSX.Element => {
    const config = useConfig();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState<boolean>(config.displayChannelTitle === ChannelTitleMode.Inline);

    return (
        <SettingWithSwitch
            label="Inline channel and date"
            checked={checked}
            onValueChange={() => {
                dispatch(updateConfig({ displayChannelTitle: checked ? ChannelTitleMode.NewLine : ChannelTitleMode.Inline }));
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;