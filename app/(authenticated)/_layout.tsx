import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { Image } from "react-native";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import Stores from "src/global_states";
import style from "src/style/style";

const RootNavigator = (): JSX.Element => {

    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: style.primaryColor,
                },
                headerShown: false,
            }}>
            <Stack.Screen
                key="(tabs)"
                name="(tabs)"
                options={{
                    headerShown: true,
                    headerTitle: () => <Image source={require("assets/cookie_transparent.png")} style={{ width: 50, height: 50 }} />,
                }} />
        </Stack>
    )
};

// Main App Component
const App = () => {
    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <Stores>
                    <>
                        <StatusBar style="light" />
                        <RootNavigator />
                        <Toast />
                    </>
                </Stores>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default App;