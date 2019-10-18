import { Router } from 'express';
import { apiController } from '../controllers';
import { queryLocation } from '../utils/pipes';

class ApiRoute {
  public router: Router = Router();

  constructor() {
    this.router.get('/typeahead/:lookup/:count', queryLocation, apiController.typeahead);
  }
}
export const apiRouter = new ApiRoute().router;
