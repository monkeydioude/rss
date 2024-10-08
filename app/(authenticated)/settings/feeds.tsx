import { Button, Text } from '@react-native-material/core';
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import appConfig from 'src/appConfig';
import { ChannelsSubscriptions } from 'src/components/blocks/settings';
import SettingModal, { SettingModalHandle } from 'src/components/modals/SettingModal';
import { SettingWithEditInput, SettingWithSwitch } from 'src/components/ui/settings';
import SettingsSectionTitle from "src/components/ui/settings/settingsSectionTitle";
import { Channel } from 'src/entity/channel';
import { useChannels } from 'src/hooks/useChannels';
import useComponentsDataBridge from 'src/hooks/useComponentsDataBridge';
import style from 'src/style/style';
import tw from 'src/style/twrnc';

interface ProxyProps {
    onChannelChange: (cb: () => (channel: Channel) => void) => void,
    bsRef: RefObject<SettingModalHandle>,
}

// SettingModalProxy sole purpose is to hold the useState hook,
// away from the main Settings component, so the 
// whole app won't reload in case the channel changes.
const SettingModalProxy = ({ bsRef, onChannelChange }: ProxyProps) => {
    const snapPoints = useMemo(() => ["50%"], []);
    const [channel, setChannel] = useState<Channel | null>(null);
    const { setSub, setUrl } = useChannels();
    const [isSubbed, setIsSubbed] = useState(channel?.is_sub || false);

    useEffect(() => {
        onChannelChange(() => (channel: Channel) => {
            setIsSubbed(channel.is_sub);
            setChannel(channel);
        });
    }, []);

    const onURLSubmit = useCallback(async (urlNow: string): Promise<string> => {
        if (!channel) {
            return urlNow;
        }
        const err = await setUrl(channel?.channel_id, urlNow);
        if (err) {
            Toast.show({
                type: "error",
                text1: "Could not change the source URL",
                text2: appConfig.channelsErrorEnum[err],
                text1Style: tw`text-sm`,
                text2Style: tw`text-sm`
            });
            return urlNow;
        }
        return channel.channel_name;
    }, [channel]);

    return (<SettingModal
        ref={bsRef}
        snapPoints={snapPoints}
        title={channel?.channel_name || "\0"}
        titleStyle={tw`font-bold text-primaryColor`}
        backgroundStyle={{
            backgroundColor: "white"
        }}
    >
        <View style={tw`m-5 flex flex-col justify-end`}>
            <View style={tw`flex flex-col grow-1 shrink-0 flex-basis-65`}>
                <Text style={tw`font-bold text-xl`}>Subscription Status</Text>
                <SettingWithSwitch
                    textStyle={tw`font-bold ${channel?.is_sub ? "text-green-600" : "text-red-600"}`}
                    label={channel?.is_sub ? "Subscribed" : "Unsubscribed"}
                    checked={isSubbed}
                    onValueChange={(value: boolean) => {
                        if (!channel) {
                            return;
                        }
                        setSub(channel?.channel_id, value);
                        setIsSubbed(value);
                    }} />
                <Text style={tw`font-bold text-xl`}>Edit Source URL</Text>
                <SettingWithEditInput
                    textStyle={tw`text-lg text-black font-bold`}
                    inputStyle={tw`py-1`}
                    onSubmitEditing={onURLSubmit}
                    autoCapitalize="none"
                    text={channel?.channel_name || ""} />
            </View>
            <Button
                title={"Close"}
                style={{
                    ...tw`grow-0 shrink-1`,
                    backgroundColor: style.primaryColorDark
                }}
                onPress={bsRef.current?.close}
            />
        </View>
    </SettingModal>);
}

const FeedsSettings = (): React.ReactNode => {
    const bsRef = useRef<SettingModalHandle>(null);
    // modalChannelSetter is meant to receive the setChannel function from
    // the SettingModalProxy component.
    // The SettingModalProxy component is the component receiving the data.
    // The setChannel function is triggered when onChannelChange is called
    // by the component initiating the data transfer.
    const [onChannelChange, modalChannelSetter] = useComponentsDataBridge<Channel>();

    return (
        <View style={{ ...tw`flex-1 flex-col grow-1 bg-primaryColor` }}>
            <SettingsSectionTitle title={appConfig.labels.en.SETTINGS_FEEDS_SECTION_TITLE} iconName="view-list" />
            <ChannelsSubscriptions
                modalRef={bsRef}
                channelUpdater={modalChannelSetter}
            />
            <SettingModalProxy onChannelChange={onChannelChange} bsRef={bsRef} />
        </View>
    )
};

export default FeedsSettings;
