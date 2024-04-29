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
    
});

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

        // Redirect to new route with the Cloudinary URL
        res.redirect(`/show-image?url=${cloudinaryResponse.url}`);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to render the uploaded image
app.get('/show-image', (req, res) => {
    const imageUrl = req.query.url;
    res.render('image', { imageUrl });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
