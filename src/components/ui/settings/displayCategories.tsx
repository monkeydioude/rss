import React, { useContext, useState } from "react";
import { ConfigContext } from "src/context/configContext";
import config from "src/services/config";
import tw from 'twrnc';
import SettingWithEditInput from "./settingWithInput";
import SettingWithSwitch from "./settingWithSwitch";

const DisplayCategories = (): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);
    const [checked, setChecked] = useState<boolean>(config.props.displayCategories);

    return (
        <>
            <SettingWithSwitch
                style={tw`mt-4`}
                label="Display categories"
                checked={checked}
                onValueChange={() => {
                    setConfig({
                        displayCategories: !checked,
                    });
                    setChecked(!checked);
                }}
            />
            <SettingWithEditInput
            style={tw`mt-4`}
                label={"Categories amount: "}
                preventUnderline={true}
                onSubmitEditing={(value: string) => {
                    setConfig({
                        maxAmntCategories: Number.parseInt(value),
                    });
            } } text={""+config.props.maxAmntCategories} />
        </>
    )
}

export default DisplayCategories;