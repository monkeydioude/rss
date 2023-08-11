import React, { useContext, useState } from "react";
import { ConfigContext } from "../../context/configContext";
import SettingWithSwitch from "./settingWithSwitch";
import config from "../../service/config";

const DisplayCategories = (): JSX.Element => {
    const { setConfig } = useContext(ConfigContext);
    const [checked, setChecked] = useState<boolean>(config.props.displayCategories);

    return (
            <SettingWithSwitch
                label="Display categories"
                checked={checked}
                onValueChange={() => {
                    setConfig({
                        displayCategories: !checked,
                    });
                    setChecked(!checked);
                }}
            />
    )
}

export default DisplayCategories;