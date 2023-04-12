import React from "react";
import { Text, Switch, View, StyleProp, ViewStyle } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";

type Props = {
    label: string;
    onValueChange: (value: boolean) => void
    checked: boolean;
    style?: ViewStyle;
}

const SettingWithSwitch = ({ label, onValueChange, checked, style }: Props): JSX.Element => {
    return (
        <View
        style={{
            ...SettingCSS.container,
            ...style
        }}>
            <Text style={tw`text-xl m-0 p-0 pl-1 shrink-1 text-white`}>{label}</Text>
            <Switch
                style={tw`p-0 m-0 grow-1`}
                value={checked}
                thumbColor="#6200EE" 
                trackColor={{
                    false: "rgb(100 116 139)",
                    true: "rgb(22 163 74)"
                }}
                onValueChange={onValueChange} />
        </View>
    )
}

export default SettingWithSwitch;