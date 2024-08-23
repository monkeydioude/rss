import React from "react";
import { View } from "react-native";
import config from "src/appConfig";
import AddStaticFeedButton from "src/components/addStaticFeedButton";
import { MenuFeedsSectionTitle } from "src/components/ui/menuSectionTitle";

const RecommendedFeeds = (): JSX.Element => {
    return (
        <View>
        <MenuFeedsSectionTitle label='Recommended Feeds' />
        {config.recommendedFeeds.map((rf, idx) => (
            <AddStaticFeedButton
                key={idx}
                {...rf}
            />
        ))}
    </View>
    )
}

export default RecommendedFeeds;