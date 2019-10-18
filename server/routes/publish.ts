import { Router } from 'express';
import { publishController } from '../controllers';
import { acceptAccessToken, requireAccessToken, checkAdmin } from '../utils/validator';
import { assertLocation, queryLocation } from '../utils/pipes';

class PublishRoute {
  public router: Router = Router();

  constructor() {
    this.router.get('/:id', acceptAccessToken, queryLocation, publishController.details);
    this.router.get('/description/:id', queryLocation, publishController.description);
    this.router.post('/', requireAccessToken, assertLocation, publishController.save.bind(publishController));
    this.router.get('/approve/:id', requireAccessToken, checkAdmin, assertLocation, publishController.approve);
    this.router.get('/pause/:id', requireAccessToken, assertLocation, publishController.pause);
    this.router.get('/resume/:id', requireAccessToken, assertLocation, publishController.resume);

    this.router.get('/list/:page/:size/:sort/:direction', requireAccessToken, assertLocation, publishController.list);
    this.router.get('/list/count', requireAccessToken, assertLocation, publishController.countList);
    this.router.get(
      '/list/all/:page/:size/:sort/:direction',
      requireAccessToken, checkAdmin, assertLocation, publishController.listAll
    );
    this.router.get('/list/all/count', requireAccessToken, checkAdmin, assertLocation, publishController.countListAll);
  }
}
export const publishRouter = new PublishRoute().router;
