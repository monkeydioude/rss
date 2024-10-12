import { TextInput } from "@react-native-material/core";
import React, { useCallback, useState } from "react";
import { Button } from "react-native";
import { add_feed_source } from "src/services/request/panya";
import toast from "src/services/toast";

const AddFeedSources = (): React.ReactNode => {
    const [showInput, setShowInput] = useState(false);
    const [commaSepPayload, setCommaSepPayload] = useState("");

    const onSubmitInput = useCallback(() => {
        try {
            commaSepPayload
                .replaceAll(" ", "")
                .split(",")
                .forEach((chanUrl: string) => {
                    add_feed_source(chanUrl);
                });

        } catch (e) {
            toast.err((e as any).toString());
        }
    }, [commaSepPayload])
    return (
        <>
            <Button
                title="add feeds sources"
                color="orange"
                onPress={() => setShowInput(!showInput)} />
            {showInput && (
                <TextInput
                    placeholder="comma separated channels urls"
                    onChangeText={setCommaSepPayload}
                    onSubmitEditing={onSubmitInput} />
            )}
        </>
    )
};

export default AddFeedSources;
