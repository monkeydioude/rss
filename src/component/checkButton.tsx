import { Button, Text } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';

type Props = {
    checked: boolean;
    title: string;
    style?: StyleProp<TextStyle>;
    onPress: (isChecked: boolean) => void;
}

const CheckButton = ({
    title,
    style,
    checked,
    onPress
}: Props): JSX.Element => {
    const [ isChecked, setIsChecked ] = useState<boolean>(checked);
    return (
        <View>
        {(() => {
            if (isChecked) {
                return (
                    <Button
                    style={style}
                    onPress={() => {
                        onPress(!isChecked);
                        setIsChecked(!isChecked);
                    }}
                    title={
                        <View style={tw`flex flex-row items-center`}>
                            <Ionicons name='checkmark' color="white" style={tw`w-2.5`} />
                            <Text style={tw`text-sm text-white p-1`} >{title}</Text>
                        </View>
                    } />
                )
            }
            return (
                <Button
                    style={style}
                    onPress={() => {
                        onPress(!isChecked);
                        setIsChecked(!isChecked);
                    }}
                    title={
                        <View style={tw`flex flex-row items-center`}>
                            <Ionicons name='close' style={tw`w-2.5 text-red-600`} />
                            <Text style={tw`text-sm text-red-600 p-1`} >{title}</Text>
                        </View>
                    } />
            )
        })()}
        </View>
    )
}

export default CheckButton;