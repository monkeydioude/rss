import ConfigProvider from "./configContext"
import EventsProvider from "./eventsContext"

type Props = {
    children: JSX.Element,
}

export default function ({ children }: Props): JSX.Element {
    return (
        <EventsProvider>
            <ConfigProvider>
                {children}
            </ConfigProvider>
        </EventsProvider>
    )
}