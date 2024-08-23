import React, { useState } from "react";
import { View } from "react-native";
import CheckButton from "src/components/ui/checkButton";
import { MenuSectionTitle } from "src/components/ui/menuSectionTitle";
// import { addFeed, reloadFeeds } from "../../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import SettingWithEditInput from "src/components/ui/settings/settingWithInput";
import SettingWithSwitch from "src/components/ui/settings/settingWithSwitch";
import { Channel } from "src/entity/channel";
import { useChannels } from "src/global_states/channels";
import { log } from "src/services/request/logchest";
import tw from 'twrnc';

const onCheckButtonPress = async (
    url: string,
    isChecked: boolean,
) => {
    try {
        if (isChecked === true) {
            // await addFeed(url, setFeeds);
        }
        // await reloadFeeds(setFeeds)
    } catch (e) {
        // @todo: warning/error msg in app
        log("" + e);
        console.error(e);
    }
}

type ChannelSubProps = {
    channel: Channel,
    channel_id: number,
}

const ChannelSub = ({ channel }: ChannelSubProps): JSX.Element => {
    // const [checked, setChecked] = useState<boolean>(sub.subscribed);
    const [checked, setChecked] = useState<boolean>(channel.is_sub);
    const [settingOpen, setSettingOpen] = useState<boolean>(false);
    const changeProvidersURL = async (urlBefore: string, urlNow: string) => {
    }
    return (
        <View style={{
            ...tw`flex flex-col pb-0.5 border-b border-purple-700`,
            zIndex: -1,
            elevation: -1
        }}>
            <CheckButton
                textStyle={tw`text-lg`}
                title={channel.channel_name}
                checked={checked}
                trailing={<Icon name={`menu-${settingOpen ? "up" : "down"}`}
                    style={tw`text-3xl text-white`} />}
                onLongPress={async () => {
                    try {
                        setChecked(!checked);
                        // await onCheckButtonPress(sub.url, !checked, setFeeds);
                    } catch (err) {
                        log("" + err);
                        console.error(err);
                    }
                }}
                onPress={() => {
                    setSettingOpen(!settingOpen);
                }}
            />
            {settingOpen &&
                <View>
                    <SettingWithSwitch
                        label="Sub"
                        checked={checked}
                        onValueChange={async (value: boolean) => {
                            setChecked(value);
                            // await onCheckButtonPress(sub.url, value, setFeeds);
                        }} />
                    <SettingWithEditInput
                        textStyle={tw`text-lg`}
                        inputStyle={tw`py-1`}
                        onSubmitEditing={async (urlNow: string) => changeProvidersURL(channel.channel_name, urlNow)}
                        text={channel.channel_name} />
                </View>
            }
        </View>
    )
}

const ChannelsSubscriptions = (): React.ReactNode => {
    const channels = useChannels();

    return (
        <View style={{
            ...tw`justify-center`,
        }}>
            <MenuSectionTitle label='Feeds Subscription' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`} />
            {channels.map(([channel_id, channel]) => {
                console.log(channel_id, channel)
                return (
                    <ChannelSub key={channel_id} channel={channel} channel_id={channel_id} />
                )
            })}
        </View>
    )
}

export default ChannelsSubscriptions