import multer from 'multer';

class Multer {
    storage: any;
    fileFilter: any;
    constructor (direktori: string) {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `public/uploads/${direktori}`)
            },
            filename: (req, file, cb) => {
                cb(null, new Date().getTime() + '-' + file.originalname)
            }
        })
        this.fileFilter = (req: any, file: any, cb: any) => {
            if (
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'application/msword' ||
                file.mimetype === 'application/pdf'
            ) {
                cb(null, true)
            } else {
                cb(new Error('File format harus extentions image atau pdf'), false)
            }
        }
    }

    public upload = () => multer({
        storage: this.storage,
        fileFilter: this.fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB
        }
    })
}

export default Multer;