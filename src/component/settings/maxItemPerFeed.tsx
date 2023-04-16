import React, { useContext, useEffect, useState } from "react";
import SettingWithSelect from "./settingWithSelect";
import tw from "twrnc";
import defaultConfig from "../../../defaultConfig";

interface Props {
    onValueChange: (value:string|number) => void;
    value: number;
}

const MaxItemPerFeed = ({ onValueChange, value: _value }: Props): JSX.Element => {
    const [ value, setValue ] = useState<number|string>(_value);

    return (
        <SettingWithSelect
            style={tw`mb-2`}
            onValueChange={(value: number|string) => {
                setValue(value);
                onValueChange(value);
            }}
            label="Max items per channel"
            value={value}
            items={defaultConfig.maxItemPerFeedChoices} />
    )
}

export default MaxItemPerFeed;