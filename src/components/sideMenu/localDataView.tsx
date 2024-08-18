// import { Button } from "@react-native-material/core";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import tw from 'twrnc';
import { getAllData } from "../../services/data_storage";

const LocalDataView = (): JSX.Element => {
    const [localData, setLocalData] = useState<Map<string, any>>(new Map());

    const onPress = async () => {
        if (localData.size > 0) {
            setLocalData(new Map());
            return;
        }
        const data = await getAllData();
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
                    {Object.entries(Object.fromEntries(localData)).map(([k, v]) => {
                        return (
                            <View key={k}>
                                <View><Text style={tw`text-lg underline font-bold`}>{k}</Text></View>
                                {Object.entries(JSON.parse(v)).map(([kk, vv]) => {
                                    return <View key={kk} style={tw`flex flex-${typeof vv === "object" ? "col" : "row"} mb-2`}>
                                        <Text style={tw`font-bold`}>{kk}</Text>
                                        <Text>{typeof vv === "object" ? `${JSON.stringify(vv, null, 2)}` : " "+vv}</Text>
                                    </View>
                                })}
                            </View>
                        )
                    })}
                </View>
                }
        </View>
    )
}

export default LocalDataView;