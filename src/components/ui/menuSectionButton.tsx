import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "@react-native-material/core";
import { router } from "expo-router";
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';

type Props = {
    label: string;
    link?: string;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    iconStyle?: ViewStyle;
}

const MenuButton = <TProps extends Props & { name: string },>({ label, name, style, textStyle, iconStyle, link }: TProps): JSX.Element => (
    <Button
        onPress={() => {
            if (link) {
                router.push(link);
            }
        }}
        style={{
            ...style,
            paddingVertical: 4
        }}
        title={() => (<View style={tw`items-center flex flex-row justify-center`}>
            <Icon color="white" name={name as any} style={iconStyle} />
            <Text style={{
                ...tw`ml-2 items-center text-white grow-1`,
                ...textStyle
            }}>{label}</Text>
            <Icon name={`chevron-right`} style={tw`text-3xl text-white`} />
        </View>)}
    />
)

export const MenuSectionButton = (props: Props): JSX.Element => MenuButton({ ...props, name: "view-list" });
export const MenuFeedsSectionTitle = (props: Props): JSX.Element => MenuButton({ ...props, name: "newspaper" });
export const MenuSettingsButton = (props: Props): JSX.Element => MenuButton({ ...props, name: "chess-rook" });

export default MenuButton;