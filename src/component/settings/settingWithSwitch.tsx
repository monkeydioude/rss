import React from "react";
import { Text, Switch, View, ViewStyle } from "react-native";
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
            <Text style={SettingCSS.textLabel}>{label}</Text>
            <Switch
                style={SettingCSS.item}
                value={checked}
                thumbColor="#6200EE" 
                trackColor={{
                    false: "white",
                    true: "#ffc85e"
                }}
                onValueChange={onValueChange} />
        </View>
    )
}

export default SettingWithSwitch;