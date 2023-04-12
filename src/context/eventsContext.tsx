import React, { useRef, createContext } from 'react';

type CB = (value: any) => void;
export type Unsubber = () => void;

type CBContainer = {
    cb: CB;
    symbol: Symbol;
}

interface EventsContext {
    newChannel: (id: string) => void,
    onEvent: (id: string, cb: CB) => [Unsubber, Symbol],
    trigger: <T,>(id: string, value?: T) => void,
    leaveEvent: (id: string, symbol: Symbol) => boolean,
}

export const EventsContext = createContext<EventsContext>({
    newChannel: () => {},
    onEvent: (id: string) => {
        console.error("too early to setup any event", id);
        return null;
    },
    trigger: () => {},
    leaveEvent: () => {return true},
})

const EventsProvider = ({ children }): JSX.Element => {
    const channels = useRef<Map<string, CBContainer[]>>(new Map());

    const newChannel = (id: string) => {
        if (channels.current.get(id)) {
            return;
        }
        channels.current.set(id, []);
    };

    const onEvent = (id: string, cb: CB): [Unsubber, Symbol] => {
        if (!channels.current.get(id)) {
            newChannel(id);
        }
        console.log(`onEvent ${id} ${channels.current.get(id).length +1} listeners`);
        const c = channels.current.get(id);
        const symbol = Symbol();
        c.push({
            cb,
            symbol,
        });
        channels.current.set(id, c);
        return [() => leaveEvent(id, symbol), symbol];
    };

    const trigger = <T,>(id: string, value?: T) => {
        const c = channels.current.get(id);
        if (!c) {
            return;
        }

        console.log("trigger", id, "to", c.length, "listeners");

        c.forEach((cbc: CBContainer) => cbc.cb(value));
    }

    const leaveEvent = (id: string, symbol: Symbol): boolean => {
        const c = channels.current.get(id);
        if (!c) {
            return true;
        }

        for (const idx in c) {
            const cbc = c[idx];
            if (cbc.symbol === symbol) {
                c.splice(parseInt(idx), 1);
                console.log(`left event ${id}, ${c.length} listeners`);
                return true;
            }
        }

        return false;
    }

    return (
        <EventsContext.Provider value={{
            newChannel,
            onEvent,
            trigger,
            leaveEvent,
        }}>{children}</EventsContext.Provider>
    )
}

export default EventsProvider;