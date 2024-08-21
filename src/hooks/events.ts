import { useContext } from "react";
import { CB, EventsContext, Unsubber } from "src/context/eventsContext";

export const useOnEvent = (id: string, cb: CB): [Unsubber] => {
    const eventsContext = useContext(EventsContext);
    const [ unsubber ] = eventsContext.onEvent(id, cb);
    return [ unsubber ];
}

export const useTriggerEvent = (id: string, value: any) => {
    const eventsContext = useContext(EventsContext);
    eventsContext.trigger(id, value);
}