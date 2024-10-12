import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { DoomsDayButtons } from "src/components/blocks/dev";
import { Channel } from "src/entity/channel";
import { Item } from "src/entity/item";
import { ConfigState } from "src/global_states/config";
import { IdentityToken } from "src/services/identity/types";
import { Mapp } from "src/services/map/mapp";
import { ChannelStorage, ConfigStorage, FeedStorage } from "src/storages/custom";
import { TokenStorage } from "src/storages/custom/token_storage";
import tw from "src/style/twrnc";

const Page = (): React.ReactNode => {
    const [channels, setChannels] = useState<Mapp<number, Channel>>(new Mapp());
    const [config, setConfig] = useState<ConfigState | null>(null);
    const [feed, setFeed] = useState<Item[] | null>(null);
    const [token, setToken] = useState<IdentityToken | null>(null);

    useEffect(() => {
        (async () => {
            const all = await Promise.all([
                ChannelStorage.retrieveOrNew(),
                ConfigStorage.retrieve(),
                TokenStorage.retrieve(),
                FeedStorage.retrieve(),
            ])
            setChannels(all[0]);
            setConfig(all[1]);
            setToken(all[2]);
            setFeed(all[3]);
        })();
    }, []);
    let _token = token || { jwt: "", expires: 0 };

    return (
        <View>
            <Button color="purple" title="Back to settings" onPress={() => router.replace("/settings")} />
            <DoomsDayButtons />
            <ScrollView style={tw`h-full bg-orange-100 gap-1`}
                nestedScrollEnabled={true}
                scrollEnabled={true}
            >

                <Text style={tw`text-lg underline font-bold`}>Channels</Text>
                {channels.map(([k, v]) => {
                    return (
                        <View key={k} style={tw`flex-col`}>
                            <View style={tw`flex flex-row mb-2`}>
                                <Text style={tw`font-bold p-1`}>id: {k}</Text>
                                <Text style={tw`p-1`}>channel: {typeof v === "object" ? `${JSON.stringify(v, null, 2)}` : " " + v}</Text>
                            </View>
                        </View>
                    )
                })}
                <Text style={tw`text-lg underline font-bold`}>Config</Text>
                <Text>{JSON.stringify(config)}</Text>
                <Text style={tw`text-lg underline font-bold`}>Token</Text>
                <Text>{JSON.stringify({ ..._token, expiresHuman: new Date(_token.expires) }, null, 2)}</Text>
                <Text style={tw`text-lg underline font-bold`}>Feed</Text>
                <Text>{JSON.stringify(feed, null, 2)}</Text>
            </ScrollView>
        </View>
    )
};

export default Page;
