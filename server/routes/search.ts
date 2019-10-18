import { Router } from 'express';
import { searchController } from '../controllers';
import { queryLocation } from '../utils/pipes';

class SearchRoute {
  public router: Router = Router();

  constructor() {
    this.router.post(
      '/:query?:category?:from?:to?:condition?:subcategory?:gps?:tag?',
      queryLocation,
      searchController.id
    );
    this.router.get('/:id', searchController.fetchMeta.bind(searchController));
    this.router.get('/:id/:amount', searchController.next);
    this.router.delete('/:id', searchController.remove);
  }
}
export const searchRouter = new SearchRoute().router;
