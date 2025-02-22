import multer from "multer";
import path from "path"

// Set up multer storage configuration to save files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where images should be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a unique name based on the current timestamp
  }
});

export const upload = multer({ storage: storage }); // 'avatar' is the field name in the form
