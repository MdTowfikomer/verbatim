import { useState, useRef, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export const useTeleprompterLayout = () => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
    const [isHorizontalMode, setIsHorizontalMode] = useState(false);

    const initialSize = isHorizontalMode ? SCREEN_WIDTH * 0.4 : SCREEN_HEIGHT * 0.5;
    const animatedSize = useRef(new Animated.Value(initialSize)).current;
    const lastSize = useRef(initialSize);
    const isHorizRef = useRef(isHorizontalMode);

    useEffect(() => {
        isHorizRef.current = isHorizontalMode;
        const newSize = isHorizontalMode ? SCREEN_WIDTH * 0.4 : SCREEN_HEIGHT * 0.5;
        animatedSize.setValue(newSize);
        lastSize.current = newSize;
    }, [isHorizontalMode, SCREEN_WIDTH, SCREEN_HEIGHT]);

    const toggleOrientation = async () => {
        if (isHorizontalMode) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setIsHorizontalMode(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            setIsHorizontalMode(true);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {``
                const isHoriz = isHorizRef.current;
                let newSize = isHoriz ? lastSize.current + gestureState.dx : lastSize.current + gestureState.dy;
                if (newSize < 150) newSize = 150;

                const { width: dynW, height: dynH } = Dimensions.get('window');
                const maxDim = isHoriz ? dynW : dynH;

                if (newSize > maxDim - 150) newSize = maxDim - 150;
                animatedSize.setValue(newSize);
            },
            onPanResponderRelease: (evt, gestureState) => {
                const isHoriz = isHorizRef.current;
                lastSize.current += isHoriz ? gestureState.dx : gestureState.dy;
                if (lastSize.current < 150) lastSize.current = 150;

                const { width: dynW, height: dynH } = Dimensions.get('window');
                const maxDim = isHoriz ? dynW : dynH;

                if (lastSize.current > maxDim - 150) lastSize.current = maxDim - 150;
            },
        })
    ).current;

    useEffect(() => {
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    return {
        isHorizontalMode,
        animatedSize,
        panResponder,
        toggleOrientation,
    };
};
