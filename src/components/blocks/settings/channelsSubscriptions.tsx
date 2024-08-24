import React, { useState } from "react";
import { View } from "react-native";
import CheckButton from "src/components/ui/checkButton";
import { MenuSectionTitle } from "src/components/ui/menuSectionTitle";
// import { addFeed, reloadFeeds } from "../../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import SettingWithEditInput from "src/components/ui/settings/settingWithInput";
import SettingWithSwitch from "src/components/ui/settings/settingWithSwitch";
import { Channel } from "src/entity/channel";
import { useChannelsList } from "src/global_states/channels";
import { useChannels } from "src/hooks/useChannels";
import { log } from "src/services/request/logchest";
import tw from 'twrnc';

type ChannelSubProps = {
    channel: Channel,
    channel_id: number,
}

const ChannelSub = ({ channel }: ChannelSubProps): JSX.Element => {
    // const [checked, setChecked] = useState<boolean>(sub.subscribed);
    const [checked, setChecked] = useState<boolean>(channel.is_sub);
    const [settingOpen, setSettingOpen] = useState<boolean>(false);
    const { setSub, setUrl } = useChannels();

    const onCheckButtonPress = (
        channel_id: number,
        isChecked: boolean,
    ) => {
        try {
            setSub(channel_id, isChecked);
        } catch (e) {
            // @todo: warning/error msg in app
            log("" + e);
            console.error(e);
        }
    }

    const changeProvidersURL = async (channel_id: number, urlNow: string) => await setUrl(channel_id, urlNow);

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
                onLongPress={() => {
                    try {
                        setChecked(!checked);
                        onCheckButtonPress(channel.channel_id, !checked);
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
                        onValueChange={(value: boolean) => {
                            setChecked(value);
                            onCheckButtonPress(channel.channel_id, value);
                        }} />
                    <SettingWithEditInput
                        textStyle={tw`text-lg`}
                        inputStyle={tw`py-1`}
                        onSubmitEditing={async (urlNow: string) => changeProvidersURL(channel.channel_id, urlNow)}
                        text={channel.channel_name} />
                </View>
            }
        </View>
    )
}

const ChannelsSubscriptions = (): React.ReactNode => {
    const channels = useChannelsList();

    return (
        <View style={{
            ...tw`justify-center`,
        }}>
            <MenuSectionTitle label='Feeds Subscription' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`} />
            {channels.map(([channel_id, channel]) => {
                return (
                    <ChannelSub key={channel_id} channel={channel} channel_id={channel_id} />
                )
            })}
        </View>
    )
}

export default ChannelsSubscriptions