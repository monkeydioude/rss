import React from "react";
import { SetFeedsCB } from "../../context/feedsContext";
import { View } from "react-native";
import { MenuFeedsSectionTitle } from "../menuSectionTitle";
import AddStaticFeedButton from "../addStaticFeedButton";
import config from "../../appConfig";

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