import React, { useContext, useRef } from "react";
import { GestureResponderEvent, View } from "react-native";
import swipeConfig from "../config/swipe";
import { EventsContext } from "../context/eventsContext";

type Props = {
    direction: Directions;
    distance: Distance;
    onSwipe: () => void;
    children: JSX.Element;
}

export enum Directions {
    None,
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4,
}

export enum Distance {
    Short = 1 * swipeConfig.swipeBaseRange,
    Mid = 2 * swipeConfig.swipeBaseRange,
    Long = 3 * swipeConfig.swipeBaseRange,
}

export type SwipeConfig = {
    swipeEnabled: boolean;
}

const Swipe = ({ direction, distance, children, onSwipe }: Props): JSX.Element => {
    let value = useRef(0);

    return (
        <View
            onTouchStart={(e: GestureResponderEvent) => {
                e.preventDefault();
                e.stopPropagation();
                switch (direction) {
                    case Directions.Left:
                    case Directions.Right:
                        value.current = e.nativeEvent.pageX;
                        break;
                    case Directions.Up:
                    case Directions.Down:
                        value.current = e.nativeEvent.pageY;
                        break;
                    default:
                        value.current = -1;
                }
            }}
            onTouchEnd={(e: GestureResponderEvent) => {
                e.preventDefault();
                let goalValue = value.current;
                value.current = 0;
                if (goalValue == -1) {
                    return;
                }
                switch (direction) {
                    case Directions.Left:
                        goalValue += -e.nativeEvent.pageX;
                        break;
                    case Directions.Right:
                        goalValue = e.nativeEvent.pageX - goalValue;
                        break;
                    case Directions.Up:
                        goalValue += -e.nativeEvent.pageY;
                        break;
                    case Directions.Down:
                        goalValue = e.nativeEvent.pageY - goalValue;
                        break;
                    default:
                        console.error("swipe failed");
                        return;
                }
                if (goalValue <= distance) {
                    return;
                }
                onSwipe();
            }}
        >{children}</View>
    )
}

export default Swipe;