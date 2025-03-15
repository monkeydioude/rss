import { Stack } from "expo-router";
import React from 'react';
import { Image } from "react-native";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import HeaderBackButton from "src/components/ui/headerBackButton";
import style from "src/style/style";

// Main App Component
const App = () => {
    
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackButtonDisplayMode: "default",
                headerShadowVisible: false,
                headerTitleAlign: "center",
                headerTintColor: style.thirdColor,
                headerLeft: () => <HeaderBackButton />,
                headerTitle: () => <Image source={require("assets/cookie_transparent.png")} style={{ width: 50, height: 50 }} />,
                headerStyle: {
                    backgroundColor: style.primaryColor,
                },
            }} />

    );
};

export default App;