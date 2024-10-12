import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from '@react-native-material/core';
import React from "react";
import { View } from "react-native";
import tw from "src/style/twrnc";

type Props = {
    title: string;
    iconFA?: keyof typeof FontAwesome.glyphMap;
    iconIo?: keyof typeof Ionicons.glyphMap;
}

const SettingsSectionTitle = ({ title, iconFA, iconIo }: Props): React.ReactNode => {
    return (
        <View style={{
            ...tw`items-center flex flex-row justify-center`,
        }}>
            {iconFA && !iconIo && <FontAwesome color="white" name={iconFA} style={tw`text-xl`} />}
            {iconIo && !iconFA && <Ionicons color="white" name={iconIo} style={tw`text-xl`} />}
            <Text style={{
                ...tw`p-2 items-center text-white text-xl font-semibold`,
            }}>{title}</Text>
        </View>
    )
};

export default SettingsSectionTitle;
