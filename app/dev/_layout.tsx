import { Stack } from "expo-router";
import React from "react";


const Layout = (): React.ReactNode => {
    return (
        <Stack>
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
