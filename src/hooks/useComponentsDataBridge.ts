import { useRef } from "react";

type CrossDataUpdater<T> = { update: (data: T) => void };
type OnCrossDataChange<T> = (cb: () => (data: T) => void) => void;
type CrossDataSetter<T> = (data: T) => void;

const useComponentsDataBridge = function <T>(): [OnCrossDataChange<T>, CrossDataSetter<T>] {
    const updater = useRef<CrossDataUpdater<T> | null>(null);

    // crossDataSetter is meant to receive the setter function from
    // the component that needs to be updated with cross components data.
    // The setter function is triggered when the cross components data,
    // is updated by the component initiating the changes.
    //
    // The component using this function is to be
    // the one on the receiving end of the data transfer.
    const onCrossDataChange = (cb: () => (data: T) => void) => {
        updater.current = { update: cb() };
    }
    // onCrossDataChange is meant to be called by the component that
    // needs to send data across 2 components.
    //
    // The component using this function is to be
    // the one initiating the data transfer.
    const crossDataSetter = (data: T) => {
        updater.current?.update(data);
    }
    return [onCrossDataChange, crossDataSetter];
}

export default useComponentsDataBridge;
