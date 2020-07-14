import {Router} from 'express';

class IndexRoutes {
  router: Router;
  constructor() {
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
