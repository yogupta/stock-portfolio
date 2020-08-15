const faker = require('faker');
const { Securities } = require('../../../src/models');

describe('Securities model', () => {
  describe('Securites validation', () => {
    let security;
    beforeEach(() => {
      security = {
        ticker: faker.lorem.word().toUpperCase(),
        price: faker.finance.amount(),
      };
    });

    test('should correctly validate a security', async () => {
      await expect(new Securities(security).validate()).resolves.toBeUndefined();
    });

    test('should reject empty ticker', async () => {
      security.ticker = '';
      await expect(new Securities(security).validate()).rejects.toThrow();
    });

    test('should set default 100 for price', async () => {
      security.price = undefined;
      await expect(new Securities(security).toJSON().price).toBe(100);
    });
  });
});
