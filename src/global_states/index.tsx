import IdentityProvider from "src/services/identity/state";
import BootProvider from "./boot";
import ChannelsProvider from "./channels";
import ConfigProvider from "./config";
import FeedProvider from "./feed";
import RefreshProvider from "./refresh";
import UserProvider from "./user";

type Props = {
    children: JSX.Element,
}

const StateStores = ({ children }: Props): JSX.Element => {
    return (
        <ConfigProvider>
            <RefreshProvider>
                <IdentityProvider>
                    <FeedProvider>
                        <ChannelsProvider>
                            <UserProvider>
                                <BootProvider>
                                    {children}
                                </BootProvider>
                            </UserProvider>
                        </ChannelsProvider>
                    </FeedProvider>
                </IdentityProvider>
            </RefreshProvider>
        </ConfigProvider>
    );
}

export default StateStores;