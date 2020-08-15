const faker = require('faker');
const { Trades, Securities } = require('../../../src/models');
const { TradeType } = require('../../../src/constants/enums');

describe('Trades model', () => {
  describe('Trades validation', () => {
    let trade;
    const security = new Securities({
      ticker: faker.lorem.word().toUpperCase(),
      price: faker.finance.amount(),
    });
    beforeEach(() => {
      trade = {
        email: faker.internet.email().toLowerCase(),
        ticker: security,
        price: faker.finance.amount(),
        quantity: Math.floor(faker.finance.amount(1, 10)),
        type: TradeType.buy,
      };
    });

    test('should correctly validate a security', async () => {
      await expect(new Trades(trade).validate()).resolves.toBeUndefined();
    });

    test('should reject invalid email', async () => {
      trade.email = 'wrongemail@gmail';
      await expect(new Trades(trade).validate()).rejects.toThrow();
    });

    test('should reject invalid quantiy', async () => {
      trade.quantity = 1.1;
      await expect(new Trades(trade).validate()).rejects.toThrow();
      trade.quantity = 0;
      await expect(new Trades(trade).validate()).rejects.toThrow();
    });

    test('should reject if required field is not passed', async () => {
      trade.type = undefined;
      await expect(new Trades(trade).validate()).rejects.toThrow();
    });
  });
});
