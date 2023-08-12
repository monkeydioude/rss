import { Button, Text } from "@react-native-material/core";
import React from "react";
import { GestureResponderEvent, TextStyle, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';
import customeStyle from "../style/style"

type Props = {
    checked: boolean;
    title: string;
    style?: TextStyle;
    onPress: (isChecked: boolean) => void;
    onLongPress?: (e: GestureResponderEvent) => void;
    trailing?: JSX.Element,
}

const CheckButton = ({
    title,
    style,
    checked,
    onPress,
    onLongPress,
    trailing
}: Props): JSX.Element => {
    const maxLen = 40;
    title = title.substring(0, maxLen) + (title.length > maxLen ? "..." : "");
    return (
        <View style={tw`relative`}>
            <Button
                style={{
                    ...style,
                    ...tw`flex grow-1`,
                }}
                color={customeStyle.primaryColorDark}
                onLongPress={(e: GestureResponderEvent) => {
                    if (onLongPress) {
                        onLongPress(e);
                    }
                }}
                onPress={() => {
                    onPress(true);
                }}
                title={
                <View style={tw`flex flex-row items-center`}>
                    { checked && 
                    <>
                        <Ionicons name='checkmark' color="white" style={tw`w-2.5`} />
                        <Text style={tw`text-white p-1`} >{title}</Text>
                    </>
                    }
                    { !checked && 
                    <>
                        <Ionicons name='close' style={tw`w-2.5 text-red-600`} />
                        <Text style={tw`text-red-600 p-1`} >{title}</Text>
                    </>
                    }
                </View>
                }
                trailingContainerStyle={tw`shrink-1 absolute right-0`}
                trailing={trailing} />
        </View>
    )
}

export default CheckButton;