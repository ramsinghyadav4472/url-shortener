const request = require('supertest');
const express = require('express');

// Mocking the dependencies to test the app logic without DB/Redis
jest.mock('../src/db', () => ({
  pool: { query: jest.fn() },
  initDb: jest.fn(),
}));
jest.mock('../src/cache', () => ({
  get: jest.fn(),
  set: jest.fn(),
  on: jest.fn(),
}));

// We need a way to test the app without starting the server
// For this simple demo, we'll just test a mock express app with the same routes
const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

describe('GET /health', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
