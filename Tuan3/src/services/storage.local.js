
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        cb(null, `${uuid()}${ext}`);
    }
});

export const upload = multer({ storage });

export function getPublicUrl(filename, baseUrl) {
    return `${baseUrl}/uploads/${filename}`;
}
``
