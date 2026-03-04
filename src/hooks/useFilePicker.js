import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { extractPdfText } from '../services/pdfService';
import { getWordCount, formatDate, formatTime } from '../utils/text';

export const useFilePicker = () => {
    const pickAndProcessFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain', 'application/pdf'],
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return null;
            }

            const file = result.assets[0];
            let content = '';

            if (file.mimeType === 'application/pdf') {
                content = await extractPdfText(file);
            } else {
                content = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.UTF8,
                });
            }

            const wordCount = getWordCount(content);
            const now = new Date();

            return {
                title: file.name.replace(/\.[^/.]+$/, ""),
                content: content,
                wordCount: wordCount,
                date: formatDate(now),
                time: formatTime(now),
                id: Date.now().toString(),
            };
        } catch (error) {
            console.error("Error picking/processing file:", error);
            throw error;
        }
    };

    return { pickAndProcessFile };
};

