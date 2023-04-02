import { Switch } from "@react-native-material/core";
import React, { useContext, useEffect, useState } from "react";
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { ChannelTitleMode, Config, ConfigContext } from "../context/configContext";

type AppSettingsProps = {
    style?: StyleProp<ViewStyle>;
    title: string;
    children: JSX.Element;
}

const AppSetting = ({ style, title, children }: AppSettingsProps): JSX.Element => {
    return (
        <View style={style}>
            <View style={tw`flex flex-col justify-start items-center bg-purple-600`}>
                <Text style={tw`text-center text-neutral-100 flex-wrap rounded-lg w-100 pt-1 uppercase`}>{title}</Text>
                <View style={tw`flex flex-shrink flex-row items-center justify-center m-0 p-0`}>{children}</View>
            </View>
        </View>
    )
}

export const ChannelTitle = (): JSX.Element => {
    const { setConfig, onConfigChange } = useContext(ConfigContext);
    const [ checked, setChecked ] = useState<boolean>(true);

    useEffect(() => {
        const [ unsub ] = onConfigChange((config: Config) => {
            setChecked(config.displayChannelTitle === ChannelTitleMode.NewLine);
        })
        return unsub;
    }, []);

    return (
        <AppSetting title="Channel title placement in feed item">
            <View style={tw`font-medium flex flex-row items-center`}>
                <Text style={tw`text-white shrink mr-2 uppercase`}>Inline</Text>
                <Switch value={checked}
                    style={tw`shrink`}
                    thumbColor="#6200EE"
                    onValueChange={() => {
                        setConfig<ChannelTitleMode>(
                            "displayChannelTitle",
                            // Opposite, cause defining next state, aftet hitting the switch
                            checked ? ChannelTitleMode.Inline : ChannelTitleMode.NewLine
                        );
                        setChecked(!checked);
                    }}
                    trackColor={{
                        // false: "gray"
                    }}/>
                <Text style={tw`text-white shrink  ml-1 uppercase`}>Break Line</Text>
            </View>
        </AppSetting>
    )
}

export default AppSetting;