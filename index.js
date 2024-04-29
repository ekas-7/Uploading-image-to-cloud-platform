const express = require('express');
const path = require('path');
const multer = require('multer');
const { v2: cloudinary } = require("cloudinary");
const { unlinkSync } = require("fs");
const uploadOnCloudinary = require("./utils/cloudinary");
const { PythonShell } = require('python-shell');

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ 
    storage: storage 
});

cloudinary.config({ 
    cloud_name: 'dhbd74kyg', 
    api_key: '262952965323451', 
    api_secret: 'LI4FEC-4m-3Zaf10Yg2TO26wb_w' 
});

const SKIN_CLASSES = {
    0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis',
    3: 'Dermatofibroma',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'Vascular skin lesion'
};

function findMedicine(pred) {
    switch (pred) {
        case 0:
            return "fluorouracil";
        case 1:
            return "Aldara";
        case 2:
            return "Prescription Hydrogen Peroxide";
        case 3:
            return "fluorouracil";
        case 4:
            return "fluorouracil (5-FU)";
        case 5:
            return "fluorouracil";
        case 6:
            return "fluorouracil";
        default:
            return "Unknown";
    }
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/detect', upload.single('uploaded_file'), async (req, res) => {
    try {
        const uploadedImage = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(uploadedImage);

        if (!cloudinaryResponse || !cloudinaryResponse.url) {
            return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        const imageUrl = cloudinaryResponse.url;

        // Set options for PythonShell
        const options = {
            mode: 'json',
            pythonPath: '/usr/bin/python3', // Path to your Python executable
            pythonOptions: ['-u'], // Allow unbuffered output
            scriptPath: path.join(__dirname), // Path to the directory containing your Python script
            args: [imageUrl] // Pass the image URL as an argument to the Python script
        };

        // Execute the Python script
        PythonShell.run('skin_detection.py', options, (err, result) => {
            if (err) {
                console.error('Error executing Python script:', err);
                return res.status(500).json({ error: 'Error processing image' });
            }

            // Handle the result returned by the Python script
            console.log('Python script output:', result);
            res.status(200).json(result);
        });

    } catch (error) {
        console.error(`Error processing image: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
