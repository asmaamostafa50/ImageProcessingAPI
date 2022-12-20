import { Request, Response, NextFunction } from 'express';

export const logger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { url, method }: { url: string; method: string } = req;
  console.log(`visited ${url}. With method ${method}`);
  next();
};
