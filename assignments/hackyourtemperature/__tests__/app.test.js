require('dotenv').config();
const app = require('../app.js');
const supertest = require('supertest');

const request = supertest(app);

describe('POST /weather', () => {
  it('should return 400 if no cityName is provided', async () => {
    const response = await request.post('/weather').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'City name cannot be empty.',
    });
  });

  it('should return 404 if cityName is wrong written', async () => {
    const response = await request
      .post('/weather')
      .send({ cityName: 'aslkdjflaskjd' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'City not found.' });
  });

  it('should return 200 with correct cityName', async () => {
    const response = await request
      .post('/weather')
      .send({ cityName: 'Amsterdam' });
    expect(response.status).toBe(200);
    expect(response.body.weatherText).toContain('Amsterdam');
  });
});
