const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const { Image, createImageData } = require('canvas');

const app = express();
const port = 3000;

const SKIN_CLASSES = {
    0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis',
    3: 'Dermatofibroma',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'Vascular skin lesion'
};

const findMedicine = (pred) => {
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
            return "fluorouracil (5-FU):";
        case 5:
            return "fluorouracil";
        case 6:
            return "fluorouracil";
        default:
            return "";
    }
};

const loadModel = async () => {
    const model = await tf.loadLayersModel('file://model/model.json');
    return model;
};

const predict = async (model, img) => {
    const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const prediction = await model.predict(tensor).data();
    return Array.from(prediction);
};

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/detect', upload.single('file'), async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const img = await loadImage(buffer);
        const canvas = createCanvas(224, 224);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 224, 224);
        const model = await loadModel();
        const prediction = await predict(model, canvas);
        const pred = prediction.indexOf(Math.max(...prediction));
        const disease = SKIN_CLASSES[pred];
        const accuracy = (Math.max(...prediction) * 100).toFixed(2);
        const medicine = findMedicine(pred);
        res.json({
            detected: pred !== 2,
            disease: disease,
            accuracy: accuracy,
            medicine: medicine
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
