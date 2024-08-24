import { Stack } from "expo-router";
import React from "react";

type Props = {
    children?: React.ReactNode | React.ReactNode[],
}

const Layout = (props: Props): React.ReactNode => {
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
