import React from "react";
import { View } from "react-native";
import appConfig from "src/appConfig";
import { FeedSettings } from "src/components/blocks/settings";
import SettingsSectionTitle from "src/components/ui/settings/settingsSectionTitle";
import tw from "src/style/twrnc";

const App = (): React.ReactNode => {
    return (
        <View style={{ ...tw`flex-1 flex-col grow-1 bg-primaryColor` }}>
            <SettingsSectionTitle title={appConfig.labels.en.SETTINGS_FEED_SECTION_TITLE} iconIo="book-outline" />
            <FeedSettings />
        </View>
    )
};

export default App;
