import { Router } from 'express';
import { authController } from '../controllers';
import { requirePassword, requireAccessToken, requireRefreshToken } from '../utils/validator';
import { queryLocation, assertLocation } from '../utils/pipes';

class AuthRoute {
  public router: Router = Router();

  constructor() {
    this.router.post('/login/:email', queryLocation, authController.signin);
    this.router.post('/', queryLocation, authController.signup);

    this.router.post('/update', requireAccessToken, requirePassword, assertLocation, authController.update);
    this.router.put('/', requireAccessToken, requirePassword, assertLocation, authController.changeSecret);
    this.router.delete('/', requireAccessToken, requirePassword, assertLocation, authController.delete);

    this.router.get('/google/:token', queryLocation, authController.google);
    this.router.get('/facebook/:token', queryLocation, authController.facebook);

    this.router.get('/token', requireRefreshToken, queryLocation, authController.token);
  }
}
export const authRouter = new AuthRoute().router;
