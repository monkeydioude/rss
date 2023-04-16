import { Text } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { View, NativeSyntheticEvent, TextInputSubmitEditingEventData, Keyboard, ViewStyle, Pressable, TextInput } from "react-native";
import tw from 'twrnc';
import SettingCSS from "./settings.css";
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
    label: string;
    onSubmitEditing: (value: string) => void
    text: string;
    style?: ViewStyle;
}

const SettingWithEditInput = ({ label, onSubmitEditing, text:_text, style }: Props): JSX.Element => {
    const [text, setText] = useState<string>(_text);
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>(_text);
    const [heightOffset, setHeightOffset] = useState<number>(0);
    // const inputRef = useRef<TextInput>(null);

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
                    ...tw`text-center shrink-1 text-white m-0 p-0 ml-1`,
                    }}>
                    {text.replace(/https?\:\/\//, "")}
                </Text>
                <Ionicons
                    name="pencil"
                    style={{
                    ...tw`text-2xl grow-1 text-white m-0 p-0 pl-5`,
                    color: "rgb(22 163 74)",
                }} />
            </Pressable>
            {inputVisible && 
                <TextInput
                    style={{
                        ...SettingCSS.textInput,
                        ...tw`grow-1 p-1 flex`,
                        position: "absolute",
                        width: "100%",
                        bottom: 0,
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