import { StyleSheet } from "react-native";
import tw from 'twrnc';

const SettingCSS = StyleSheet.create({
    container: {
        ...tw`px-2 flex flex-row items-center`,
    },
    textInput: {
        ...tw`rounded p-1 m-0 mx-2 w-90 absolute bottom-0 bg-gray-100`, minHeight: 0
    }
});

export default SettingCSS;