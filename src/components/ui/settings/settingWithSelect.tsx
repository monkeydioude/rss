import React from "react";
import { Text, View, ViewStyle } from "react-native";
import Dropdown from 'react-native-input-select';
import tw from 'twrnc';
import SettingCSS from "./settings.css";

type SettingWithSelectProps = {
    style?: ViewStyle;
    label: string;
    onValueChange: (value: any) => void;
    value?: string | number | boolean;
    items: (string | number)[];
}

type Option<N, V> = {
    label: N,
    value: V,
}

const SettingWithSelect = ({ label, onValueChange, items, value, style }: SettingWithSelectProps): JSX.Element => {
    const options = items.map<Option<string | number, string | number>>((v: string | number) => ({
        label: v,
        value: v,
    }));
    return (
        <View style={{ ...SettingCSS.container, ...style }}>
            <Text style={{ ...SettingCSS.textLabel, ...tw`grow` }}>{label}</Text>
            <View style={{ ...SettingCSS.item, ...tw`shrink` }}>
                <Dropdown
                    dropdownContainerStyle={tw`m-0 p-0`}
                    selectedItemStyle={tw`text-xl`}
                    dropdownStyle={{
                        paddingVertical: 0,
                        paddingHorizontal: 10,
                        paddingRight: 25,
                        minHeight: 40,
                        borderWidth: 0,
                    }}
                    dropdownIconStyle={{ top: 16, right: 5 }}
                    checkboxControls={{
                        checkboxStyle: tw`text-xl`
                    }}
                    placeholderStyle={tw`p-0 m-0`}
                    options={options}
                    optionLabel="label"
                    optionValue="value"
                    selectedValue={value}
                    onValueChange={onValueChange}
                    primaryColor={"black"}
                />
            </View>
        </View>
    )
}

export default SettingWithSelect;