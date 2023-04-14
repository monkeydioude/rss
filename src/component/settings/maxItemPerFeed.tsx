import React, { useContext, useEffect, useState } from "react";
import SettingWithSelect from "./settingWithSelect";
import config from "../../../config";
import tw from "twrnc";
import { ConfigContext } from "../../context/configContext";

const MaxItemPerFeed = (): JSX.Element => {
    const { setConfig, getConfig, onConfigChange } = useContext(ConfigContext);
    const [ value, setValue ] = useState<number>(config.maxItemPerFeed);

    useEffect(() => {
        try {
            setValue(getConfig("itemsPerChannel"));
        } catch (err) {
            console.error("could not set iterms per channel:", err);
        }
    }, []);

    return (
        <SettingWithSelect
            style={tw`mb-2`}
            onValueChange={(value: string|number) => {
                setConfig("itemsPerChannel", value.toString());
            }}
            label="Max items per channel"
            value={value}
            items={config.maxItemPerFeedChoices} />
    )
}

export default MaxItemPerFeed;