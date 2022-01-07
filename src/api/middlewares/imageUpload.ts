import { Request } from 'express';
import multer from 'multer';

const imageFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage, fileFilter: imageFilter });

export default upload;
