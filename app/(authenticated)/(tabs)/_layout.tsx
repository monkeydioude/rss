import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator } from '@react-native-material/core';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Redirect, withLayoutContext } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setIsBooted, useDispatch } from 'src/global_states/boot';
import useBoot from 'src/hooks/useBoot';
import { useIsLoading, useIsSignedIn } from 'src/services/identity/state';
import { getBackgroundColor } from 'src/services/tailwind';
import style from 'src/style/style';
import tw from 'src/style/twrnc';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const TabsLayout = () => {
    const bootDone = useBoot();
    const dispatch = useDispatch();
    const isSignedIn = useIsSignedIn();
    const isLoading = useIsLoading();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        dispatch(setIsBooted(bootDone));
    }, [bootDone]);

    if (!bootDone) {
        return (<View style={styles.container}>
            <StatusBar style="dark" />
            <ActivityIndicator size="small" style={{ margin: 28 }} />
        </View>)
    }

    if (!isLoading && !isSignedIn) {
        return <Redirect href="/login" />;
    }
    return (
        <MaterialTopTabs
            key="topTabs"
            tabBarPosition='bottom'
            screenOptions={{
                tabBarInactiveTintColor: getBackgroundColor("bg-gray-100"),
                tabBarActiveTintColor: style.thirdColor,
                tabBarIndicatorStyle: {
                    backgroundColor: style.thirdColor,
                    height: 1,
                },
                tabBarStyle: {
                    backgroundColor: style.primaryColor,
                    paddingBottom: insets.bottom,
                    margin: 0,
                },
                tabBarItemStyle: {
                    padding: 0,
                },
                tabBarLabelStyle: {
                    // margin: 0,
                    padding: 0,
                    textTransform: "capitalize",
                    fontSize: 15,
                },
            }}
        >
            <MaterialTopTabs.Screen
                key="index"
                name="index"
                options={{
                    title: "Feed",
                    tabBarIcon: ({ color }) => <FontAwesome size={25} width={30} name="newspaper-o" color={color} />,
                }}
            />
            <MaterialTopTabs.Screen
                name="settings"
                key="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <FontAwesome size={25} name="sliders" color={color} />,
                }}
            />
        </MaterialTopTabs>
    )
};
const styles = StyleSheet.create({
    container: {
        ...tw`flex flex-1 justify-center px-4`,
        backgroundColor: style.thirdColor
    },
    input: tw`my-1 h-10 border rounded p-2 bg-white`,
    button: {
        ...tw`my-1`,
        backgroundColor: style.primaryColor
    }
})

export default TabsLayout;