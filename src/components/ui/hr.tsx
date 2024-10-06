import React from "react";
import { ColorValue, DimensionValue, StyleSheet, View } from "react-native";
import style from "src/style/style";

type Props = {
    color?: ColorValue,
    marginHorizontal?: DimensionValue | "30%",
    marginVertical?: DimensionValue | 10,
}

const Hr = ({ color, marginHorizontal, marginVertical }: Props): React.ReactNode => {
    if (!color) {
        color = style.thirdColor;
    }
    if (!marginVertical) {
        marginVertical = 10;
    }
    if (!marginHorizontal) {
        marginHorizontal = "30%";
    }
    return (
        <>
            <View
                style={{
                    marginVertical,
                    marginHorizontal,
                    borderBottomColor: color,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
        </>
    )
};

export default Hr;
