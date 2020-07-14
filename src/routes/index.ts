import {Router} from 'express';

class IndexRoutes {
  router: Router;
  constructor() {
    // eslint-disable-next-line new-cap
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('/', (req, res) => res.status(200).send('hola mundo!'));
  }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;
