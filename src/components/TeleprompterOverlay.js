import React from 'react';
import { View, Text, ScrollView, Animated, StyleSheet } from 'react-native';

const TeleprompterOverlay = ({
    isHorizontalMode,
    animatedSize,
    scrollRef,
    handleScroll,
    fontSize,
    scriptContent,
    panResponder,
    insets,
}) => {
    return (
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
                <View>
                    <Text style={[styles.teleprompterText, { fontSize: fontSize, lineHeight: fontSize * 1.3 }]}>
                        {scriptContent}
                    </Text>
                </View>
            </ScrollView>

            <View {...panResponder.panHandlers} style={isHorizontalMode ? styles.dragHandleContainerHoriz : styles.dragHandleContainer}>
                <View style={isHorizontalMode ? styles.dragHandleBarHoriz : styles.dragHandleBar} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
});

export default TeleprompterOverlay;
