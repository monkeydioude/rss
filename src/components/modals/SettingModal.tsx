import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text } from "@react-native-material/core";
import React, { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BackHandler, TextStyle, View, ViewStyle } from "react-native";
import tw from "src/style/twrnc";

type Props = {
    children?: React.ReactNode | React.ReactNode[],
    snapPoints: (string | number)[],
    backgroundStyle?: ViewStyle,
    title?: string | undefined,
    titleStyle?: TextStyle,
}

export interface SettingModalHandle {
    present: () => void,
    close: () => void,
}

const SettingModal = forwardRef<SettingModalHandle, Props>(({ children, snapPoints, backgroundStyle, title, titleStyle }: Props, fref: Ref<SettingModalHandle>): React.ReactNode => {
    const modalRef = useRef<BottomSheetModal>(null);
    const [opened, setOpened] = useState<boolean>(false);
    
    const present = useCallback(() => {
        modalRef.current?.present();
        setOpened(true);
    }, []);

    const close = useCallback(() => {
        modalRef.current?.close();
        setOpened(false);
    }, []);

    useImperativeHandle(fref, () => ({
        present,
        close,
    }));

    const closeModal = useCallback(() => {
        if (!opened) {
            return false;
        }
        close();
        return true;
    }, [opened, modalRef.current]);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", closeModal);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", closeModal);
        }
    }, [closeModal]);
    
    return (
        <BottomSheetModal
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            ref={modalRef}
            backgroundStyle={backgroundStyle}
        >
            <View>
                {title &&
                    <Text style={{
                        ...tw`text-xl text-center`,
                        ...titleStyle
                    }}>{title}</Text>
                }
                {children}
            </View>
        </BottomSheetModal>
    )
});

export default SettingModal;
