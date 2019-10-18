import { Router } from 'express';
import { userController } from '../controllers';
import { requireAccessToken } from '../utils/validator';
import { queryLocation } from '../utils/pipes';

class UserRoute {
  public router: Router = Router();

  constructor() {
    this.router.get('/preview/:id', queryLocation, userController.preview);
    this.router.get('/', requireAccessToken, queryLocation, userController.info);
  }
}
export const userRouter = new UserRoute().router;
