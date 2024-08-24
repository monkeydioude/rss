import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Channel } from "src/entity/channel";
import { ConfigState } from "src/global_states/config";
import { Mapp } from "src/services/map/mapp";
import { ChannelStorage, ConfigStorage } from "src/storages/custom";
import tw from "src/style/twrnc";

const Page = (): React.ReactNode => {
    const [ channels, setChannels ] = useState<Mapp<number, Channel>>(new Mapp());
    const [ config, setConfig ] = useState<ConfigState | null>(null);

    useEffect(() => {
        (async () => {
            setChannels(await ChannelStorage.retrieveOrNew());
            setConfig(await ConfigStorage.retrieve());
        })();
    }, []);
    return (
        <ScrollView style={tw`h-full bg-orange-100`}
            nestedScrollEnabled={true}
            scrollEnabled={true}
        >
            <Text style={tw`text-lg underline font-bold`}>Channels</Text>
            {channels.map(([k, v]) => {
                return (
                    <View key={k} style={tw`flex-col`}>
                        <View style={tw`flex flex-row mb-2`}>
                            <Text style={tw`font-bold p-1`}>id: {k}</Text>
                            <Text style={tw`p-1`}>channel: {typeof v === "object" ? `${JSON.stringify(v, null, 2)}` : " "+v}</Text>
                        </View>
                    </View>
                )
            })}
            <Text style={tw`text-lg underline font-bold`}>Config</Text>
            <Text>{JSON.stringify(config)}</Text>
        </ScrollView>
    )
};

export default Page;
