const multer = require('multer');

// store in memory for direct upload to cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
