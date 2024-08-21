import React from "react";
import { View } from "react-native";
import config from "src/appConfig";
import AddStaticFeedButton from "src/components/addStaticFeedButton";
import { MenuFeedsSectionTitle } from "src/components/ui/menuSectionTitle";
import { SetFeedsCB } from "src/context/feedsContext";

type Props = {
    setFeeds: SetFeedsCB,
}

const RecommendedFeeds = ({ setFeeds }: Props): JSX.Element => {
    return (
        <View>
        <MenuFeedsSectionTitle label='Recommended Feeds' />
        {config.recommendedFeeds.map((rf, idx) => (
            <AddStaticFeedButton
                key={idx}
                {...rf}
                setFeeds={setFeeds} />
        ))}
    </View>
    )
}

export default RecommendedFeeds;