import React from 'react';
import { ScrollView, View } from 'react-native';
import appConfig from 'src/appConfig';
import { AddFeedInput } from 'src/components/blocks/settings';
import Logout from 'src/components/blocks/settings/logout';
import Hr from 'src/components/ui/hr';
import { MenuSectionButton, MenuSettingsButton } from 'src/components/ui/menuSectionButton';
import tw from 'src/style/twrnc';


const Settings = (): JSX.Element => {
    return (
        <View style={{ ...tw`flex-1 flex-col grow-1 bg-primaryColor` }}>
            <AddFeedInput />
            <View style={{ flex: 1, margin: 0, padding: 0 }}>
                <ScrollView
                    style={{ ...tw`flex flex-col m-0 p-0 bg-purple-600 shrink-1` }}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}>
                    <View
                        style={tw`w-full h-full flex flex-col pb-12`}
                    >
                        <MenuSectionButton
                            style={{ marginVertical: 2 }}
                            label={appConfig.labels.en.SETTINGS_FEEDS_SECTION_TITLE}
                            textStyle={tw`text-xl`}
                            iconStyle={tw`text-xl`}
                            link="/settings/feeds"
                        />
                        <MenuSettingsButton
                            style={{ marginVertical: 2 }}
                            label={appConfig.labels.en.SETTINGS_APP_SECTION_TITLE}
                            textStyle={tw`text-xl`}
                            iconStyle={tw`text-xl`}
                            link="/settings/app"
                        />
                        <Hr />
                        <Logout />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default Settings