import React, { useState } from "react";
import { updateConfig, useConfig, useDispatch } from "src/global_states/config";
import tw from 'twrnc';
import SettingWithEditInput from "../../ui/settings/settingWithInput";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const DisplayCategories = (): JSX.Element => {
    const config = useConfig();
    const dispatch = useDispatch();
    const [checked, setChecked] = useState<boolean>(config.displayCategories);

    return (
        <>
            <SettingWithSwitch
                style={tw`mt-4`}
                label="Display categories"
                checked={checked}
                onValueChange={() => {
                    dispatch(updateConfig({ displayCategories: !checked }));
                    setChecked(!checked);
                }}
            />
            <SettingWithEditInput
            style={tw`mt-4`}
                label={"Categories amount: "}
                preventUnderline={true}
                onSubmitEditing={(value: string): string => {
                    const maxAmntCategories = Number.parseInt(value);
                    if (isNaN(maxAmntCategories)) {
                        return value;
                    }
                    console.log("maxAmntCategories", maxAmntCategories);
                    dispatch(updateConfig({ maxAmntCategories }));
                    return maxAmntCategories.toString();
            } } text={""+config.maxAmntCategories} />
        </>
    )
}

export default DisplayCategories;