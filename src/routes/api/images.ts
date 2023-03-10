import express, { Request, Response } from 'express';
import { logger } from '../../middlewares/logger';
import {
  imageValidation,
  dimensionsValidation
} from '../../middlewares/validation';
import { handleImage } from '../../utils/utils';

const imageAPIRoute = express.Router();
imageAPIRoute.use([logger, imageValidation, dimensionsValidation]);

imageAPIRoute.get('/', async (req: Request, res: Response): Promise<void> => {
  const imagesPath = await handleImage(req.query);
  //console.log('here', imagesPath);
  res.sendFile(imagesPath);
});

export default imageAPIRoute;
