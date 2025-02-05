require('dotenv').config()
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const archiver = require('archiver');
const port = process.env.PORT || 3000;
const password = process.env.PASSWORD || 'foo';
const removePwd = process.env.REMOVE_PWD || 'remove';
const uploadDir = path.join(process.cwd(), 'public', 'upload');
const appName = process.env.APPNAME || 'App'
const sharp = require('sharp');


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

app.get('/download', async (req, res) => {
    // Check if the password is correct
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== password) {
        return res.status(401).send('Unauthorized');
    }

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });

    // Good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });

    // Set the headers
    res.attachment('images.zip');

    // Pipe archive data to the response
    archive.pipe(res);

    try {
        const files = await getImages(uploadDir);
        files.forEach(file => {
            const filePath = path.join(uploadDir, file);
            archive.file(filePath, { name: file });
        });

        // Finalize the archive (ie we are done appending files but streams have to finish yet)
        await archive.finalize();
    } catch (error) {
        console.error('Error creating zip file:', error);
        res.status(500).send('Error creating zip file');
    }
});


app.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        for (const file of req.files) {
            const filePath = file.path;
            const optimizedFilePath = path.join(path.dirname(filePath), `optimized_${file.filename}`);

            await sharp(filePath)
                .resize({
                    width: 1920,
                    height: 1080,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toFile(optimizedFilePath);

            // Replace original file with optimized version
            await fs.unlink(filePath);
            await fs.rename(optimizedFilePath, filePath);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error optimizing images:', error);
        res.status(500).send('Error processing images');
    }
});

app.delete('/upload/:filename', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== removePwd) {
        return res.status(401).send('Unauthorized');
    }

    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    const optimizedFilePath = path.join(uploadDir, `optimized_${filename}`);

    try {
        // Delete both original and optimized files if they exist
        await Promise.all([
            fs.unlink(filePath).catch(() => {}),
            fs.unlink(optimizedFilePath).catch(() => {})
        ]);
        res.status(200).send('File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Error deleting file');
    }
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