const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

app.use((req, res, next) => {
    if (req.path === '/') return next();
    
    console.log('--- Request Debug ---');
    console.log('Path:', req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.PDF_API_KEY || 'development_key';
    
    if (apiKey !== validApiKey) {
        console.log('Auth Failed. Received:', apiKey, 'Expected:', validApiKey);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
});

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.get('/', (req, res) => {
    res.send('✅ PDF Extraction API is running securely (v1.1.1)!');
});

app.post('/extract-pdf', upload.single('file'), async (req, res) => {
    console.log('📥 Received PDF upload request for:', req.file ? req.file.originalname : 'No file');
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const data = await pdf(req.file.buffer);

        res.json({
            text: data.text,
            info: data.info,
            numPages: data.numpages
        });

        console.log('✅ Successfully extracted text from:', req.file.originalname);

    } catch (error) {
        console.error('❌ PDF parsing error:', error.message);
        res.status(500).json({ error: 'Failed to parse PDF', message: error.message });
    }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`PDF Extraction API running at http://localhost:${port}`);
    });
}

module.exports = app;
