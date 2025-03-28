import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from 'react';
import { Image } from "react-native";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import appConfig from "src/appConfig";
import CooldownDisc, { CooldownDiscRef } from "src/components/loading/CooldownDisc";
import Stores from "src/global_states";
import { useRefresh } from "src/global_states/refresh";
import style from "src/style/style";

const RootNavigator = (): JSX.Element => {
    const { lastRefresh, method } = useRefresh();
    const discRef = useRef<CooldownDiscRef>(null);

    useEffect(() => {
        if (method === "manual") {
            discRef.current?.reset();
        }
    }, [lastRefresh, method]);
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
                    headerRight: () => <>{method === "manual" && <CooldownDisc ref={discRef} duration={(+new Date() - lastRefresh + appConfig.feedsManualRefreshTimer) / 1000} />}</>,
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