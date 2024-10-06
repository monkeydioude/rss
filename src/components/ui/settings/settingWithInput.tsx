import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { Keyboard, NativeSyntheticEvent, Pressable, TextInput, TextInputSubmitEditingEventData, View, ViewStyle } from "react-native";
import customeStyle from "src/style/style";
import tw from 'twrnc';
import SettingCSS from "./settings.css";

type Props = {
    label?: string;
    preventUnderline?: boolean
    onSubmitEditing: (value: string) => Promise<string>
    text: string;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    inputStyle?: ViewStyle;
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
}

const SettingWithEditInput = ({ onSubmitEditing, text: _text, style, textStyle, inputStyle, label, preventUnderline, autoCapitalize }: Props): JSX.Element => {
    const [text, setText] = useState<string>(_text);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(_text);

    useEffect(() => {
        const kbh = Keyboard.addListener("keyboardDidHide", e => {
            setInputVisible(false);
        });

        return () => {
            kbh.remove();
        }
    }, []);

    useEffect(() => {
        setText(_text);
    }, [_text])

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
                    {label || ""}{text?.replace(/https?\:\/\//, "")}
                </Text>
                <Ionicons
                    name="pencil"
                    style={{
                        ...tw`text-3xl grow-1 text-white m-0 p-0`,
                        color: customeStyle.primaryColor,
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
                    autoCapitalize={autoCapitalize}
                    onSubmitEditing={async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                        let t = event.nativeEvent.text.toLocaleLowerCase();
                        event.persist();
                        t = await onSubmitEditing(t) || t;
                        Keyboard.dismiss();
                        setInputText(t);
                        setText(t);
                        setInputVisible(!inputVisible);
                    }}
                    onChangeText={(t: string) => {
                        setInputText(t);
                    }}
                    value={inputText} />
            }
        </View>
    )
}

export default SettingWithEditInput;