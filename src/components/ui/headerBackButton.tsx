import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

const HeaderBackButton = () => {
    const navigation = useNavigation();

    return (
        <Ionicons color="white" name="arrow-back" size={24} onPress={() => navigation.goBack()} />
    )
}

export default HeaderBackButton;