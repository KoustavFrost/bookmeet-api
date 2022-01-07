import { Router, Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';

const route = Router();

export default (app: Router) => {
  app.use('/demo', route);

  route.get('/test', (req: Request, res: Response) => {
    const demo = new Schema({
      text: String,
    });
    return res.json({ response: 'This is just a demo response.' }).status(200);
  });
};
