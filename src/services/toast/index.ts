import Toast from "react-native-toast-message";
import tw from "src/style/twrnc";

export default {
    ok: (text1: string, text2?: string) => Toast.show({
        type: "success",
        text1,
        text2,
        text1Style: tw`text-sm`,
        text2Style: tw`text-sm`,
    }),
    err: (text1: string, text2?: string) => Toast.show({
        type: "error",
        text1,
        text2,
        text1Style: tw`text-sm`,
        text2Style: tw`text-sm`,
    }),
};