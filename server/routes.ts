import * as express from 'express';
import * as jwt from 'express-jwt';

import CatController from './controllers/CatController';
import UserController from './controllers/UserController';
// import cat from './models/cat';
// import user from './models/user';

export default function routes(app) {

  const router = express.Router();

  const auth = jwt({
    secret: process.env.SECRET_TOKEN,
    requestProperty: 'auth',
    credentialsRequired: false
  });

  const isLogged = (req, res, next) => {
    if (!req.auth || !req.auth.user) {
      res.status(401).send('invalid token');
    } else {
      next();
    }
  };

  const isAdmin = (req, res, next) => {
    if (!req.auth || !req.auth.user || req.auth.user.role != 'admin') {
      res.status(401).send('invalid token');
    } else {
      next();
    }
  };

  const cat = new CatController();
  const user = new UserController();

  // cats
  router.route('/cats').get(cat.getAll);
  router.route('/cats/count').get(cat.count);
  router.route('/cat/:id').get(cat.get);

  // cats (logged)
  router.route('/cat').post(isLogged, cat.insert);
  router.route('/cat/:id').put(isLogged, cat.update);
  router.route('/cat/:id').delete(isLogged, cat.delete);

  // users
  router.route('/login').post(user.login);
  router.route('/user/:id').get(user.get);

  // users (admin)
  router.route('/users').get(isAdmin, user.getAll);
  router.route('/users/count').get(isAdmin, user.count);
  router.route('/user').post(isAdmin, user.insert);
  router.route('/user/:id').put(isAdmin, user.update);
  router.route('/user/:id').delete(isAdmin, user.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', auth, router);

}
