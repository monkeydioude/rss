import React, { useCallback } from "react";
import { Alert } from "react-native";
import appConfig from "src/appConfig";
import Button from "src/components/ui/react-native-material/Button";
import useAuth from "src/services/identity/useAuth";
import style from "src/style/style";

const Logout = (): React.ReactNode => {
    const { signout } = useAuth();

    const askSignout = useCallback(() => {
        Alert.alert(appConfig.labels.en.LOG_OUT_ASK_1, appConfig.labels.en.LOG_OUT_ASK_2, [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            { text: 'OK', onPress: signout },
        ]);
    }, [signout]);

    return (
        <Button
            title={appConfig.labels.en.SETTINGS_LOGOUT_BUTTON}
            color={style.thirdColor}
            onPress={askSignout}
        />
    )
};

export default Logout;
