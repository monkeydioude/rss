import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props<T> = {
    elements: T[];
    onSelectCb: (text: string) => void;
}

export const FeedSettings = <T,>({ elements, onSelectCb }: Props<T>): JSX.Element => {
    return (
        <View style={styles.listContainer}>
            <FlatList
                data={elements}
                keyExtractor={(item) => ""+item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => {
                            onSelectCb(""+item)
                        }}
                    >
                        <Text>{""+ item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    listContainer: {
        position: "absolute",
        top: 90, // Adjust this to align under input
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        maxHeight: 200, // Limit height
        zIndex: 1000,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});