import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

// Hooks
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useCameraRecording } from '../hooks/useCameraRecording';
import { useTeleprompterLayout } from '../hooks/useTeleprompterLayout';

// Components
import TeleprompterHeader from '../components/TeleprompterHeader';
import TeleprompterControls from '../components/TeleprompterControls';
import TeleprompterOverlay from '../components/TeleprompterOverlay';
import CountdownOverlay from '../components/CountdownOverlay';

export default function TeleprompterScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { script } = route.params;
    const { addRecording } = useScripts();

    // -- State --
    const [speed, setSpeed] = useState(1);
    const [fontSize, setFontSize] = useState(32);
    const [countdown, setCountdown] = useState(null);
    const [showSpeedControl, setShowSpeedControl] = useState(false);
    const [showStyleControl, setShowStyleControl] = useState(false);

    // -- Custom Hooks --
    const { 
        scrollRef, 
        isPlaying, 
        startPlay, 
        stopPlay, 
        handleScroll 
    } = useAutoScroll(speed);

    const {
        cameraRef,
        hasPermission,
        isRecording,
        facing,
        toggleFacing,
        startRecording,
        stopRecording,
    } = useCameraRecording(addRecording);

    const {
        isHorizontalMode,
        animatedSize,
        panResponder,
        toggleOrientation,
    } = useTeleprompterLayout();

    // -- Actions --
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
            startPlay();
        } else {
            stopPlay();
        }
        setShowSpeedControl(false);
        setShowStyleControl(false);
    };

    const toggleRecordingAndScroll = () => {
        if (isRecording) {
            stopRecording();
            stopPlay();
        } else {
            startActionWithCountdown(() => {
                startRecording(script.title);
                startPlay();
            });
        }
        setShowSpeedControl(false);
        setShowStyleControl(false);
    };

    const changeSpeed = (modifier) => {
        setSpeed(prev => Math.max(0.5, Math.min(5, prev + modifier)));
    };

    const changeFontSize = (modifier) => {
        setFontSize(prev => Math.max(16, Math.min(80, prev + modifier)));
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

            <TeleprompterHeader
                onBack={() => navigation.goBack()}
                onToggleOrientation={toggleOrientation}
                isHorizontalMode={isHorizontalMode}
                insets={insets}
            />

            <CountdownOverlay countdown={countdown} />

            <TeleprompterOverlay
                isHorizontalMode={isHorizontalMode}
                animatedSize={animatedSize}
                scrollRef={scrollRef}
                handleScroll={handleScroll}
                fontSize={fontSize}
                scriptContent={script.content}
                panResponder={panResponder}
                insets={insets}
            />

            {!isHorizontalMode && <View style={{ flex: 1 }} />}

            <TeleprompterControls
                isHorizontalMode={isHorizontalMode}
                insets={insets}
                isPlaying={isPlaying}
                isRecording={isRecording}
                speed={speed}
                fontSize={fontSize}
                showSpeedControl={showSpeedControl}
                showStyleControl={showStyleControl}
                onToggleCameraFacing={toggleFacing}
                onToggleStyleControl={() => {
                    setShowStyleControl(!showStyleControl);
                    setShowSpeedControl(false);
                }}
                onToggleSpeedControl={() => {
                    setShowSpeedControl(!showSpeedControl);
                    setShowStyleControl(false);
                }}
                onToggleRecording={toggleRecordingAndScroll}
                onTogglePlay={toggleScroll}
                onChangeSpeed={changeSpeed}
                onChangeFontSize={changeFontSize}
            />
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
});
