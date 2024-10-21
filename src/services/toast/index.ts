import Toast from "react-native-toast-message";
import { Error } from "src/errors/errors";
import tw from "src/style/twrnc";

const toast_it = (type: "success" | "error", text1: string, text2?: string) => Toast.show({
    type,
    text1,
    text2,
    text1Style: tw`text-sm`,
    text2Style: tw`text-sm`,
})

const ok = (text1: string, text2?: string) => toast_it("success", text1, text2);
const err = (text1: string, text2?: string) => toast_it("error", text1, text2);
export default {
    ok,
    err,
    ok_or_err: (error: Error | null, success_texts: [string, string?], error_text_1: string) => (
        error ? err(error_text_1, error.getReason()) : ok(...success_texts)
    )
};