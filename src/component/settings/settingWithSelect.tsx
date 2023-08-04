import React, { useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";
import Ionicons from '@expo/vector-icons/Ionicons';
import DropdownPlease from 'react-native-input-select';

interface DropdownProps {
    onValueChange: (value: string | number) => void;
    value?: any;
    style?: ViewStyle;
    items: (string | number)[];
}

const Dropdown = ({ items, value, onValueChange }: DropdownProps): JSX.Element => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    return (
        <View style={{
            ...tw`bg-white p-2 rounded`,
            zIndex: 9
        }}>
            <View style={tw`flex flex-row items-center`} onTouchStart={() => setIsVisible(!isVisible)}>
                <Text style={tw`text-lg`}>{value}</Text>
                <Ionicons
                    style={tw`pl-2 text-lg`}
                    name="arrow-down" />
            </View>
            {isVisible &&
                <View style={{
                    ...tw`flex absolute bg-white rounded flex-col items-center shadow-2xl`,
                    left: 0,
                    top: 0,
                    width: 63,
                }}>
                    {items.map((item, it) => (
                        <View
                            onTouchStart={() => {
                                onValueChange(item);
                                setIsVisible(!isVisible);
                            }}
                            key={item}
                            style={{
                                ...tw`py-1.5 px-5.2 ${it > 0 ? "border-t" : ""} ${item === value ? "bg-slate-300" : ""}`,
                            }}
                        >
                            <Text style={tw`text-lg`}>{item}</Text>
                        </View>
                    ))}
                </View>
            }
        </View>
    )
}


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