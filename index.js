const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;
const password = process.env.PASSWORD || 'foo';
const uploadDir = path.join(process.cwd(), 'public', 'upload');
const appName = process.env.APPNAME || 'App'
fs.access(uploadDir).catch(() => fs.mkdir(uploadDir, { recursive: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, uploadDir); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => { res.render('index',{appName}); });
app.post('/app', async (req, res) => {
    if (req.body.password === password) {
        try {
            const files = await getImages(uploadDir);
            res.render('upload', { appName,images: files, password: req.body.password });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error reading upload directory');
        }
    } else {
        res.redirect('/');
    }
});

app.post('/upload', upload.array('images', 10), (req, res) => {
    res.redirect('/');
});

async function getImages(directory) {
    try {
        const files = await fs.readdir(directory);
        return files;
    } catch (error) {
        console.error(error);
        return [];
    }
}

app.listen(port, () => { console.log(`Server running on port http://localhost:${port}`); });