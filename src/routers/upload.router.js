const { join } = require('node:path');
const { Router } = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '..', '..', 'public'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        '.' +
        file.mimetype.split('image/')[1]
    );
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post('/', upload.single('image'), (req, res) =>
  res.send({ data: req.file })
);

module.exports = router;
