import { Text } from "react-native";
import React from "react";

export const handleHighlights = (text: string): (string|JSX.Element)[] => {
    return text.split(" ").map((el: string, idx: number) => {
        const m = el.match(/\*\*([^*]*)\*\*/);
        if (!m) {
            return el + " ";
        }
        const res = el.split(m[0])[1];
        return <Text key={idx}>
            <Text style={{fontWeight: "bold", textDecorationLine: "underline", fontStyle: "italic"}}>{el.replace(/\*\*([^*]*)\*\*/, "$1").replace(res, "")}</Text>
            <Text>{res} </Text>
        </Text>
    })
}