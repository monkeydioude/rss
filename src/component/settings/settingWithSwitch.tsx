import React from "react";
import { Text, Switch, View, ViewStyle } from "react-native";
import SettingCSS from "./settings.css";
import customeStyle from "../../style/style";
import tw from 'twrnc';

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
                ...tw`text-left text-lg`
            }}>{label}</Text>
            <View style={SettingCSS.item}>
                <Switch
                    style={{
                        width: "85%",
                        ...{ transform: [{ scale: 1.5 }] },
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