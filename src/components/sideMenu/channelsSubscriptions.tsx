import React, { useState } from "react";
import { View } from "react-native";
import { Provider } from "../../data_struct";
import { providersChangeSub, providersChangeURL } from "../../services/handleProviders";
import CheckButton from "../checkButton";
import { MenuSectionTitle } from "../menuSectionTitle";
// import { addFeed, reloadFeeds } from "../../feed_builder";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import tw from 'twrnc';
import { log } from "../../services/logchest";
import SettingWithEditInput from "../settings/settingWithInput";
import SettingWithSwitch from "../settings/settingWithSwitch";

const onCheckButtonPress = async (
    url: string,
    isChecked: boolean,
) => {
    try {
        await providersChangeSub(url, isChecked);
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
    setFeeds: (f: RSSItem[]) => void,
    sub: Provider,
    idx: number,
}

const ChannelSub = ({ setFeeds, sub }: ChannelSubProps): JSX.Element => {
    const [checked, setChecked] = useState<boolean>(sub.subscribed);
    const [settingOpen, setSettingOpen] = useState<boolean>(false);

    const changeProvidersURL = async (urlBefore: string, urlNow: string) => {
        if (await providersChangeURL(urlBefore, urlNow)) {
            // reloadFeeds(setFeeds);
        }
    }
    return (
        <View style={{
            ...tw`flex flex-col pb-0.5 border-b border-purple-700`,
            zIndex: -1,
            elevation: -1
        }}>
            <CheckButton
                textStyle={tw`text-lg`}
                title={sub.name}
                checked={checked}
                trailing={<Icon name={`menu-${settingOpen ? "up" : "down"}`}
                    style={tw`text-3xl text-white`} />}
                onLongPress={async () => {
                    try {
                        setChecked(!checked);
                        await onCheckButtonPress(sub.url, !checked, setFeeds);
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
                            await onCheckButtonPress(sub.url, value, setFeeds);
                        }} />
                    <SettingWithEditInput
                        textStyle={tw`text-lg`}
                        inputStyle={tw`py-1`}
                        onSubmitEditing={async (urlNow: string) => changeProvidersURL(sub.url, urlNow)}
                        text={sub.url} />
                </View>
            }
        </View>
    )
}

type ChannelsSubscriptionsProps = {
    subscriptions: Provider[],
}

const ChannelsSubscriptions = ({ subscriptions, setFeeds }: ChannelsSubscriptionsProps): JSX.Element => {
    return (
        <View style={{
            ...tw`justify-center`,
        }}>
            <MenuSectionTitle label='Feeds Subscription' textStyle={tw`text-2xl underline`} iconStyle={tw`text-xl`} />
            {subscriptions.map((sub: Provider, idx: number) => (
                <ChannelSub key={idx} setFeeds={setFeeds} sub={sub} idx={idx} />
            ))}
        </View>
    )
}

export default ChannelsSubscriptions