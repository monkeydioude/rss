// import { Button } from "@react-native-material/core";
import { useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";

const LocalDataView = (): JSX.Element => {
    const router = useRouter();

    const onPress = async () => {
        router.navigate("/dev/local_data");
    }

    return (
        <Button
            title="View Local Data"
            color="green"
            onPress={onPress} />

    )
}

export default LocalDataView;