import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useNavigation } from "expo-router";
import React from "react";


const Layout = (): React.ReactNode => {
    const navigation = useNavigation();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerLeft: () => (
                    <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
                ),
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
