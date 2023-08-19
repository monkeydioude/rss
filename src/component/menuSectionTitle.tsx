import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

type Props = {
    label: string;
    style?: ViewStyle;
    textStyle?: ViewStyle;
    iconStyle?: ViewStyle;
}

const MenuTitle = <TProps extends Props & { name: string },>({ label, name, style, textStyle, iconStyle }: TProps): JSX.Element => (
    <View style={{
        ...tw`items-center flex flex-row justify-center border-b border-purple-700`,
        ...style
    }}>
        <Icon color="white" name={name as any} style={iconStyle} />
        <Text style={{
            ...tw`p-2 items-center text-white text-lg font-semibold`,
            ...textStyle
        }}>{label}</Text>
    </View>
)

export const MenuSectionTitle = (props: Props): JSX.Element => MenuTitle({ ...props, name: "view-list" });
export const MenuFeedsSectionTitle = (props: Props): JSX.Element => MenuTitle({ ...props, name: "newspaper" });
export const MenuSettingsTitle = (props: Props): JSX.Element => MenuTitle({ ...props, name: "chess-rook" });

export default MenuTitle;