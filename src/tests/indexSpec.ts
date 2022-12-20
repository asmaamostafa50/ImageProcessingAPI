import app from '../index';
import supertest from 'supertest';

const request = supertest(app);

describe('Test endpoint responses', () => {
  const filename = 'fjord';

  it('tests the main endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Image resize app root route');
  });

  it('tests the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe('API route');
  });

  it('tests empty filename', async () => {
    const response = await request.get('/api/resizeImage');
    expect(response.status).toBe(400);
    expect(response.text).toBe('You must send filename');
  });

  it('tests filename not exists', async () => {
    const response = await request.get('/api/resizeImage?filename=test');
    expect(response.status).toBe(404);
    expect(response.text).toBe(
      'Filename not exists, Please enter an exist image'
    );
  });

  it('tests filename exists', async () => {
    const response = await request.get('/api/resizeImage?filename=' + filename);
    expect(response.status).toBe(200);
  });

  it('tests not valid height', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&height=test'
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('Height Must Be Number and Greater Than 0');
  });

  it('tests not valid width', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=test'
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('Width Must Be Number and Greater Than 0');
  });

  it('tests valid height', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&height=120'
    );
    expect(response.status).toBe(200);
  });

  it('tests valid width', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=112'
    );
    expect(response.status).toBe(200);
  });

  it('tests complete valid query', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=113' + '&height=121'
    );
    expect(response.status).toBe(200);
  });

  it('tests complete valid query returned from cache', async () => {
    const response = await request.get(
      '/api/resizeImage?filename=' + filename + '&width=113' + '&height=121'
    );
    expect(response.status).toBe(200);
  });
});
