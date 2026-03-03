const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS so our Expo app can talk to it
app.use(cors());

// Configure multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Add a simple GET route so you can verify it in your browser
app.get('/', (req, res) => {
    res.send('✅ PDF Extraction API is running (v2)!');
});

app.post('/extract-pdf', upload.single('file'), async (req, res) => {
    console.log('📥 Received PDF upload request for:', req.file ? req.file.originalname : 'No file');

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Initialize the parser with the uploaded file buffer
        console.log(req.file.buffer)
        const parser = new PDFParse({ data: req.file.buffer });

        // Extract the text using the v2 method
        const result = await parser.getText();

        // Return the extracted text
        // v2 structure might differ slightly, but 'result.text' should be there
        res.json({
            text: result.text,
            info: result.info,
            numPages: result.numpages || result.pages
        });

        console.log('✅ Successfully extracted text from:', req.file.originalname);

    } catch (error) {
        console.error('❌ Full PDF parsing error:', error.message);
        res.status(500).json({ error: 'Failed to parse PDF', message: error.message });
    }
});

app.listen(port, () => {
    console.log(`PDF Extraction API running at http://localhost:${port}`);
    console.log(`Endpoint: POST http://localhost:${port}/extract-pdf`);
});