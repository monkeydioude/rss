import { Text } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { View, NativeSyntheticEvent, TextInputSubmitEditingEventData, Keyboard, ViewStyle, Pressable, TextInput } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";
import Ionicons from '@expo/vector-icons/Ionicons';
import customeStyle from "../../style/style";

type Props = {
    label?: string;
    preventUnderline?: boolean
    onSubmitEditing: (value: string) => void
    text: string;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    inputStyle?: ViewStyle;
}

const SettingWithEditInput = ({ onSubmitEditing, text:_text, style, textStyle, inputStyle, label, preventUnderline }: Props): JSX.Element => {
    const [text, setText] = useState<string>(_text);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(_text);

    useEffect(() => {
        const kbh = Keyboard.addListener("keyboardDidHide", e => {
            setInputVisible(false);
        })

        return () => {
            kbh.remove();
        }
    }, []);
    return (
        <View
            style={{
                ...SettingCSS.container,
                ...style,
                flexDirection: "column",
            }}>
            <Pressable
                style={tw`flex flex-row items-center content-center`}
                onPress={() => {
                    setInputVisible(!inputVisible);
                }
                }>
                <Text style={{
                    ...tw`text-left text-xl shrink-1 text-white m-0 p-0 ${preventUnderline ? "" : "underline"} w-85`,
                    ...textStyle,
                    }}>
                    {label || ""}{text.replace(/https?\:\/\//, "")}
                </Text>
                <Ionicons
                    name="pencil"
                    style={{
                    ...tw`text-3xl grow-1 text-white m-0 p-0`,
                    color: customeStyle.thirdColor,
                }} />
            </Pressable>
            {inputVisible && 
                <TextInput
                    style={{
                        ...SettingCSS.textInput,
                        ...tw`grow-1 p-1 flex text-xl py-3`,
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
                        ...inputStyle,
                    }}
                    autoFocus={true}
                    onSubmitEditing={async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                        const t = event.nativeEvent.text.toLocaleLowerCase();
                        event.persist();
                        onSubmitEditing(t);
                        Keyboard.dismiss();
                        setInputText(t);
                        setText(t);
                        setInputVisible(!inputVisible);
                    }}
                    onChangeText={(t: string) => {
                        setInputText(t);
                    }}
                    value={inputText}/>
            }
        </View>
    )
}

export default SettingWithEditInput;