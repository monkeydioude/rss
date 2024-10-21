import { Button, TextInput } from "@react-native-material/core";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureResponderEvent, Modal, Pressable, Text, View } from "react-native";
import appConfig from "src/appConfig";
import i18n from "src/i18n";
import { passwordsValidations } from "src/services/constraints/password";
import { updatePassword } from "src/services/identity/client";
import { canIRefresh, displayRemainingTime } from "src/services/time";
import toast from "src/services/toast";
import style from "src/style/style";
import tw from "src/style/twrnc";

type Props = {
    visible: boolean;
    onRequestClose: () => boolean;
}

const UpdatePasswordModal = ({ visible, onRequestClose }: Props): React.ReactNode => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [error, setError] = useState("");
    const lastUpdate = useRef(0);
    const cancelPropagation = useCallback((e: GestureResponderEvent) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, [visible]);

    useEffect(() => {
        if (!visible) {
            setOldPassword("");
            setNewPassword1("");
            setNewPassword2("");
            setError("");
        }
    }, [visible]);

    const onSubmit = useCallback(async () => {
        setError("");
        if (newPassword1 !== newPassword2) {
            setError(i18n.en.SETTINGS_USER_CHANGE_PASSWORD_INPUT_NO_MATCHING_ERR);
            return;
        }
        if (!canIRefresh(+new Date(), appConfig.userUpdateThreshold, lastUpdate.current)) {
            setError(`${i18n.en.TOO_SOON_TO_UPDATE_1}: ${displayRemainingTime(+new Date(), appConfig.userUpdateThreshold, lastUpdate.current)}`);
            return;
        }
        const err = await updatePassword(oldPassword, newPassword1);
        lastUpdate.current = +new Date();
        if (err) {
            setError(err.reason);
            return;
        }

        onRequestClose();
        toast.ok(i18n.en.SETTINGS_USER_CHANGE_PASSWORD_REQUEST_SUCCESS_1);
    }, [oldPassword, newPassword1, newPassword2, lastUpdate.current, onRequestClose]);

    const validations = useMemo(() => passwordsValidations(newPassword1, newPassword2), [visible, newPassword1, newPassword2]);
    const submitDisabled = useMemo(() => {
        if (oldPassword === "" || validations[0] === false || validations[1] === false) {
            return true;
        }
        if (newPassword1 !== newPassword2) {
            return true;
        }
        return false;
    }, [oldPassword, validations, newPassword1, newPassword2]);
    const passwdLengthdInfoColor = useMemo(() => {
        if (newPassword1.length < appConfig.passwordMinSize || newPassword2.length < appConfig.passwordMinSize) {
            return "text-red-600";
        }
        return "text-primaryColor"
    }, [newPassword1, newPassword2]);
    const passwdMatchInfoColor = useMemo(() => {
        if (validations[0] !== true || validations[1] !== true || newPassword1 !== newPassword2) {
            return "text-red-600";
        }
        return "text-primaryColor"
    }, [validations, newPassword1, newPassword2]);

    const inputColor = useCallback((idx: number) => {
        if (validations[idx] === false) {
            return "bg-red-600";
        }
        return "";
    }, [validations, visible, newPassword1, newPassword2]);

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
                        <Text style={tw`text-xl font-bold text-red-600`}>{error}</Text>
                        <Text style={tw`text-xl font-bold`}>{i18n.en.SETTINGS_USER_CHANGE_PASSWORD_OLD_PASSWORD}</Text>
                        <TextInput
                            style={{
                                ...tw`w-full text-lg`,
                                width: 300,
                            }}
                            placeholder={`${i18n.en.SETTINGS_USER_CHANGE_PASSWORD_OLD_PASSWORD_INPUT_PLACEHOLDER}`}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setOldPassword}
                        />
                        <Text style={tw`text-xl font-bold`}>{i18n.en.SETTINGS_USER_CHANGE_PASSWORD}</Text>
                        <TextInput
                            style={{
                                ...tw`w-full text-lg ${inputColor(0)}`,
                                width: 300,
                            }}
                            placeholder={`${i18n.en.SETTINGS_USER_CHANGE_PASSWORD_INPUT1_PLACEHOLDER}`}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setNewPassword1}
                            />
                        <TextInput
                            style={{
                                ...tw`w-full text-lg ${inputColor(1)}`,
                                width: 300,
                            }}
                            placeholder={`${i18n.en.SETTINGS_USER_CHANGE_PASSWORD_INPUT2_PLACEHOLDER}`}
                            autoCapitalize="none"
                            secureTextEntry
                            onChangeText={setNewPassword2}
                        />
                        <Text style={tw`${passwdLengthdInfoColor}`}>{i18n.en.SETTINGS_USER_CHANGE_PASSWORD_INFO_1}</Text>
                        <Text style={tw`${passwdMatchInfoColor}`}>{i18n.en.SETTINGS_USER_CHANGE_PASSWORD_INFO_2}</Text>
                        <Button color={style.thirdColor} title="Ok" onPress={onSubmit} disabled={submitDisabled} />
                    </Pressable>
                </Pressable>
            </View>
        </Modal>
    )
};

export default UpdatePasswordModal;
