import express, { Request, Response } from 'express';
import imageAPIRoute from './api/images';

const routes = express.Router();
routes.use('/resizeImage', imageAPIRoute);

routes.get('/', (_req: Request, res: Response): void => {
  res.send('API route');
});
export default routes;
