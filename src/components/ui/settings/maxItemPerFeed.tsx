import React, { useState } from "react";
import { View } from "react-native";
import appConfig from "src/appConfig";
import tw from "twrnc";
import SettingWithSelect from "./settingWithSelect";

interface Props {
    onValueChange: (value: number) => void;
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
                    onValueChange(value as number);
                }}
                label="Max items per channel"
                value={value}
                items={appConfig.maxItemPerFeedChoices} />
        </View>
    )
}

export default MaxItemPerFeed;