import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, PanResponder, Animated, Alert, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

export default function TeleprompterScreen() {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { script } = route.params;

    const { addRecording } = useScripts();

    // -- Camera & Recording State --
    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState('front');
    const [isRecording, setIsRecording] = useState(false);
    const cameraRef = useRef(null);

    // -- Teleprompter State --
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [fontSize, setFontSize] = useState(32);
    const [isHorizontalMode, setIsHorizontalMode] = useState(false);
    const [countdown, setCountdown] = useState(null); // 3, 2, 1, or null

    // -- UI State --
    const [showSpeedControl, setShowSpeedControl] = useState(false);
    const [showStyleControl, setShowStyleControl] = useState(false);

    // -- Dynamic Layout Logic --
    // In portrait, this controls height. In horizontal mode, it controls width.
    const initialSize = isHorizontalMode ? SCREEN_WIDTH * 0.4 : SCREEN_HEIGHT * 0.5;
    const animatedSize = useRef(new Animated.Value(initialSize)).current;
    const lastSize = useRef(initialSize);

    // We use a ref so our PanResponder can read it without re-rendering
    const isHorizRef = useRef(isHorizontalMode);

    useEffect(() => {
        isHorizRef.current = isHorizontalMode;
        // Adjust the size when orientation changes
        const newSize = isHorizontalMode ? SCREEN_WIDTH * 0.4 : SCREEN_HEIGHT * 0.5;
        animatedSize.setValue(newSize);
        lastSize.current = newSize;
    }, [isHorizontalMode, SCREEN_WIDTH, SCREEN_HEIGHT]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const isHoriz = isHorizRef.current;
                let newSize = isHoriz ? lastSize.current + gestureState.dx : lastSize.current + gestureState.dy;
                if (newSize < 150) newSize = 150;

                // Dynamically fetch window dimensions so bounds are accurate in landscape
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

    // -- Auto-Scroll Logic --
    const scrollRef = useRef(null);
    const scrollY = useRef(0);
    const animationRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(
                cameraStatus.status === 'granted' && microphoneStatus.status === 'granted'
            );
        })();
    }, []);

    const autoScroll = () => {
        if (scrollRef.current) {
            scrollY.current += speed;
            scrollRef.current.scrollTo({ y: scrollY.current, animated: false });
            animationRef.current = requestAnimationFrame(autoScroll);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(autoScroll);
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, speed]);

    useEffect(() => {
        return () => {
            // Revert to device default orientation when leaving prompter
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleOrientation = async () => {
        if (isHorizontalMode) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setIsHorizontalMode(false);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
            setIsHorizontalMode(true);
        }
    };

    // Starts a 3-second countdown before performing an action (Play or Record)
    const startActionWithCountdown = (callback) => {
        setCountdown(3);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    callback();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const toggleScroll = () => {
        if (!isPlaying) {
            // startActionWithCountdown(() => setIsPlaying(true));
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
        if (showSpeedControl) setShowSpeedControl(false);
        if (showStyleControl) setShowStyleControl(false);
    };
    const toggleRecordingAndScroll = () => {
        if (!isPlaying) {
            startActionWithCountdown(() => setIsPlaying(true));
            toggleRecording();
        } else {
            setIsPlaying(false);
            toggleRecording();
        }
        if (showSpeedControl) setShowSpeedControl(false);
        if (showStyleControl) setShowStyleControl(false);
    };

    const handleScroll = (event) => {
        scrollY.current = event.nativeEvent.contentOffset.y;
    };

    const changeSpeed = (modifier) => {
        setSpeed(prev => Math.max(0.5, Math.min(5, prev + modifier)));
    };

    const changeFontSize = (modifier) => {
        setFontSize(prev => Math.max(16, Math.min(80, prev + modifier)));
    };

    const toggleRecording = async () => {
        if (!cameraRef.current) return;

        if (isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        } else {
            startActionWithCountdown(async () => {
                setIsRecording(true);
                try {
                    const videoData = await cameraRef.current.recordAsync();
                    addRecording({
                        uri: videoData.uri,
                        title: script.title,
                    });
                    Alert.alert('Recording Saved!', `You can view this video in the Recordings tab.`);
                } catch (error) {
                    console.error("Failed to record video:", error);
                    setIsRecording(false);
                    Alert.alert('Error', 'Failed to record video.');
                }
            });
        }
    };

    if (hasPermission === null) return <View style={styles.container} />;
    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ color: 'white' }}>No access to camera/microphone.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={{ color: 'white' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={facing}
                mode="video"
            />

            {/* Top Header - In Landscape, we avoid the side notch via insets */}
            <View style={[styles.header, {
                paddingTop: isHorizontalMode ? 20 : insets.top + 10,
                paddingHorizontal: isHorizontalMode ? insets.left + 20 : 20,
            }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={toggleOrientation}>
                    {/* Highlight icon if already in horizontal mode */}
                    <Ionicons
                        name={isHorizontalMode ? "phone-portrait-outline" : "phone-landscape-outline"}
                        size={24}
                        color={isHorizontalMode ? Colors.primary : "#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>

            {/* Countdown Overlay */}
            {countdown !== null && (
                <View style={styles.countdownOverlay}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                </View>
            )}

            {/* Resizable Teleprompter Overlay */}
            <Animated.View style={[
                styles.teleprompterOverlay,
                isHorizontalMode
                    ? { width: animatedSize, height: '100%', flexDirection: 'row', paddingTop: 0 }
                    : { height: animatedSize, width: '100%', flexDirection: 'column' }
            ]}>
                <ScrollView
                    ref={scrollRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={isHorizontalMode ? { flex: 1, paddingLeft: insets.left } : undefined}
                    contentContainerStyle={isHorizontalMode
                        ? { paddingBottom: 150, paddingTop: 100 }
                        : { paddingBottom: 200, paddingTop: 40 }
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mirroring is completely removed based on user feedback */}
                    <View>
                        <Text style={[styles.teleprompterText, { fontSize: fontSize, lineHeight: fontSize * 1.3 }]}>
                            {script.content}
                        </Text>
                    </View>
                </ScrollView>

                <View {...panResponder.panHandlers} style={isHorizontalMode ? styles.dragHandleContainerHoriz : styles.dragHandleContainer}>
                    <View style={isHorizontalMode ? styles.dragHandleBarHoriz : styles.dragHandleBar} />
                </View>
            </Animated.View>
            {!isHorizontalMode && <View style={{ flex: 1 }} />}

            {/* Speed & Style Controls Popup */}
            {(showSpeedControl || showStyleControl) && (
                <View style={[styles.speedMenu, isHorizontalMode && styles.speedMenuHoriz]}>
                    <TouchableOpacity
                        onPress={() => showSpeedControl ? changeSpeed(-0.5) : changeFontSize(-4)}
                        style={styles.speedBtn}
                    >
                        <Ionicons name="remove" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.speedDisplay}>
                        <Text style={styles.speedValue}>
                            {showSpeedControl ? `${speed.toFixed(1)}x` : `${fontSize}px`}
                        </Text>
                        <Text style={styles.speedLabel}>
                            {showSpeedControl ? "Speed" : "Font Size"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => showSpeedControl ? changeSpeed(0.5) : changeFontSize(4)}
                        style={styles.speedBtn}
                    >
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Controls */}
            <View style={[
                isHorizontalMode ? styles.bottomControlsHoriz : styles.bottomControlsPortrait,
                { paddingBottom: isHorizontalMode ? 20 : insets.bottom + 20 }
            ]}>
                {/* camera reverse */}
                <TouchableOpacity style={styles.controlSquare} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />  
                </TouchableOpacity>

                {/* font size */}
                <TouchableOpacity
                    style={[styles.controlSquare, showStyleControl && { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        setShowStyleControl(!showStyleControl);
                        setShowSpeedControl(false);
                    }}
                >
                    <Ionicons name="text-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>

                {/* record */}
                <TouchableOpacity
                    style={[styles.recordOuter, isRecording && { borderColor: '#FF5722' }]}
                    onPress={()=>{
                        toggleRecordingAndScroll();
                    }}
                >
                    <View style={[styles.recordInner, isRecording && { borderRadius: 8, width: 30, height: 30 }]} />
                </TouchableOpacity>

                {/* speed */}
                <TouchableOpacity
                    style={[styles.controlSquare, showSpeedControl && { backgroundColor: Colors.primary }]}
                    onPress={() => {
                        setShowSpeedControl(!showSpeedControl);
                        setShowStyleControl(false);
                    }}
                >   
                    <Ionicons name="speedometer-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* play/pause */}
                <TouchableOpacity style={[styles.controlSquare, { backgroundColor: isPlaying ? Colors.card : Colors.primary }]} onPress={toggleScroll}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    backBtn: {
        marginTop: 20,
        padding: 10,
        backgroundColor: Colors.card,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    countdownText: {
        color: '#FFFFFF',
        fontSize: 120,
        fontWeight: 'bold',
    },
    teleprompterOverlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    teleprompterText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    dragHandleContainer: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dragHandleBar: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dragHandleContainerHoriz: {
        width: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dragHandleBarHoriz: {
        width: 5,
        height: 40,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    bottomControlsPortrait: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 20,
    },
    bottomControlsHoriz: {
        position: 'absolute',
        bottom: 20,
        right: 40,
        flexDirection: 'row',
        gap: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 40,
        alignItems: 'center',
    },
    controlSquare: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(30, 30, 40, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordOuter: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#FF5722',
    },
    speedMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30,30,40,0.9)',
        marginHorizontal: 40,
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 20,
    },
    speedMenuHoriz: {
        position: 'absolute',
        bottom: 100,
        right: 40,
        marginHorizontal: 0,
        marginBottom: 0,
    },
    speedBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedDisplay: {
        alignItems: 'center',
        minWidth: 60,
    },
    speedValue: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    speedLabel: {
        color: '#AAAAAA',
        fontSize: 12,
    },
});
