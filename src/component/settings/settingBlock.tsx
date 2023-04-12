import React from "react";
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

type AppSettingsProps = {
    style?: StyleProp<ViewStyle>;
    title: string;
    children: JSX.Element;
}

const SettingBlock = ({ style, title, children }: AppSettingsProps): JSX.Element => {
    return (
        <View style={style}>
            <View style={tw`flex flex-col justify-start items-center bg-purple-600`}>
                <Text style={tw`text-center text-neutral-100 flex-wrap rounded-lg w-100 pt-1 uppercase`}>{title}</Text>
                <View style={tw`flex flex-shrink flex-row items-center justify-center m-0 p-0`}>{children}</View>
            </View>
        </View>
    )
}

export default SettingBlock;