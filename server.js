import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3000;

app.use(cors());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/generate', upload.single('image'), (req, res) => {
    if (req.file) {
        console.log('Received file:', req.file.originalname);
        res.json({
            success: true,
            message: 'Image received successfully',
            data: {
                id: req.file.filename,
                status: 'Mock sketch processing complete'
            }
        });
    } else {
        console.log('No file received');
        res.status(400).json({
            success: false,
            message: 'No image provided'
        });
    }
});

app.listen(port, () => {
    console.log(`Mock backend server running at http://localhost:${port}`);
});
