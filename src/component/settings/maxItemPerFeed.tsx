import React, { useState } from "react";
import SettingWithSelect from "./settingWithSelect";
import appConfig from "../../../appConfig";
import { View } from "react-native";
import tw from "twrnc";

interface Props {
    onValueChange: (value: string | number) => void;
    value: number;
}

const MaxItemPerFeed = ({ onValueChange, value: _value }: Props): JSX.Element => {
    const [value, setValue] = useState<number | string>(_value);

    return (
        <View>
            <SettingWithSelect
                style={tw`mt-4`}
                onValueChange={(value: number | string) => {
                    setValue(value);
                    onValueChange(value);
                }}
                label="Max items per channel"
                value={value}
                items={appConfig.maxItemPerFeedChoices} />
        </View>
    )
}

export default MaxItemPerFeed;