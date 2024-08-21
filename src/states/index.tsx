import BootProvider from "./boot"
import ChannelsProvider from "./channels"
import FeedProvider from "./feed"

type Props = {
    children: JSX.Element,
}

const Stores = ({ children }: Props): JSX.Element => {
    return (
        <FeedProvider>
          <ChannelsProvider>
            <BootProvider>
                {children}
            </BootProvider>
            </ChannelsProvider>
        </FeedProvider>
    );
}

export default Stores;