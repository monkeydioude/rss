import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import appConfig, { isDev } from 'src/appConfig';
import { DevMenu } from 'src/components/blocks/dev';
import { AddFeedInput } from 'src/components/blocks/settings';
import Logout from 'src/components/blocks/settings/logout';
import Hr from 'src/components/ui/hr';
import MenuButton from 'src/components/ui/menuSectionButton';
import SettingsSectionTitle from 'src/components/ui/settings/settingsSectionTitle';
import { useSubbedChannelIDs } from 'src/global_states/channels';
import i18n from 'src/i18n';
import tw from 'src/style/twrnc';

const Settings = (): JSX.Element => {
    const channels = useSubbedChannelIDs();

    return (
        <View style={{ ...tw`flex-1 flex-col grow-1 bg-primaryColor` }}>
            <AddFeedInput />
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
                        <Hr />
                        <Logout />
                        <Hr />
                        {isDev() && <DevMenu />}
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