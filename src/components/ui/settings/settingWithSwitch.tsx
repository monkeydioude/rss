import React from "react";
import { ColorValue, Switch, Text, TextStyle, View, ViewStyle } from "react-native";
import customeStyle from "src/style/style";
import tw from 'twrnc';
import SettingCSS from "./settings.css";

type Props = {
    label: string;
    onValueChange: (value: boolean) => void
    checked: boolean;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    switchStyle?: ViewStyle;
    thumbColor?: ColorValue;
}

const SettingWithSwitch = ({ label, onValueChange, checked, containerStyle, textStyle, switchStyle, thumbColor }: Props): JSX.Element => {
    return (
        <View
            style={{
                ...SettingCSS.container,
                ...containerStyle
            }}>
            <Text style={{
                ...SettingCSS.textLabel,
                ...tw`text-left text-xl`,
                ...textStyle
            }}>{label}</Text>
            <View style={SettingCSS.item}>
                <Switch
                    style={{
                        ...tw`flex`,
                        marginRight: "10%",
                        ...{ transform: [{ scale: 1.5 }] },
                        ...switchStyle
                    }}
                    value={checked}
                    thumbColor={thumbColor || customeStyle.primaryColor}
                    trackColor={{
                        false: "#d0d0d0",
                        true: customeStyle.thirdColorLight,
                    }}
                    onValueChange={onValueChange} />
            </View>
        </View>
    )
}

export default SettingWithSwitch;