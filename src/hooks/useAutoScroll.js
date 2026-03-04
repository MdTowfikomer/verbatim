import { useState, useRef, useEffect } from 'react';

export const useAutoScroll = (speed) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const scrollRef = useRef(null);
    const scrollY = useRef(0);
    const animationRef = useRef(null);

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

    const togglePlay = () => setIsPlaying(prev => !prev);
    const stopPlay = () => setIsPlaying(false);
    const startPlay = () => setIsPlaying(true);

    const handleScroll = (event) => {
        scrollY.current = event.nativeEvent.contentOffset.y;
    };

    return {
        scrollRef,
        isPlaying,
        togglePlay,
        stopPlay,
        startPlay,
        handleScroll,
    };
};
