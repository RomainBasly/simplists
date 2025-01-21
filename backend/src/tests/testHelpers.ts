import request from 'supertest';
import app from '../app';

export const apiPostRequest = (url: string) => {
  return request(app).post(url).set('X-API-KEY', `${process.env.BACKEND_API_KEY}`);
};

export const apiGetRequest = (url: string) => {
  return request(app).get(url).set('X-API-KEY', `${process.env.BACKEND_API_KEY}`);
};
