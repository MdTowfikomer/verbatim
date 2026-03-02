import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, PanResponder, Animated, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext'; // 1. Import our Context hook

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TeleprompterScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { script } = route.params;

    // Pull addRecording from global context
    const { addRecording } = useScripts();

    // -- Camera & Recording State --
    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState('front');
    const [isRecording, setIsRecording] = useState(false);
    const cameraRef = useRef(null);

    // -- Teleprompter State --
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    // -- Dynamic Height Logic (The "TextArea" feel) --
    // animatedHeight: An Animated.Value allows us to change the container's height continuously 
    // without triggering React re-renders on every single frame, ensuring smooth 60fps performance.
    // We start at 50% of the screen.
    const animatedHeight = useRef(new Animated.Value(SCREEN_HEIGHT * 0.5)).current;

    // lastHeight: Keeps track of where the height actually is in numbers. We need this 
    // because Animated.Value doesn't easily let us read its current numeric value synchronously during a drag.
    const lastHeight = useRef(SCREEN_HEIGHT * 0.5);

    // panResponder: React Native's gesture tracking system. We attach this to the drag handle.
    const panResponder = useRef(
        PanResponder.create({
            // Tells React Native "Yes, we want to take over touch tracking for this element"
            onStartShouldSetPanResponder: () => true,

            // Fires continuously as the user drags their finger
            onPanResponderMove: (evt, gestureState) => {
                // gestureState.dy is the total vertical distance dragged since the touch started.
                // We add it to our last known height to get the new height.
                let newHeight = lastHeight.current + gestureState.dy;

                // Constraints: Don't let the box get impossibly small or overlap the top/bottom edges
                if (newHeight < 150) newHeight = 150;
                if (newHeight > SCREEN_HEIGHT - 150) newHeight = SCREEN_HEIGHT - 150;

                // Instantly update the native view's height (bypassing React state for speed)
                animatedHeight.setValue(newHeight);
            },

            // Fires when the user lifts their finger off the screen
            onPanResponderRelease: (evt, gestureState) => {
                // Permanently save the new height so the next drag starts from the correct spot
                lastHeight.current += gestureState.dy;

                // Apply the same constraints so our baseline doesn't drift out of bounds
                if (lastHeight.current < 150) lastHeight.current = 150;
                if (lastHeight.current > SCREEN_HEIGHT - 150) lastHeight.current = SCREEN_HEIGHT - 150;
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

    const [showSpeedControl, setShowSpeedControl] = useState(false);

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

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleScroll = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying && showSpeedControl) setShowSpeedControl(false);
    };

    const handleScroll = (event) => {
        scrollY.current = event.nativeEvent.contentOffset.y;
    };

    const changeSpeed = (modifier) => {
        setSpeed(prev => Math.max(0.5, Math.min(5, prev + modifier)));
    };

    // -- Video Recording Logic --
    // This function handles the start and stop of the camera feed recording.
    const toggleRecording = async () => {
        if (!cameraRef.current) return;

        if (isRecording) {
            // Stop recording: This will resolve the Promise returned by recordAsync
            cameraRef.current.stopRecording();
            setIsRecording(false);
        } else {
            // Start recording
            setIsRecording(true);
            try {
                // recordAsync starts the recording and waits until stopRecording is called.
                // It then returns an object containing the URI of the saved .mp4 file.
                const videoData = await cameraRef.current.recordAsync();

                // Save it to our global gallery!
                addRecording({
                    uri: videoData.uri,
                    title: script.title, // Attach the current script's title to the video metadata
                });

                // Keep the alert for good UX feedback
                Alert.alert('Recording Saved!', `You can view this video in the Recordings tab.`);
            } catch (error) {
                console.error("Failed to record video:", error);
                setIsRecording(false);
                Alert.alert('Error', 'Failed to record video.');
            }
        }
    };

    if (hasPermission === null) return <View style={styles.container} />;
    if (hasPermission === false) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ color: 'white' }}>No access to camera.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={{ color: 'white' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* We attached cameraRef to the CameraView and explicitly set mode="video" */}
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={facing}
                mode="video"
            />

            {/* Top Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="lock-closed" size={20} color="#FF6B6B" />
                </TouchableOpacity>
            </View>

            {/* Resizable Teleprompter Overlay */}
            <Animated.View style={[styles.teleprompterOverlay, { height: animatedHeight }]}>
                <ScrollView
                    ref={scrollRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 200, paddingTop: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.teleprompterText}>{script.content}</Text>
                </ScrollView>

                {/* THE DRAG HANDLE (Grab here to resize) */}
                <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
                    <View style={styles.dragHandleBar} />
                </View>
            </Animated.View>

            <View style={{ flex: 1 }} />

            {/* Speed Controls */}
            {showSpeedControl && (
                <View style={styles.speedMenu}>
                    <TouchableOpacity onPress={() => changeSpeed(-0.5)} style={styles.speedBtn}>
                        <Ionicons name="remove" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.speedDisplay}>
                        <Text style={styles.speedValue}>{speed.toFixed(1)}x</Text>
                        <Text style={styles.speedLabel}>Speed</Text>
                    </View>
                    <TouchableOpacity onPress={() => changeSpeed(0.5)} style={styles.speedBtn}>
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Controls */}
            <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity style={styles.controlSquare} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlSquare, showSpeedControl && { backgroundColor: Colors.primary }]}
                    onPress={() => setShowSpeedControl(!showSpeedControl)}
                >
                    <Ionicons name="speedometer-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.recordOuter, isRecording && { borderColor: '#FF5722' }]}
                    onPress={toggleRecording}
                >
                    <View style={[styles.recordInner, isRecording && { borderRadius: 8, width: 30, height: 30 }]} />
                </TouchableOpacity>

                {/* Empty square to keep play button on the right */}
                <View style={{ width: 50 }} />

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
    teleprompterOverlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    teleprompterText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '500',
        lineHeight: 44,
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
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 20,
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
