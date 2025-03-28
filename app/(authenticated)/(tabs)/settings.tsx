import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import appConfig from 'src/appConfig';
import { DevMenu } from 'src/components/blocks/dev';
import { AddFeedInput } from 'src/components/blocks/settings';
import Logout from 'src/components/blocks/settings/logout';
import Hr from 'src/components/ui/hr';
import MenuButton from 'src/components/ui/menuSectionButton';
import SettingsSectionTitle from 'src/components/ui/settings/settingsSectionTitle';
import { useSubbedChannelIDs } from 'src/global_states/channels';
import { useKeyboard } from 'src/hooks/useKeyboard';
import i18n from 'src/i18n';
import { log } from 'src/services/request/logchest';
import { get_channels } from 'src/services/request/panya';
import style from 'src/style/style';
import tw from 'src/style/twrnc';

type ChannelTuple = {
    url: string,
    name: string,
}

const Settings = (): JSX.Element => {
    const channels = useSubbedChannelIDs();
    const { width, height } = useWindowDimensions();
    const { height: keyboardHeight} = useKeyboard();
    const suggestion = useMemo(() => ({ maxHeight: height - keyboardHeight - appConfig.suggestionHeaderSize }), [height, keyboardHeight]);
    const [text, setText] = useState<string>("");
    const [showList, setShowList] = useState(text.length > 3);
    const [data, setData] = useState<ChannelTuple[]>([]);
    const seed = useRef<NodeJS.Timeout | null>(null);
    const sendChannelAdd = useRef<(text: string) => void>(() => {})

    useEffect(() => {
        setShowList(text.length >= appConfig.suggestionMinChars);
        if (text.length >= appConfig.suggestionMinChars) {
            if (seed.current != null) {
                clearTimeout(seed.current);
                seed.current = null;
            }
            seed.current = setTimeout(() => {
                get_channels(text).then((res) => {
                    console.log(res.length)
                    // setData(res.map((el) => ({ name: el.name, url: el.url })));
                    setData(res);
                }).catch((err) => {
                    log(err);
                })
            }, appConfig.suggestionWaitingTime);
        } else {
            setData([]);
        }
    }, [text]);

    useEffect(() => {
        if (text.length >= appConfig.suggestionMinChars) {
            if (seed.current != null) {
                clearTimeout(seed.current);
                seed.current = null;
            }
            seed.current = setTimeout(() => {
                get_channels(text).then((res) => {
                    console.log(res.length)
                    setData(res.map((el) => ({ name: el.name, url: el.url })));
                }).catch((err) => {
                    log(err);
                })
            }, appConfig.suggestionWaitingTime);
        } else {
            setData([]);
        }
    }, [text]);

    const onChannelClick = useCallback((url: string) => {
        sendChannelAdd.current(url);
        Keyboard.dismiss();
    }, [sendChannelAdd.current]);

    return (
        <View style={{
            ...tw`flex-1 flex-col grow-1 bg-primaryColor`
        }}>
            <AddFeedInput onTextChange={setText} doSendChannelAdd={(cb) => sendChannelAdd.current = cb} />
            {showList && 
                <View style={{
                    zIndex: 1000,
                    top: 55,
                    width: "auto",
                    backgroundColor: style.thirdColor,
                    ...tw`flex absolute`,
                }}>
                    <Animated.FlatList
                        style={{
                            maxHeight: suggestion.maxHeight,
                            width,
                        }}
                        data={data}
                        keyExtractor={(item) => item.name}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    borderColor: style.primaryColor,
                                    ...tw`p-2 border-b`,
                                }}
                                onPress={() => onChannelClick(item.url)}
                            >
                                <Text style={{
                                    width,
                                    ...tw`text-lg`,
                                }} > {item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            }
            <SettingsSectionTitle title={i18n.en.SETTINGS_SCREEN_TITLE} iconFA='sliders' />
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                <ScrollView
                    style={{ ...tw`flex flex-col m-0 p-0 bg-purple-600 shrink-1` }}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}>
                    <View
                        style={tw`w-full h-full flex flex-col pb-12`}
                    >
                        <MenuButton
                            style={{ marginVertical: 2 }}
                            label={`${i18n.en.SETTINGS_SOURCES_SECTION_TITLE} (${channels.length})`}
                            textStyle={tw`text-xl`}
                            iconStyle={tw`text-xl`}
                            link="/settings/sources"
                            icon='list'
                        />
                        <MenuButton
                            style={{ marginVertical: 2 }}
                            label={i18n.en.SETTINGS_FEED_SECTION_TITLE}
                            textStyle={tw`text-xl`}
                            iconStyle={tw`text-xl`}
                            link="/settings/feed"
                            icon='book-outline'
                        />
                        <MenuButton
                            style={{ marginVertical: 2 }}
                            label={i18n.en.SETTINGS_USER_SECTION_TITLE}
                            textStyle={tw`text-xl`}
                            iconStyle={tw`text-xl`}
                            link="/settings/user"
                            icon='people'
                        />
                        <Hr />
                        <Logout />
                        <Hr />
                        <DevMenu />
                        <View style={tw`flex flex-row justify-end pr-2 w-93`}>
                            <Text style={tw`text-white`}>{appConfig.appVersion}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default Settings