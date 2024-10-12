import React, { useState } from "react";
import { ChannelTitleMode } from "src/appConfig";
import { updateConfig, useConfig, useDispatch } from "src/global_states/config";
import i18n from "src/i18n";
import style from "src/style/style";
import tw from "src/style/twrnc";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const ChannelTitle = (): JSX.Element => {
    const config = useConfig();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState<boolean>(config.displayChannelTitle === ChannelTitleMode.NewLine);

    return (
        <SettingWithSwitch
            label={i18n.en.SETTINGS_APP_INLINE_FEED_NAME_DATE}
            containerStyle={tw`my-1 bg-primaryColorDark py-4 rounded`}
            thumbColor={style.primaryColor}
            checked={checked}
            onValueChange={() => {
                dispatch(updateConfig({ displayChannelTitle: checked ? ChannelTitleMode.Inline : ChannelTitleMode.NewLine }));
                setChecked(!checked);
            }}
        />
    )
}

export default ChannelTitle;