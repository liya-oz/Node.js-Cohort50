import request from 'supertest';
import app from '../server.js';

describe('POST /weather', () => {
  it('should return an error if cityName is missing', async () => {
    const response = await request(app).post('/weather').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing field: cityName');
  });

  it('should return weather data when a valid cityName is provided', async () => {
    const response = await request(app)
      .post('/weather')
      .send({ cityName: 'London' });
    expect(response.status).toBe(200);
    expect(response.body.weatherText).toMatch(/Weather data for London/);
  });

  it('should return an error if the city is not found', async () => {
    const response = await request(app)
      .post('/weather')
      .send({ cityName: 'InvalidCityName' });
    expect(response.status).toBe(404);
    expect(response.body.weatherText).toBe(
      "City 'InvalidCityName' is not found!",
    );
  });

  it('should handle unexpected errors', async () => {
    jest.mock('../sources/keys.js', () => ({
      API_KEY: 'invalid-api-key',
    }));

    const response = await request(app)
      .post('/weather')
      .send({ cityName: 'London' });
    expect(response.status).toBe(500);
    expect(response.body.weatherText).toBe(
      'Failed to fetch weather data. Please try again later.',
    );
  });
});
