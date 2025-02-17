import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, View } from "react-native";
import appConfig from "src/appConfig";
import UpdatePasswordModal from "src/components/blocks/settings/updatePasswordModal";
import UpdateUsernameModal from "src/components/blocks/settings/updateUsernameModal";
import Hr from "src/components/ui/hr";
import SettingsSectionTitle from "src/components/ui/settings/settingsSectionTitle";
import i18n from "src/i18n";
import { deactivateUser } from "src/services/identity/client";
import useAuth from "src/services/identity/useAuth";
import toast from "src/services/toast";
import style from "src/style/style";
import tw from "src/style/twrnc";

enum ModalType {
    NONE,
    USERNAME,
    PASSWORD,
}

const UserSettings = (): React.ReactNode => {
    const [openModal, setOpenModal] = useState<ModalType>(ModalType.NONE);
    const { signout } = useAuth();
    const router = useRouter();

    const closeModal = useCallback(() => {
        if (openModal === ModalType.NONE) {
            return false;
        }
        setOpenModal(ModalType.NONE);
        return true;
    }, [openModal]);
    
    const onPressDeactivate = useCallback(async () => {
        Alert.alert(i18n.en.SETTINGS_USER_DEACTIVATE_ACCOUNT_ALERT, "", [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'OK', onPress: async () => {
                    try {

                        const err = await deactivateUser();
                        if (err) {
                            toast.err(i18n.en.SETTINGS_USER_DEACTIVATE_ACCOUNT_FAIL_1, err.getReason());
                            return;
                        }
                        await signout();
                        router.replace("/login");
                    }
                    catch (err) {
                        toast.err(i18n.en.SETTINGS_USER_DEACTIVATE_ACCOUNT_FAIL_1, ""+ err);
                    }
                }
            },
        ]);
    }, [signout]);
    return (
        <>
            <View style={tw`flex-col grow-1 bg-primaryColor`}>
                <SettingsSectionTitle title={appConfig.labels.en.SETTINGS_USER_SECTION_TITLE} iconIo="people" />
                <View style={tw`flex gap-1`}>
                    <Button
                        title={i18n.en.SETTINGS_USER_CHANGE_LOGIN}
                        color={style.thirdColor}
                        tintColor="black"
                        trailingContainerStyle={tw`shrink-1 absolute right-0`}
                        trailing={<Icon name="chevron-double-right" style={tw`text-3xl text-black`} />}
                        onPress={() => setOpenModal(ModalType.USERNAME)}
                        useNativeDriver={true}
                        />
                    <Button
                        title={i18n.en.SETTINGS_USER_CHANGE_PASSWORD}
                        color={style.secondaryColor}
                        tintColor="white"
                        trailingContainerStyle={tw`shrink-1 absolute right-0`}
                        trailing={<Icon name="chevron-double-right" style={tw`text-3xl text-white`} />}
                        onPress={() => setOpenModal(ModalType.PASSWORD)}
                        useNativeDriver={true}
                    />
                    <Hr />
                    <Button
                        title={i18n.en.SETTINGS_USER_DEACTIVATE_ACCOUNT}
                        color="red"
                        tintColor="black"
                        onPress={onPressDeactivate}
                        useNativeDriver={true}
                    />
                </View>
                <UpdateUsernameModal
                    visible={openModal === ModalType.USERNAME}
                    onRequestClose={closeModal}
                />
                <UpdatePasswordModal
                    visible={openModal === ModalType.PASSWORD}
                    onRequestClose={closeModal}
                />
                {/* <Modal
                    visible={openModal === ModalType.PASSWORD}
                    onRequestClose={closeModal}
                    animationType="fade" /> */}
            </View>
        </>
    )
};

export default UserSettings;
