const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const { parse } = require('path');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static('./uploads'));

app.get('/', (req, res) => {
  return res.json({ message: 'Hello world 🔥🇵🇹  ' });
});

app.post('/', upload.single('picture'), async (req, res) => {
  fs.access('./uploads', (error) => {
    if (error) {
      fs.mkdirSync('./uploads');
    }
  });
  const { buffer, originalname } = req.file;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile('./uploads/' + originalname);
  // .toFile('./uploads/' + parse(originalname).name + '.webp');
  const link = `http://localhost:3000/${ref}`;
  return res.json({ link });
});

app.listen(3002);
