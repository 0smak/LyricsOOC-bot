import express from 'express';
import indexRoutes from './routes/index';
import cors from 'cors';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(cors());
  }

  routes() {
    this.app.use(indexRoutes);
  }

  start() {
    this.app.listen(this.app.get('port'), () => {
      console.log(`server running on port ${this.app.get('port')}`);
    });
  }
}
const server = new Server();
server.start();
