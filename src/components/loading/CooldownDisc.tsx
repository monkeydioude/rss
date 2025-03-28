import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import style from "src/style/style";

interface CooldownDiscProps {
    duration: number; // Cooldown duration in seconds
}

export interface CooldownDiscRef {
    reset: () => void; // Function to restart animation
}

const CIRCLE_SIZE = 30;
const STROKE_WIDTH = 15;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CooldownDisc = forwardRef<CooldownDiscRef, CooldownDiscProps>(({ duration }, ref) => {
    const progress = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        reset: () => {
            progress.value = 0;
            progress.value = withTiming(1, { duration: duration * 1000 }); // Restart animation
        },
    }));

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    }));

    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
                <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={style.thirdColor}
                    strokeWidth={STROKE_WIDTH-1}
                    fill="none"
                />
                <AnimatedCircle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={style.primaryColor}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCUMFERENCE}
                    animatedProps={animatedProps}
                    fill="none"
                    strokeLinecap="butt"
                />
            </Svg>
        </View>
    );
});

export default CooldownDisc;
