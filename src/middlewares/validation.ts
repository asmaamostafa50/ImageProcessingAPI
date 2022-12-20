import path from 'path';
import { getImagesPath } from '../utils/utils';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const imagesPath = getImagesPath();

export const dimensionsValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { height, width } = req.query;
  if (height && !(parseInt(height as string) > 0)) {
    res.status(400).send('Height Must Be Number and Greater Than 0');
  } else if (width && !(parseInt(width as string) > 0)) {
    res.status(400).send('Width Must Be Number and Greater Than 0');
  } else {
    next();
  }
};

export const imageValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { filename } = req.query;

  if (!filename) {
    res.status(400).send('You must send filename');
  } else {
    const images = fs
      .readdirSync(imagesPath)
      .filter(
        (item) => !fs.lstatSync(path.join(imagesPath, item)).isDirectory()
      )
      .map((item) => item.replace('.jpg', ''));

    //console.log(images);

    if (images.includes(filename as string)) next();
    else
      res.status(404).send('Filename not exists, Please enter an exist image');
  }
};
