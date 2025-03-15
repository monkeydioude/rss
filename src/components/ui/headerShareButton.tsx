import Ionicons from '@expo/vector-icons/Ionicons';
import { Share, TouchableOpacity } from "react-native";

type Props = {
    uri: string,
}

const HeaderShareButton = ({ uri }: Props) => {
    return (
        <TouchableOpacity onPress={() => Share.share({ message: `🍪\n${uri}` })}><Ionicons color="white" name="link-sharp" size={24} /></TouchableOpacity>
    )
}

export default HeaderShareButton;