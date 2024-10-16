import { StyleSheet } from "react-native";
import tw from 'twrnc';

const SettingCSS = StyleSheet.create({
    container: {
        ...tw`px-2 flex flex-row items-center text-black justify-center`,
        // minHeight: 50,
    },
    textLabel: {
        ...tw`text-xl m-0 p-0 text-white flex flex-row items-center flex-grow`,
    },
    item: {
        ...tw`p-0 m-0 flex flex-shrink`,
        minWidth: "15%",
    },
    textInput: {
        ...tw`rounded p-1 m-0 mx-2 w-90 absolute bottom-0 bg-gray-100`, minHeight: 0
    }
});

export default SettingCSS;