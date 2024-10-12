import React, { useState } from "react";
import { View } from "react-native";
import appConfig from "src/appConfig";
import i18n from "src/i18n";
import tw from "src/style/twrnc";
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
                style={tw`mt-4 my-1 py-3 bg-primaryColorDark rounded`}
                onValueChange={(value: number | string) => {
                    setValue(value);
                    onValueChange(value as number);
                }}
                label={i18n.en.SETTINGS_APP_NUM_ITEM_PER_FEED}
                value={value}
                items={appConfig.maxItemPerFeedChoices} />
        </View>
    )
}

export default MaxItemPerFeed;