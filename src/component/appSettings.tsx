import { Switch } from "@react-native-material/core";
import React, { useContext, useState } from "react";
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { ChannelTitleMode, ConfigContext, ConfigKeys } from "../context/configContext";

type AppSettingsProps = {
    style?: StyleProp<ViewStyle>;
    title: string;
    children: JSX.Element[];
}

const AppSetting = ({ style, title, children }: AppSettingsProps): JSX.Element => {
    return (
        <View style={style}>
            <View style={tw`flex flex-row justify-start items-center`}>
                <Text style={tw`text-lg text-center text-neutral-100 flex-wrap basis-2/6 bg-purple-600 rounded-lg`}>{title}</Text>
                <View style={tw`flex flex-shrink flex-row items-center basis-4/6 justify-center`}>{children}</View>
            </View>
        </View>
    )
}

export const ChannelTitle = (): JSX.Element => {
    const [ checked, setChecked ] = useState<boolean>(true);
    const { setConfig } = useContext(ConfigContext);
 
    return (
        <AppSetting style={tw``} title="Channel Title Placement">
            <Text style={tw`text-lg text-white shrink`}>Inline</Text>
            <Switch value={checked}
                style={tw`shrink`}
                thumbColor="#6200EE"
                onValueChange={() => {
                    setConfig<ChannelTitleMode>(
                        ConfigKeys.DisplayChannelTitle,
                        checked ? ChannelTitleMode.Inline : ChannelTitleMode.NewLine
                    );
                    setChecked(!checked);
                }}
                trackColor={{
                    // false: "gray"
                }}/>
            <Text style={tw`text-lg text-white shrink`}>Break Line</Text>
        </AppSetting>
    )
}

export default AppSetting;