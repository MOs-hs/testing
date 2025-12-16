const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Delete file helper
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logger.info(`File deleted: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        logger.error(`Error deleting file: ${error.message}`);
        return false;
    }
};

// Delete multiple files
const deleteFiles = (filePaths) => {
    if (!Array.isArray(filePaths)) {
        filePaths = [filePaths];
    }

    filePaths.forEach(filePath => {
        deleteFile(filePath);
    });
};

// Get file extension
const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

// Validate file size
const isValidFileSize = (fileSize, maxSize = 5 * 1024 * 1024) => {
    return fileSize <= maxSize;
};

// Validate image file
const isValidImage = (filename) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = getFileExtension(filename);
    return validExtensions.includes(ext);
};

// Get file URL
const getFileUrl = (req, filename) => {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}/${filename}`;
};

// Extract filename from URL
const getFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
};

module.exports = {
    deleteFile,
    deleteFiles,
    getFileExtension,
    isValidFileSize,
    isValidImage,
    getFileUrl,
    getFilenameFromUrl,
};
