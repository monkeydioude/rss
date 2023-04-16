import React, { useState } from "react";
import { Text, View, ViewStyle } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";
import Ionicons from '@expo/vector-icons/Ionicons';


interface DropdownProps {
    onValueChange: (value: string|number) => void;
    value?: any;
    style?: ViewStyle;
    items: (string|number)[];
}

const Dropdown = ({items, value, onValueChange}: DropdownProps): JSX.Element => {
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
                            ...tw`py-1.5 px-5.2 ${it > 0 ? "border-t" : ""} ${item === value ? "bg-slate-300": ""}`,
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
    onValueChange: (value: string|number) => void;
    value?: any;
    style?: ViewStyle;
    items: (string|number)[];
}

const SettingWithSelect = ({ label, onValueChange, items, style, value }: SettingWithSelectProps): JSX.Element => {
    return (
        <View
        style={{
            ...SettingCSS.container,
            ...style,
            zIndex: 90
        }}>
            <Text style={SettingCSS.textLabel}>{label}</Text>
            <View style={{...SettingCSS.item, zIndex: 90, elevation: 3}}>
                <Dropdown items={items} value={value} onValueChange={onValueChange} />
            </View>
        </View>
    )
}

export default SettingWithSelect;