import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import listing from './routes/Listing.route';
// This is the demo route
// import demo from './routes/demo';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  // demo(app);
  listing(app);

  return app;
};
