import { Stack } from "expo-router";
import React from "react";
import HeaderBackButton from "src/components/ui/headerBackButton";

const Layout = (): React.ReactNode => {

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerLeft: () => <HeaderBackButton />,
        }}>
            <Stack.Screen
                name="dev_channels"
                options={{
                    headerStyle: {
                        backgroundColor: "white",
                    },
                    title: "Local Data",
                }}
            />
            <Stack.Screen
                name="local_data"
                options={{
                    headerStyle: {
                        backgroundColor: "orange",
                    },
                    title: "Local Data",
                }}
            />
        </Stack>
    )
};

export default Layout;
