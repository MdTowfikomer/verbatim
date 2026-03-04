export const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
};

export const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
