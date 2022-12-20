import app from '../index';
import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import { getImagesPath } from '../utils/utils';

const imagesPath = path.join(getImagesPath(), 'resized');
const request = supertest(app);

describe('Test endpoint responses', (): void => {
  const filename = 'fjord';

  it('tests the main endpoint', async (): Promise<void> => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Image resize app root route');
  });

  it('tests the api endpoint', async (): Promise<void> => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe('API route');
  });

  it('tests empty filename', async (): Promise<void> => {
    const response = await request.get('/api/resizeImage');
    expect(response.status).toBe(400);
    expect(response.text).toBe('You must send filename');
  });

  it('tests filename not exists', async (): Promise<void> => {
    const response = await request.get('/api/resizeImage?filename=test');
    expect(response.status).toBe(404);
    expect(response.text).toBe(
      'Filename not exists, Please enter an exist image'
    );
  });

  it('tests filename exists', async (): Promise<void> => {
    const response = await request.get('/api/resizeImage?filename=' + filename);
    expect(response.status).toBe(200);
  });

  it('tests not valid height', async (): Promise<void> => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&height=test'
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('Height Must Be Number and Greater Than 0');
  });

  it('tests not valid width', async (): Promise<void> => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=test'
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('Width Must Be Number and Greater Than 0');
  });

  it('tests valid height', async (): Promise<void> => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&height=120'
    );
    expect(response.status).toBe(200);
  });

  it('tests valid width', async (): Promise<void> => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=112'
    );
    expect(response.status).toBe(200);
  });

  it('tests for image processing', async (): Promise<void> => {
    const newfilename = filename + '-height121-width113.jpg';
    let exists = false;
    fs.existsSync(path.join(imagesPath, newfilename));
    {
      fs.unlinkSync(path.join(imagesPath, newfilename));
    }
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=113' + '&height=121'
    );

    if (fs.existsSync(path.join(imagesPath, newfilename))) {
      exists = true;
    }
    expect(response.status).toBe(200);
    expect(exists).toBe(true);
  });

  it('tests for image processing returned from cache', async (): Promise<void> => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=113' + '&height=121'
    );
    expect(response.status).toBe(200);
  });
});
