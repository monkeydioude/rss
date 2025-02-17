import Ionicons from "@expo/vector-icons/Ionicons";
import { default as Icon } from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import customStyle from "src/style/style";
import tw from 'twrnc';
import Button from "./react-native-material/Button";

type Props = {
    label: string;
    link?: string;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    iconStyle?: ViewStyle;
    icon: keyof typeof Ionicons.glyphMap;
}

const MenuButton = ({ label, icon, style, textStyle, iconStyle, link }: Props): JSX.Element => (
    <Button
        onPress={() => {
            if (link) {
                router.push(link);
            }
        }}
        style={{
            ...style,
            paddingVertical: 4
        }}
        color={customStyle.primaryColorDark}
        title={() => (<View style={tw`items-center flex flex-row justify-center`}>
            <View style={{
                ...tw`flex items-center`,
                minWidth: 25,
            }}><Ionicons color="white" name={icon} style={iconStyle} size={25} /></View>
            <Text style={{
                ...tw`ml-2 items-center text-white grow-1`,
                ...textStyle
            }}>{label}</Text>
            <Icon name={`chevron-right`} style={tw`text-3xl text-white`} />
        </View>)}
    />
)

export default MenuButton;