// import { Button } from "@react-native-material/core";
import { useRouter } from "expo-router";
import React from "react";
import { Button, View } from "react-native";
import tw from 'twrnc';

const LocalDataView = (): JSX.Element => {
    const router = useRouter();

    const onPress = async () => {
        router.navigate("/dev/local_data");
    }

    return (
        <View style={{...tw`flex`, zIndex: -1}}>
            <Button
                title="View Local Data"
                color="orange"
                onPress={onPress} />

        </View>
    )
}

export default LocalDataView;