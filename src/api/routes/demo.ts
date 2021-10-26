import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/demo', route);

  route.get('/noauth', (req: Request, res: Response) => {
    return res.json({ response: "This is just a demo response." }).status(200);
  });
}
