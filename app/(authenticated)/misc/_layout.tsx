import { Stack, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Image } from "react-native";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import HeaderBackButton from "src/components/ui/headerBackButton";
import HeaderShareButton from 'src/components/ui/headerShareButton';
import { WebViewParams } from "src/services/linking";
import style from "src/style/style";

const App = () => {
    const { uri } = useLocalSearchParams<WebViewParams>();
    
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerTintColor: style.thirdColor,
                headerTitleAlign: "center",
                headerLeft: () => <HeaderBackButton />,
                headerTitle: () => <Image source={require("assets/cookie_transparent.png")} style={{ width: 50, height: 50 }} />,
                headerRight: () => <HeaderShareButton uri={uri} />,
                headerStyle: {
                    backgroundColor: style.primaryColor,
                },
            }} />

    );
};

export default App;