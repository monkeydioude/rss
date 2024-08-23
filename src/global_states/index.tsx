import BootProvider from "./boot";
import ChannelsProvider from "./channels";
import ConfigProvider from "./config";
import FeedProvider from "./feed";

type Props = {
    children: JSX.Element,
}

const StateStores = ({ children }: Props): JSX.Element => {
    return (
        <ConfigProvider>
            <FeedProvider>
                <ChannelsProvider>
                    <BootProvider>
                        {children}
                    </BootProvider>
                </ChannelsProvider>
            </FeedProvider>
        </ConfigProvider>
    );
}

export default StateStores;