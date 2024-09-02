import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from 'react';
import { getBackgroundColor } from 'src/services/tailwind';
import style from 'src/style/style';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
  >(Navigator);

const TabsLayout = () => {
  return (
    <MaterialTopTabs
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
        },
        tabBarItemStyle: {
          padding: 0,
        },
        tabBarLabelStyle: {
          margin: 0,
          padding: 0,
          textTransform: "capitalize",
          fontSize: 15
        },
      }}
      >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <FontAwesome size={25} width={30} name="newspaper-o" color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={25} name="sliders" color={color} />,
        }}
      />
    </MaterialTopTabs>
  )
};

export default TabsLayout;