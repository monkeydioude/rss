import Ionicons from "@expo/vector-icons/Ionicons";
import React, { forwardRef, Ref, useImperativeHandle } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import style from "src/style/style";

interface Props {
  linkRef: React.RefObject<any>;
}

export interface BackToTopButtonHandle {
  handleScroll: (scrollPosition: number) => void;
}

const BackToTop = forwardRef<BackToTopButtonHandle, Props>(
  ({ linkRef }, ref: Ref<BackToTopButtonHandle>) => {
    const buttonOpacity = useSharedValue(0);

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: buttonOpacity.value,
            transform: [{ scale: buttonOpacity.value }],
        };
    });

    const scrollToTop = () => {
        linkRef?.current?.scrollToOffset({ offset: 0, animated: true });
    };

    useImperativeHandle(ref, () => ({
        handleScroll: (scrollPosition: number) => {
            if (scrollPosition > 200) {
                buttonOpacity.value = withTiming(1, { duration: 300 });
            } else {
                buttonOpacity.value = withTiming(0, { duration: 300 });
            }
        }
    }));
    return (
        <Animated.View
            style={[
                {
                position: 'absolute',
                bottom: 20,
                right: 20,
                },
                animatedButtonStyle
            ]}
            >
            <TouchableOpacity
                onPress={scrollToTop}
                style={{
                backgroundColor: style.primaryColor,
                padding: 10,
                borderRadius: 25,
                }}
            >
                <Text style={{ color: 'white' }}>
                    <Ionicons name="chevron-up" size={25} />
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
});

export { BackToTop, type Props };
