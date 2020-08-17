const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../setUpTestDB');
const { Securities, Trades } = require('../../src/models');
const { TradeType } = require('../../src/constants/enums');

setupTestDB();

describe('Securities Trades', () => {
  const insertManySecurities = (securities) => Securities.insertMany(securities);

  const getFakeTrade = (email, tickerId, type) => ({
    _id: mongoose.Types.ObjectId(),
    email,
    ticker: tickerId,
    price: parseFloat(faker.finance.amount()),
    quantity: parseInt(faker.finance.amount(1, 100), 10),
    type: TradeType[type],
  });

  const insertManyTrades = (trades) => Trades.insertMany(trades);

  const security = {
    _id: mongoose.Types.ObjectId(),
    ticker: faker.lorem.word().toUpperCase(),
    price: parseFloat(faker.finance.amount()),
  };
  const security1 = {
    _id: mongoose.Types.ObjectId(),
    ticker: faker.lorem.word().toUpperCase(),
    price: parseFloat(faker.finance.amount()),
  };
  const security2 = {
    _id: mongoose.Types.ObjectId(),
    ticker: faker.lorem.word().toUpperCase(),
    price: parseFloat(faker.finance.amount()),
  };

  insertManySecurities([security, security1, security2]);

  let buyTrade1;
  let buyTrade2;
  let buyTrade3;
  let sellTrade1;
  let sellTrade2;
  let sellTrade3;

  beforeEach(() => {
    const email = faker.internet.email().toLowerCase();
    buyTrade1 = getFakeTrade(email, security._id.toHexString(), TradeType.buy);
    buyTrade2 = getFakeTrade(email, security._id.toHexString(), TradeType.buy);
    buyTrade3 = getFakeTrade(email, security._id.toHexString(), TradeType.buy);
    sellTrade1 = getFakeTrade(email, security._id.toHexString(), TradeType.sell);
    sellTrade2 = getFakeTrade(email, security._id.toHexString(), TradeType.sell);
    sellTrade3 = getFakeTrade(email, security._id.toHexString(), TradeType.sell);
  });

  describe('POST /v1/trade', () => {
    test('should return 201 and successfully create new trade if data is ok', async () => {
      buyTrade1._id = undefined;
      sellTrade1._id = undefined;

      const res1 = await request(app).post('/v1/trade').send(buyTrade1).expect(httpStatus.CREATED);
      const res2 = await request(app).post('/v1/trade').send(sellTrade1).expect(httpStatus.CREATED);

      expect(res1.body).toEqual({
        id: expect.anything(),
        email: buyTrade1.email,
        ticker: buyTrade1.ticker,
        price: buyTrade1.price,
        quantity: buyTrade1.quantity,
        type: TradeType.buy,
      });
      expect(res2.body).toEqual({
        id: expect.anything(),
        email: sellTrade1.email,
        ticker: sellTrade1.ticker,
        price: sellTrade1.price,
        quantity: sellTrade1.quantity,
        type: TradeType.sell,
      });

      const dbTradeBuy = await Trades.findById(res1.body.id);
      expect(dbTradeBuy).toBeDefined();
      expect(dbTradeBuy).toMatchObject({
        email: buyTrade1.email,
        ticker: security._id,
        price: buyTrade1.price,
        quantity: buyTrade1.quantity,
        type: TradeType.buy,
      });

      const dbTradeSell = await Trades.findById(res2.body.id);
      expect(dbTradeSell).toBeDefined();
      expect(dbTradeSell).toMatchObject({
        email: sellTrade1.email,
        ticker: security._id,
        price: sellTrade1.price,
        quantity: sellTrade1.quantity,
        type: TradeType.sell,
      });
    });

    test('should return 400 error if trade is invalid', async () => {
      buyTrade2.ticker = '';

      await request(app).post('/v1/trade').send(security).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if trade quantity is invalid', async () => {
      buyTrade2.quantity = 0.2;

      await request(app).post('/v1/trade').send(security).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if email is not prsent', async () => {
      buyTrade3.email = '';

      await request(app).post('/v1/trade').send(security).expect(httpStatus.BAD_REQUEST);
    });

    test('should correctly apply filter on email field', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const res = await request(app).get('/v1/trade').query({ email: buyTrade1.email }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(6);
      expect(res.body.results[0].id).toBe(buyTrade1._id.toHexString());
    });

    test('should correctly apply filter on email and type field', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const res = await request(app)
        .get('/v1/trade')
        .query({ email: buyTrade1.email, type: TradeType.buy })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(buyTrade1._id.toHexString());
    });

    test('should return 400 error if nothing is specified in query to get all trades', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);

      await request(app).get('/v1/trade').query({}).send().expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/trade/user/:emailId', () => {
    test('should return 200 and the trade object if data is ok', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);

      const res = await request(app).get(`/v1/trade/user/${buyTrade1.email}`).send().expect(httpStatus.OK);

      expect(res.body).toHaveLength(6);
    });
  });

  describe('GET /v1/trade/:tradeId', () => {
    test('should return 200 and the trade object if data is ok', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);

      const res = await request(app).get(`/v1/trade/${buyTrade1._id}`).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: buyTrade1._id.toHexString(),
        email: buyTrade1.email,
        ticker: security._id.toHexString(),
        price: buyTrade1.price,
        quantity: buyTrade1.quantity,
        type: TradeType.buy,
      });
    });
  });

  describe('PATCH /v1/trade/:tradeId', () => {
    test('should return 200 and successfully update trade if price is ok', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const updateBody = {
        price: parseFloat(faker.finance.amount()),
      };

      const res = await request(app).patch(`/v1/trade/${buyTrade1._id}`).send(updateBody).expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: buyTrade1._id.toHexString(),
        email: buyTrade1.email,
        ticker: security._id.toHexString(),
        price: updateBody.price,
        quantity: buyTrade1.quantity,
        type: TradeType.buy,
      });

      const dbTrade = await Trades.findById(buyTrade1._id.toHexString());
      expect(dbTrade).toBeDefined();
      const dbTrade1 = {
        id: dbTrade._id.toHexString(),
        email: dbTrade.email,
        ticker: dbTrade.ticker.toHexString(),
        price: dbTrade.price,
        quantity: dbTrade.quantity,
        type: dbTrade.type,
      };

      expect(dbTrade1).toMatchObject({
        id: buyTrade1._id.toHexString(),
        email: buyTrade1.email,
        ticker: security._id.toHexString(),
        price: updateBody.price,
        quantity: buyTrade1.quantity,
        type: TradeType.buy,
      });
    });

    test('should return 200 and successfully update trade if data is ok', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const updateBody = {
        price: parseFloat(faker.finance.amount()),
        quantity: parseInt(faker.finance.amount(1, 100), 10),
        type: TradeType.sell,
      };

      const res = await request(app).patch(`/v1/trade/${buyTrade2._id}`).send(updateBody).expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: buyTrade2._id.toHexString(),
        email: buyTrade2.email,
        ticker: security._id.toHexString(),
        price: updateBody.price,
        quantity: updateBody.quantity,
        type: updateBody.type,
      });

      const dbTrade = await Trades.findById(buyTrade2._id.toHexString());

      expect(dbTrade).toBeDefined();

      const dbTrade1 = {
        id: dbTrade._id.toHexString(),
        email: dbTrade.email,
        ticker: dbTrade.ticker.toHexString(),
        price: dbTrade.price,
        quantity: dbTrade.quantity,
        type: dbTrade.type,
      };

      expect(dbTrade1).toMatchObject({
        email: buyTrade2.email,
        ticker: security._id.toHexString(),
        price: updateBody.price,
        quantity: updateBody.quantity,
        type: updateBody.type,
      });
    });

    test('should return 400 error if email is updated', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const updateBody = { email: 'update@example.com' };

      await request(app).patch(`/v1/trade/${buyTrade1._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if ticker is updated', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const updateBody = { ticker: security1._id.toHexString() };

      await request(app).patch(`/v1/trade/${buyTrade1._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if price is not passed', async () => {
      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);
      const updateBody = {};

      await request(app).patch(`/v1/trade/${buyTrade1._id}`).send(updateBody).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/trade/holdings/user/:emailId', () => {
    test('should return 200 and the trade object if data is ok', async () => {
      await insertManySecurities([security, security1, security2]);

      buyTrade1.quantity = 10;
      buyTrade2.quantity = 2;
      buyTrade3.ticker = security1._id.toHexString();
      sellTrade1.quantity = 3;
      sellTrade2.quantity = 3;
      sellTrade3.quantity = 3;

      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);

      const avgBuyPriceOfSecurity1 = (buyTrade1.price * 10 + buyTrade2.price * 2) / 12;
      const res = await request(app).get(`/v1/trade/holdings/user/${buyTrade1.email}`).send().expect(httpStatus.OK);

      expect(res.body).toHaveLength(2);

      const ticker1 = res.body.find((entry) => entry.ticker === security.ticker);
      const ticker2 = res.body.find((entry) => entry.ticker === security1.ticker);

      expect(ticker1.quantity).toEqual(3);
      expect(ticker1.averageBuyPrice).toEqual(avgBuyPriceOfSecurity1);
      expect(ticker2.quantity).toEqual(buyTrade3.quantity);
      expect(Math.floor(ticker2.averageBuyPrice)).toEqual(Math.floor(buyTrade3.price));
    });
  });

  describe('GET /v1/trade/returns/user/:emailId', () => {
    test('should return 200 and the trade object if data is ok', async () => {
      await insertManySecurities([security, security1, security2]);

      buyTrade1.quantity = 10;
      buyTrade2.quantity = 2;
      buyTrade3.ticker = security1._id.toHexString();
      sellTrade1.quantity = 3;
      sellTrade2.quantity = 3;
      sellTrade3.quantity = 3;

      await insertManyTrades([buyTrade1, buyTrade2, buyTrade3, sellTrade1, sellTrade2, sellTrade3]);

      const avgBuyPriceOfSecurity1 = (buyTrade1.price * 10 + buyTrade2.price * 2) / 12;
      const avgBuyPriceOfSecurity2 = buyTrade3.price;
      const res = await request(app).get(`/v1/trade/returns/user/${buyTrade1.email}`).send().expect(httpStatus.OK);

      const expectedReturns =
        (security.price - avgBuyPriceOfSecurity1) * 3 + (security1.price - avgBuyPriceOfSecurity2) * buyTrade3.quantity;

      expect(res.body).toEqual({
        returns: expectedReturns,
      });
    });
  });
});
