const express = require('express');

const validate = require('../../middlewares/validate');
const tradeValidation = require('../../validations/trade.validation');
const tradeController = require('../../controllers/trade.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(tradeValidation.createTrade), tradeController.createTrade)
  .get(validate(tradeValidation.getTrades), tradeController.getTrades);

router
  .route('/:tradeId')
  .get(validate(tradeValidation.getTrade), tradeController.getTrade)
  .patch(validate(tradeValidation.updateTrade), tradeController.updateTrade);

router.route('/user/:emailId').get(validate(tradeValidation.getTradesOfUser), tradeController.getTradeByEmail);

router.route('/portfolio/user/:emailId').get(validate(tradeValidation.getPortFolio), tradeController.getPortFolio);

router.route('/returns/user/:emailId').get(validate(tradeValidation.getReturns), tradeController.getReturns);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Trade
 *   description: Trade
 */

/**
 * @swagger
 * path:
 *  /v1/trade:
 *    post:
 *      summary: create a trade
 *      tags: [Trade]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - ticker
 *                - price
 *                - quantity
 *                - type
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                ticker:
 *                  type: string
 *                  description: security/ticker id
 *                price:
 *                  type: number
 *                  description: price at which a share is purchased/ sold
 *                quantity:
 *                  type: number
 *                  description: how many shares purchased or sold
 *                type:
 *                  type: string
 *                  description: buy or sell
 *              example:
 *                email: fake@example.com
 *                ticker: tickerId
 *                price: 100
 *                quantity: 2
 *                type: buy
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                   type: string
 *                   format: email
 *                  ticker:
 *                    type: string
 *                    description: security/ticker id
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade/:tradeId:
 *    get:
 *      summary: get trade by id
 *      tags: [Trade]
 *      parameters:
 *        - name: tradeId
 *          in: path
 *          description: tradeId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                   type: string
 *                   format: email
 *                  ticker:
 *                    type: string
 *                    description: security/ticker id
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade/:tradeId:
 *    patch:
 *      summary: update trade. only price, quantity and type of trade(buy/sell) is allowed to be updated.
 *      tags: [Trade]
 *      parameters:
 *        - name: tradeId
 *          in: path
 *          description: tradeId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade:
 *    get:
 *      summary: get all trades in db. only for testing purpose.
 *      tags: [Trade]
 *      parameters:
 *        - name: email
 *          in: query
 *          description: trade done by user(email)
 *        - name: sortBy
 *          in: query
 *          description: asec  or desc
 *        - name: limit
 *          in: query
 *          description: limit result returned
 *        - name: ticker
 *          in: query
 *          description: get ticker by ticker name
 *        - name: page
 *          in: query
 *          description: page no
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: "array"
 *                properties:
 *                  email:
 *                   type: string
 *                   format: email
 *                  ticker:
 *                    type: string
 *                    description: security/ticker id
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade/user/:emailId:
 *    get:
 *      summary: get trades done by user of emailId
 *      tags: [Trade]
 *      parameters:
 *        - name: emailId
 *          in: path
 *          description: emailId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                properties:
 *                  email:
 *                   type: string
 *                   format: email
 *                  ticker:
 *                    type: string
 *                    description: security/ticker id
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade/portfolio/user/:emailId:
 *    get:
 *      summary: get portfolio of user of emailId
 *      tags: [Trade]
 *      parameters:
 *        - name: emailId
 *          in: path
 *          description: emailId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                properties:
 *                  email:
 *                   type: string
 *                   format: email
 *                  ticker:
 *                    type: string
 *                    description: security/ticker id
 *                  price:
 *                    type: number
 *                    description: price at which a share is purchased/ sold
 *                  quantity:
 *                    type: number
 *                    description: how many shares purchased or sold
 *                  type:
 *                    type: string
 *                    description: buy or sell
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/trade/returns/user/:emailId:
 *    get:
 *      summary: get returns of user of emailId
 *      tags: [Trade]
 *      parameters:
 *        - name: emailId
 *          in: path
 *          description: emailId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  returns:
 *                   type: number
 *        "400":
 *          description: Bad Request
 */
