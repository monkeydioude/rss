import React, { useState } from "react";
import appConfig from "src/appConfig";
import { SettingWithSelect } from "src/components/ui/settings";
import { updateConfig, useConfig, useDispatch } from "src/global_states/config";
import i18n from "src/i18n";
import tw from "src/style/twrnc";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const DisplayCategories = (): JSX.Element => {
    const config = useConfig();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState<boolean>(config.displayCategories);
    return (
        <>
            <SettingWithSwitch
                containerStyle={tw`my-1 py-4 bg-primaryColorDark rounded`}
                label={i18n.en.SETTINGS_APP_SHOW_CATEG}
                checked={checked}
                onValueChange={() => {
                    dispatch(updateConfig({ displayCategories: !checked }));
                    setChecked(!checked);
                }}
            />
            <SettingWithSelect
                style={tw`mt-4 my-1 py-3 bg-primaryColorDark rounded`}
                onValueChange={(value: string | number) => {
                    dispatch(updateConfig({ maxAmntCategories: value as number }));
                }}
                label={i18n.en.SETTINGS_APP_NUM_SHOWN_CATEG}
                value={1}
                items={appConfig.categoryAmount} />
            {/* <SettingWithEditInput
                style={tw`mt-4 my-1 py-1 bg-primaryColorDark rounded`}
                label={"Categories amount: "}
                preventUnderline={true}
                onSubmitEditing={async (value: string): Promise<string> => {
                    const maxAmntCategories = Number.parseInt(value);
                    if (isNaN(maxAmntCategories)) {
                        return value;
                    }
                    dispatch(updateConfig({ maxAmntCategories }));
                    return maxAmntCategories.toString();
                }} text={"" + config.maxAmntCategories} /> */}
        </>
    )
}

export default DisplayCategories;