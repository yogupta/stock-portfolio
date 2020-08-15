const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../setUpTestDB');
const { Securities } = require('../../src/models');

setupTestDB();

describe('Securities routes', () => {
  let security;
  let security1;
  let security2;

  beforeEach(() => {
    security = {
      _id: mongoose.Types.ObjectId(),
      ticker: faker.lorem.word().toUpperCase(),
      price: parseFloat(faker.finance.amount()),
    };
    security1 = {
      _id: mongoose.Types.ObjectId(),
      ticker: faker.lorem.word().toUpperCase(),
      price: parseFloat(faker.finance.amount()),
    };
    security2 = {
      _id: mongoose.Types.ObjectId(),
      ticker: faker.lorem.word().toUpperCase(),
      price: parseFloat(faker.finance.amount()),
    };
  });
  const insertMany = (securities) => Securities.insertMany(securities);

  describe('POST /v1/security', () => {
    test('should return 201 and successfully create new security if data is ok', async () => {
      security._id = undefined;
      const res = await request(app).post('/v1/security').send(security).expect(httpStatus.CREATED);

      expect(res.body).toEqual({ id: expect.anything(), ticker: security.ticker, price: security.price });

      const dbSecurity = await Securities.findById(res.body.id);
      expect(dbSecurity).toBeDefined();
      expect(dbSecurity).toMatchObject({ ticker: security.ticker, price: security.price });
    });

    test('should return 400 error if ticker is invalid', async () => {
      security.ticker = '';

      await request(app).post('/v1/security').send(security).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if ticker is already used', async () => {
      await Securities.create(security);

      await request(app).post('/v1/security').send(security).expect(httpStatus.BAD_REQUEST);
    });

    test('should correctly apply filter on ticker field', async () => {
      await insertMany([security, security1, security2]);
      const res = await request(app).get('/v1/security').query({ ticker: security.ticker }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(security._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertMany([security, security1, security2]);

      const res = await request(app).get('/v1/security').query({ limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(security._id.toHexString());
      expect(res.body.results[1].id).toBe(security1._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertMany([security, security1, security2]);

      const res = await request(app).get('/v1/security').query({ page: 2, limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(security2._id.toHexString());
    });
  });

  describe('GET /v1/security/:securityId', () => {
    test('should return 200 and the security object if data is ok', async () => {
      await insertMany([security]);

      const res = await request(app).get(`/v1/security/${security._id}`).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: security._id.toHexString(),
        ticker: security.ticker,
        price: security.price,
      });
    });
  });

  describe('PATCH /v1/security/:securityId', () => {
    test('should return 200 and successfully update security if data is ok', async () => {
      await insertMany([security]);
      const updateBody = {
        price: parseFloat(faker.finance.amount()),
      };

      const res = await request(app).patch(`/v1/security/${security._id}`).send(updateBody).expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: security._id.toHexString(),
        ticker: security.ticker,
        price: updateBody.price,
      });

      const dbSecurity = await Securities.findById(security._id);
      expect(dbSecurity).toBeDefined();
      expect(dbSecurity).toMatchObject({ ticker: security.ticker, price: updateBody.price });
    });

    test('should return 400 error if ticker is updated', async () => {
      await insertMany([security]);
      const updateBody = { ticker: security.ticker };

      await request(app).patch(`/v1/security/${security._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if price is not passed', async () => {
      await insertMany([security]);
      const updateBody = {};

      await request(app).patch(`/v1/security/${security._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });
  });
});
