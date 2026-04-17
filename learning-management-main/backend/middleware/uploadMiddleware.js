const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/course-materials')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = new Set([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
    ]);
    const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt']);
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(extension)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, and TXT files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = upload;
