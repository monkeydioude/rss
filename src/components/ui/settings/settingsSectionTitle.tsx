import { default as Icon, default as MaterialCommunityIcons } from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from '@react-native-material/core';
import React from "react";
import { View } from "react-native";
import tw from "src/style/twrnc";

type Props = {
    title: string;
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
}

const SettingsSectionTitle = ({ title, iconName }: Props): React.ReactNode => {
    return (
        <View style={{
            ...tw`items-center flex flex-row justify-center`,
        }}>
            <Icon color="white" name={iconName} style={tw`text-xl`} />
            <Text style={{
                ...tw`p-2 items-center text-white text-xl font-semibold`,
            }}>{title}</Text>
        </View>
    )
};

export default SettingsSectionTitle;
