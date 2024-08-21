import React from "react";
import { Switch, Text, View, ViewStyle } from "react-native";
import customeStyle from "src/style/style";
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
            <Text style={{
                ...SettingCSS.textLabel,
                ...tw`text-left text-xl`
            }}>{label}</Text>
            <View style={SettingCSS.item}>
                <Switch
                    style={{
                        width: "80%",
                        ...{ transform: [{ scale: 1.75 }] },
                    }}
                    value={checked}
                    thumbColor={customeStyle.primaryColorDark}
                    trackColor={{
                        false: "white",
                        true: customeStyle.thirdColor,
                    }}
                    onValueChange={onValueChange} />
            </View>
        </View>
    )
}

export default SettingWithSwitch;