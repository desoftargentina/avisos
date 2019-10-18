import { Router } from 'express';
import { imageController } from '../controllers';
import { assertLocation } from '../utils/pipes';
import { requireAccessToken } from '../utils/validator';
import multer from 'multer';

class ImageRoute {
  public router: Router = Router();
  multerOpts = multer({ dest: `./${process.env.STORAGE}/tmp/multer` }).single('file');

  constructor() {
    this.router.post('/', requireAccessToken, assertLocation, this.multerOpts, imageController.uploadImage);
    this.router.delete('/:serial', requireAccessToken, assertLocation, imageController.removeImage);
  }
}

export function imageRouter() {
  return new ImageRoute().router;
}
