import { Request, Response } from 'express';
import { generateSerial } from '../utils';
import { rename, unlinkSync, existsSync } from 'fs';
import { sync as assertDir } from 'mkdirp';

class ImageController {
  removeImage(req: Request, res: Response) {
    if (!req.params.serial) return res.status(400).send('No image serial provided');
    const path = `./${process.env.STORAGE}/tmp/img/${req.params.serial}`;

    // Unlink img
    unlinkSync(`${path}`);
  }

  uploadImage(req: Request, res: Response) {
    const tempPath = req.file.path;
    const serial = generateSerial('tmp/img');
    const localPath = `./${process.env.STORAGE}/tmp/img`;

    if (!existsSync(localPath)) assertDir(localPath);

    rename(tempPath, `${localPath}/${serial}`, err => {
      if (err) return res.status(500).send(err);
      res.send({serial});
      // Queda a responsabilidad de quién use la imagen en sacarla de tmp
    });
  }
}
export const imageController = new ImageController();
