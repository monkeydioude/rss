import Clipboard from '@react-native-clipboard/clipboard';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";
import { Channel } from 'src/entity/channel';
import { useChannels } from 'src/hooks/useChannels';
import { APIChannel, get_channels } from "src/services/request/panya";
import toast from "src/services/toast";
import tw from "src/style/twrnc";

const DevChannels = (): React.ReactNode => {
    const [channels, setChannels] = useState<APIChannel[]>([]);
    const { push: pushChannel } = useChannels();

    useEffect(() => {
        (async () => {
            try {
                setChannels(await get_channels());
            } catch (e) {
                toast.err((e as any).toString());
            }
        })();
    }, []);

    const copyClipboardCommaSep = useCallback(() => {
        try {
            Clipboard.setString(channels.map<string>((channel: APIChannel) => channel.url || "").join(","));
            toast.ok("Copied to clipboard");
        } catch (e) {
            toast.err((e as any).toString());
        }
    }, [channels]);

    const subscribeAllChannels = useCallback(async () => {
        for (const apiChannel of channels) {
            try {
                if (!apiChannel.url) {
                    continue;
                }
                const channel: Channel = {
                    channel_name: apiChannel.name,
                    channel_id: apiChannel.id,
                    is_sub: true,
                    source_type: apiChannel.source_type,
                    limit: apiChannel.limit,
                };
                await pushChannel([apiChannel.id, channel]);
            } catch (e) {
                console.error(e);
                toast.err((e as any).toString());
            }
        }
        toast.ok("Subscribed to feed sources")
    }, [channels]);

    return (
        <ScrollView style={tw`flex`}>
            <Button color="purple" title="Back to settings" onPress={() => router.replace("/settings")} />
            <Button title="Copy comma separated" onPress={copyClipboardCommaSep} />
            <Button color={"orange"} title="Subscribe to all those feeds sources" onPress={subscribeAllChannels} />
            <Text>{JSON.stringify(channels, null, 2)}</Text>
        </ScrollView>
    )
};

export default DevChannels;
