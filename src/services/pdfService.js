export const extractPdfText = async (file) => {
    const apiUrl = 'https://verbatim-pdf-api.vercel.app/extract-pdf';

    const formData = new FormData();
    formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_PDF_API_KEY || 'development_key',
            },
        });


        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`❌ API Error (${response.status}):`, errorBody);
            throw new Error(`API response was not ok: ${response.status}`);
        }

        const data = await response.json();
        return data.text;
    } catch (e) {
        console.error("PDF Parsing error:", e);
        throw e;
    }
};
