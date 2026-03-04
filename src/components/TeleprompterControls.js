import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const TeleprompterControls = ({
    isHorizontalMode,
    insets,
    isPlaying,
    isRecording,
    speed,
    fontSize,
    showSpeedControl,
    showStyleControl,
    onToggleCameraFacing,
    onToggleStyleControl,
    onToggleSpeedControl,
    onToggleRecording,
    onTogglePlay,
    onChangeSpeed,
    onChangeFontSize,
}) => {
    return (
        <>
            {/* Speed & Style Controls Popup */}
            {(showSpeedControl || showStyleControl) && (
                <View style={[styles.speedMenu, isHorizontalMode && styles.speedMenuHoriz]}>
                    <TouchableOpacity
                        onPress={() => showSpeedControl ? onChangeSpeed(-0.5) : onChangeFontSize(-4)}
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
                        onPress={() => showSpeedControl ? onChangeSpeed(0.5) : onChangeFontSize(4)}
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
                <TouchableOpacity style={styles.controlSquare} onPress={onToggleCameraFacing}>
                    <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />  
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlSquare, showStyleControl && { backgroundColor: Colors.primary }]}
                    onPress={onToggleStyleControl}
                >
                    <Ionicons name="text-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.recordOuter, isRecording && { borderColor: '#FF5722' }]}
                    onPress={onToggleRecording}
                >
                    <View style={[styles.recordInner, isRecording && { borderRadius: 8, width: 30, height: 30 }]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlSquare, showSpeedControl && { backgroundColor: Colors.primary }]}
                    onPress={onToggleSpeedControl}
                >   
                    <Ionicons name="speedometer-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.controlSquare, { backgroundColor: isPlaying ? Colors.card : Colors.primary }]} onPress={onTogglePlay}>
                    <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
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

export default TeleprompterControls;
