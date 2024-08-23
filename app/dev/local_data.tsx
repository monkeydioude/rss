import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useChannels } from "src/global_states/channels";
import tw from "src/style/twrnc";

type Props = {
    children?: React.ReactNode | React.ReactNode[],
}

const Page = (props: Props): React.ReactNode => {
    const channels = useChannels();

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
        </ScrollView>
    )
};

export default Page;
