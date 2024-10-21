import { Button, TextInput } from "@react-native-material/core";
import React, { useCallback, useRef, useState } from "react";
import { GestureResponderEvent, Modal, Pressable, Text, View } from "react-native";
import appConfig from "src/appConfig";
import i18n from "src/i18n";
import { updateEmailAddr } from "src/services/identity/client";
import { canIRefresh, displayRemainingTime } from "src/services/time";
import toast from "src/services/toast";
import style from "src/style/style";
import tw from "src/style/twrnc";

type Props = {
    visible: boolean;
    onRequestClose: () => boolean;
}

const UpdateUsernameModal = ({ visible, onRequestClose }: Props): React.ReactNode => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const lastUpdate = useRef(0);
    const cancelPropagation = useCallback((e: GestureResponderEvent) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, [visible]);

    const onSubmit = useCallback(async () => {
        if (!canIRefresh(+new Date(), appConfig.userUpdateThreshold, lastUpdate.current)) {
            toast.err(i18n.en.TOO_SOON_TO_UPDATE_1, displayRemainingTime(+new Date(), appConfig.userUpdateThreshold, lastUpdate.current))
            return;
        }
        const err = await updateEmailAddr(username, password);
        toast.ok_or_err(
            err,
            [i18n.en.SETTINGS_USER_CHANGE_LOGIN_REQUEST_SUCCESS_1],
            i18n.en.SETTINGS_USER_CHANGE_LOGIN_REQUEST_FAIL_1
        );
        lastUpdate.current = +new Date();
        onRequestClose();
    }, [username, password, lastUpdate.current, onRequestClose]);
    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
            animationType="fade">
            <View
                style={{
                    ...tw`flex justify-center items-center bg-white`,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                <Pressable
                    onPress={onRequestClose}
                    style={{
                        ...tw`flex h-full items-center justify-center`,
                }}>
                    <Pressable
                        onPress={cancelPropagation}
                        style={{
                        ...tw`flex bg-white p-10 rounded-md gap-1`,
                    }}>
                        <Text style={tw`text-xl font-bold`}>{i18n.en.SETTINGS_USER_CHANGE_LOGIN}</Text>
                        <TextInput
                            style={{
                                ...tw`w-full text-lg`,
                                width: 300,
                            }}
                            placeholder={`${i18n.en.SETTINGS_USER_CHANGE_LOGIN_INPUT_PLACEHOLDER}`}
                            autoCapitalize="none"
                            onChangeText={setUsername}
                        />
                        <Text style={tw`text-xl font-bold text-red-600`}>{i18n.en.SETTINGS_USER_CHANGE_PASSWORD_REQUIRED}</Text>
                        <TextInput
                            style={{
                                ...tw`w-full text-lg`,
                                width: 300,
                            }}
                            placeholder={`${i18n.en.SETTINGS_USER_CHANGE_PASSWORD_REQUIRED_INPUT_PLACEHOLDER}`}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                        <Button color={style.thirdColor} title="Ok" onPress={onSubmit} />
                    </Pressable>
                </Pressable>
            </View>
        </Modal>
    )
};

export default UpdateUsernameModal;
