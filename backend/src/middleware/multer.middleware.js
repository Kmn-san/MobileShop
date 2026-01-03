import multer from "multer"
import path from 'path'

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// filefilter: jpeg,jpg,png,webp

const fileFilter = (req, res, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimeType = allowedTypes.text(file.mimeType)

    if (extname && mimeType) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowred (jpeg,jpg,png,webp"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})