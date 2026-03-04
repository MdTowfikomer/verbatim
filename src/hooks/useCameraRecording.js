import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';

export const useCameraRecording = (onRecordingSaved) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [facing, setFacing] = useState('front');
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const microphoneStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(
                cameraStatus.status === 'granted' && microphoneStatus.status === 'granted'
            );
        })();
    }, []);

    const toggleFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const startRecording = async (scriptTitle) => {
        if (!cameraRef.current) return;
        setIsRecording(true);
        try {
            const videoData = await cameraRef.current.recordAsync();
            onRecordingSaved?.({
                uri: videoData.uri,
                title: scriptTitle,
            });
            Alert.alert('Recording Saved!', `You can view this video in the Recordings tab.`);
        } catch (error) {
            console.error("Failed to record video:", error);
            setIsRecording(false);
            Alert.alert('Error', 'Failed to record video.');
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    return {
        cameraRef,
        hasPermission,
        isRecording,
        facing,
        toggleFacing,
        startRecording,
        stopRecording,
    };
};
