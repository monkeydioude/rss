import { ActivityIndicator, ButtonProps, Pressable, Surface, Text, usePaletteColor, useStyles, useSurfaceScale } from "@react-native-material/core";
import React, { useCallback, useMemo, useState } from 'react';
import {
    GestureResponderEvent,
    NativeSyntheticEvent,
    StyleSheet,
    TargetedEvent,
    View
} from 'react-native';
import { useAnimatedElevation } from "./hooks/use-animated-elevation";

interface NativeButtonProps {
    useNativeDriver?: boolean
} 

const Button: React.FC<ButtonProps & NativeButtonProps> = ({
    title,
    leading,
    trailing,
    variant = 'contained',
    color = 'primary',
    tintColor,
    compact = false,
    disableElevation = false,
    uppercase = true,
    loading = false,
    loadingIndicatorPosition = 'leading',
    loadingIndicator,

    style,
    pressableContainerStyle,
    contentContainerStyle,
    titleStyle,
    leadingContainerStyle,
    trailingContainerStyle,
    loadingOverlayContainerStyle,

    pressEffect,
    pressEffectColor,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    onBlur,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    delayLongPress,
    disabled,
    hitSlop,
    pressRetentionOffset,
    android_disableSound,
    android_ripple,
    testOnly_pressed,
    useNativeDriver = false,
    ...rest
}) => {
    const surfaceScale = useSurfaceScale();
    const p = usePaletteColor(
        disabled ? surfaceScale(0.12).hex() : color,
        disabled ? surfaceScale(0.35).hex() : tintColor
    );

    const contentColor = useMemo(
        () => (variant === 'contained' ? p.on : disabled ? p.on : p.main),
        [variant, p, disabled]
    );

    const hasLeading = useMemo(
        () => !!leading || (loading && loadingIndicatorPosition === 'leading'),
        [leading, loading, loadingIndicatorPosition]
    );

    const hasTrailing = useMemo(
        () => !!trailing || (loading && loadingIndicatorPosition === 'trailing'),
        [trailing, loading, loadingIndicatorPosition]
    );

    const styles = useStyles(
        ({ shapes }) => ({
            container: {
                backgroundColor: variant === 'contained' ? p.main : 'transparent',
            },
            outline: {
                ...shapes.small,
                borderWidth: 1,
                borderColor: surfaceScale(0.12).hex(),
            },
            pressableContainer: {
                ...shapes.small,
                overflow: 'hidden',
            },
            pressable: {
                minWidth: 64,
                height: 36,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingStart: hasLeading ? (compact ? 6 : 12) : compact ? 8 : 16,
                paddingEnd: hasTrailing ? (compact ? 6 : 12) : compact ? 8 : 16,
            },
            titleStyle: {
                textTransform: uppercase ? 'uppercase' : 'none',
                opacity: loading && loadingIndicatorPosition === 'overlay' ? 0 : 1,
            },
            leadingContainer: {
                marginEnd: compact ? 6 : 8,
                opacity: loading && loadingIndicatorPosition === 'overlay' ? 0 : 1,
            },
            trailingContainer: {
                marginStart: compact ? 6 : 8,
                opacity: loading && loadingIndicatorPosition === 'overlay' ? 0 : 1,
            },
            loadingOverlayContainer: {
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
            },
        }),
        [variant, uppercase, compact, loading, loadingIndicatorPosition, p, hasLeading, hasTrailing, surfaceScale]
    );

    const getTitle = () => {
        switch (typeof title) {
            case 'string':
                return (
                    <Text variant="button" selectable={false} style={[{ color: contentColor }, styles.titleStyle, titleStyle]}>
                        {title}
                    </Text>
                );
            case 'function':
                return title({ color: contentColor });
            default:
                return title;
        }
    };

    const getLoadingIndicator = () => {
        if (!loadingIndicator) return <ActivityIndicator color={contentColor} />;
        switch (typeof loadingIndicator) {
            case 'string':
                return (
                    <Text variant="button" style={{ color: contentColor }}>
                        {loadingIndicator}
                    </Text>
                );
            case 'function':
                return loadingIndicator({ color: contentColor });
            default:
                return loadingIndicator;
        }
    };

    const getLeading = () => {
        if (loading && loadingIndicatorPosition === 'leading') return getLoadingIndicator();
        return typeof leading === 'function' ? leading({ color: contentColor, size: 18 }) : leading;
    };

    const getTrailing = () => {
        if (loading && loadingIndicatorPosition === 'trailing') return getLoadingIndicator();
        return typeof trailing === 'function' ? trailing({ color: contentColor, size: 18 }) : trailing;
    };

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) => {
            onMouseEnter?.(event);
            setHovered(true);
        },
        [onMouseEnter]
    );

    const handleMouseLeave = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) => {
            onMouseLeave?.(event);
            setHovered(false);
        },
        [onMouseLeave]
    );

    const [pressed, setPressed] = useState(false);

    const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
            onPressIn?.(event);
            setPressed(true);
        },
        [onPressIn]
    );

    const handlePressOut = useCallback(
        (event: GestureResponderEvent) => {
            onPressOut?.(event);
            setPressed(false);
        },
        [onPressOut]
    );

    const animatedElevation = useAnimatedElevation(
        variant === 'contained' && !disableElevation && !disabled ? (pressed ? 8 : hovered ? 4 : 2) : 0,
        useNativeDriver,
    );

    return (
        <Surface category="small" style={[animatedElevation, styles.container, style]} {...rest}>
            <View style={[styles.pressableContainer, pressableContainerStyle]}>
                <Pressable
                    style={[styles.pressable, contentContainerStyle]}
                    pressEffect={pressEffect}
                    pressEffectColor={pressEffectColor ?? contentColor}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onLongPress={onLongPress}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    delayLongPress={delayLongPress}
                    disabled={disabled}
                    hitSlop={hitSlop}
                    pressRetentionOffset={pressRetentionOffset}
                    android_disableSound={android_disableSound}
                    android_ripple={android_ripple}
                    testOnly_pressed={testOnly_pressed}
                >
                    {hasLeading && <View style={[styles.leadingContainer, leadingContainerStyle]}>{getLeading()}</View>}
                    {getTitle()}
                    {hasTrailing && <View style={[styles.trailingContainer, trailingContainerStyle]}>{getTrailing()}</View>}

                    {loading && loadingIndicatorPosition === 'overlay' && (
                        <View style={[styles.loadingOverlayContainer, loadingOverlayContainerStyle]}>{getLoadingIndicator()}</View>
                    )}
                </Pressable>
            </View>
            {variant === 'outlined' && <View style={[StyleSheet.absoluteFill, styles.outline]} pointerEvents="none" />}
        </Surface>
    );
};

export default Button;
