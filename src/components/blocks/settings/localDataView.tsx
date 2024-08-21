// import { Button } from "@react-native-material/core";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { ChannelStorage } from "src/storage/custom";
import { Mapp } from "src/storage/map_storage";
import tw from 'twrnc';

const LocalDataView = (): JSX.Element => {
    const [localData, setLocalData] = useState<Mapp<number, string>>(new Mapp());

    const onPress = async () => {
        const data = await ChannelStorage.retrieve();
        if (!data)
            return;
        setLocalData(data);
    }

    return (
        <View style={{zIndex: -1}}>
            <Button
                title="View Local Data"
                color="orange"
                onPress={onPress} />
                {localData.size > 0 && 
                <View style={tw``}>
                    {localData.map(([k, v]) => {
                        return (
                            <View key={k} style={tw`flex-col`}>
                                <View><Text style={tw`text-lg underline font-bold`}>Channels</Text></View>
                                <View style={tw`flex flex-row mb-2`}>
                                    <Text style={tw`font-bold p-1`}>id: {k}</Text>
                                    <Text style={tw`p-1`}>channel: {typeof v === "object" ? `${JSON.stringify(v, null, 2)}` : " "+v}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
                }
        </View>
    )
}

export default LocalDataView;