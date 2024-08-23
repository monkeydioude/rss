import React, { useState } from "react";
import { useConfig } from "src/global_states/config";
import tw from 'twrnc';
import SettingWithEditInput from "../../ui/settings/settingWithInput";
import SettingWithSwitch from "../../ui/settings/settingWithSwitch";

const DisplayCategories = (): JSX.Element => {
    const config = useConfig();
    const [checked, setChecked] = useState<boolean>(config.displayCategories);

    return (
        <>
            <SettingWithSwitch
                style={tw`mt-4`}
                label="Display categories"
                checked={checked}
                onValueChange={() => {
                    // setConfig({
                    //     displayCategories: !checked,
                    // });
                    setChecked(!checked);
                }}
            />
            <SettingWithEditInput
            style={tw`mt-4`}
                label={"Categories amount: "}
                preventUnderline={true}
                onSubmitEditing={(value: string) => {
                    // setConfig({
                    //     maxAmntCategories: Number.parseInt(value),
                    // });
            } } text={""+config.maxAmntCategories} />
        </>
    )
}

export default DisplayCategories;