import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { router, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import Toast from "react-native-toast-message";
import appConfig from "src/appConfig";
import Stores from "src/global_states";
import { useIsSignedIn } from "src/services/identity/state";
import useAuth from "src/services/identity/useAuth";

const RootNavigator = (): JSX.Element => {
    const { initSignin } = useAuth();
    const isSignedIn = useIsSignedIn();

    useEffect(() => {
        (async () => {
            await initSignin();
        })()
    }, []);
    useEffect(() => {
        if (isSignedIn === true) {
            router.replace("(authenticated)");
            return;
        }
    }, [isSignedIn]);

    return (
        <Slot />
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
                        <Toast visibilityTime={appConfig.toastTimer} />
                    </>
                </Stores>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default App;