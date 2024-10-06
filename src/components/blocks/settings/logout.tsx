import { Button } from "@react-native-material/core";
import React from "react";
import appConfig from "src/appConfig";
import useAuth from "src/services/identity/useAuth";
import style from "src/style/style";

const Logout = (): React.ReactNode => {
    const { signout } = useAuth();
    return (
        <Button
            title={appConfig.labels.en.SETTINGS_LOGOUT_BUTTON}
            color={style.thirdColor}
            onPress={signout}
        />
    )
};

export default Logout;
