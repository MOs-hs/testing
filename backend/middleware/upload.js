const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/services', 'uploads/profiles', 'uploads/certificates', 'uploads/cvs'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Determine upload path based on field name
        if (file.fieldname === 'serviceImage') {
            uploadPath += 'services/';
        } else if (file.fieldname === 'profileImage') {
            uploadPath += 'profiles/';
        } else if (file.fieldname === 'certificate') {
            uploadPath += 'certificates/';
        } else if (file.fieldname === 'cv') {
            uploadPath += 'cvs/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    }
});

// File filter - only allow images
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// File filter - allow images and PDFs (for certificates)
const documentFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image and PDF files are allowed'));
    }
};

// Create multer instances
const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
    fileFilter: imageFilter
});

const uploadDocument = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    },
    fileFilter: documentFilter
});

// Middleware for single image upload
const uploadSingleImage = (fieldName) => {
    return uploadImage.single(fieldName);
};

// Middleware for multiple images upload
const uploadMultipleImages = (fieldName, maxCount = 5) => {
    return uploadImage.array(fieldName, maxCount);
};

// Middleware for document upload
const uploadSingleDocument = (fieldName) => {
    return uploadDocument.single(fieldName);
};

module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
    uploadSingleDocument,
    uploadImage,
    uploadDocument
};
