import React from "react";
import { Text, View } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";
import DropdownPlease from 'react-native-input-select';

type SettingWithSelectProps = {
    label: string;
    onValueChange: (value: string | number) => void;
    value?: string | number;
    items: (string | number)[];
}

type Option<N, V> = {
    label: N,
    value: V,
}

const SettingWithSelect = ({ label, onValueChange, items, value }: SettingWithSelectProps): JSX.Element => {
    const options = items.map<Option<string | number, string | number>>((v: string | number) => ({
        label: v,
        value: v,
    }));
    return (
        <View style={{ ...SettingCSS.container }}>
            <Text style={{ ...SettingCSS.textLabel }}>{label}</Text>
            <View style={{ ...SettingCSS.item }}>
                <DropdownPlease
                    dropdownContainerStyle={tw`m-0 p-0`}
                    selectedItemStyle={tw`text-lg`}
                    checkboxLabelStyle={tw`text-lg`}
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