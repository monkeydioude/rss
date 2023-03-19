import React, { useRef, createContext } from 'react';

type CB = <T,>(value: T) => void;

type EventsContext = {
    newChannel: (id: string) => void,
    onEvent: (id: string, cb: CB) => void,
    trigger: <T,>(id: string, value?: T) => void,
}

export const EventsContext = createContext<EventsContext>({
    newChannel: () => {},
    onEvent: () => {},
    trigger: () => {},
})

const EventsProvider = ({ children }): JSX.Element => {
    const channels = useRef<Map<string, (CB)[]>>(new Map());

    const newChannel = (id: string) => {
        if (channels.current.get(id)) {
            return;
        }
        channels.current.set(id, []);
    };

    const onEvent = (id: string, cb: CB) => {
        if (!channels.current.get(id)) {
            newChannel(id);
        }
        const c = channels.current.get(id);
        c.push(cb);
        channels.current.set(id, c);
    };

    const trigger = <T,>(id: string, value?: T) => {
        const c = channels.current.get(id);
        if (!c) {
            return;
        }

        c.forEach((cb: CB) => cb(value));
    }

    return (
        <EventsContext.Provider value={{
            newChannel,
            onEvent,
            trigger,
        }}>{children}</EventsContext.Provider>
    )
}

export default EventsProvider;