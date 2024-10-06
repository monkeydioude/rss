import IdentityProvider from "src/services/identity/state";
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
            <IdentityProvider>
                <FeedProvider>
                    <ChannelsProvider>
                        <BootProvider>
                            {children}
                        </BootProvider>
                    </ChannelsProvider>
                </FeedProvider>
            </IdentityProvider>
        </ConfigProvider>
    );
}

export default StateStores;