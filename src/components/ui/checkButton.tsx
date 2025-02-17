import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from "@react-native-material/core";
import React from "react";
import { GestureResponderEvent, TextStyle, View } from "react-native";
import customStyle from "src/style/style";
import tw from 'twrnc';
import Button from './react-native-material/Button';

type Props = {
    checked: boolean;
    title: string;
    style?: TextStyle;
    textStyle?: TextStyle;
    onPress: (isChecked: boolean) => void;
    onLongPress?: (e: GestureResponderEvent) => void;
    trailing?: JSX.Element,
}

const CheckButton = ({
    title,
    style,
    textStyle,
    checked,
    onPress,
    onLongPress,
    trailing
}: Props): JSX.Element => {
    const maxLen = 30;
    title = title.substring(0, maxLen) + (title.length > maxLen ? "..." : "");
    return (
        <View style={tw`relative`}>
            <Button
                style={{
                    ...style,
                }}
                color={customStyle.primaryColorDark}
                onLongPress={(e: GestureResponderEvent) => {
                    if (onLongPress) {
                        onLongPress(e);
                    }
                }}
                onPress={() => {
                    onPress(true);
                }}
                title={
                    <View style={tw`flex flex-row items-center justify-start`}>
                        {checked &&
                            <>
                                <Ionicons name='checkmark' style={tw`w-2.5 text-white`} />
                                <Text style={{
                                    ...tw`text-green-600 p-1 grow-1`,
                                    ...textStyle,
                                }} >{title}</Text>
                            </>
                        }
                        {!checked &&
                            <>
                                <Ionicons name='close' style={tw`w-2.5 text-red-600`} />
                                <Text style={{
                                    ...textStyle,
                                    ...tw`text-red-600 p-1 grow-1`,
                                }} >{title}</Text>
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