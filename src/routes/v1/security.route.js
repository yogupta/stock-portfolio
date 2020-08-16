const express = require('express');

const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/security.validation');
const securityController = require('../../controllers/security.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(securityValidation.createSecurity), securityController.createSecurity)
  .get(validate(securityValidation.getSecurities), securityController.getSecurities);

router
  .route('/:securityId')
  .get(validate(securityValidation.getSecurity), securityController.getSecurity)
  .patch(validate(securityValidation.updateSecurity), securityController.updateSecurity);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: Security
 */

/**
 * @swagger
 * path:
 *  /v1/security:
 *    post:
 *      summary: create a security
 *      tags: [Security]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - ticker
 *                - price
 *              properties:
 *                ticker:
 *                  type: string
 *                  description: security/ticker name
 *                price:
 *                  type: number
 *                  description: price of the ticker
 *                  default: 100
 *              example:
 *                ticker: "TCS"
 *                price: 100
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: "array"
 *                properties:
 *                  ticker:
 *                    type: string
 *                    description: security/ticker
 *                  price:
 *                    type: number
 *                    description: price of the ticker
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/security/:securityId:
 *    get:
 *      summary: get security by id
 *      tags: [Security]
 *      parameters:
 *        - name: securityId
 *          in: path
 *          description: securityId
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: security/ticker
 *                  ticker:
 *                    type: string
 *                    description: security/ticker
 *                  price:
 *                    type: number
 *                    description: price of the ticker
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/security/:securityId:
 *    patch:
 *      summary: update security price. only price updation is allowed.
 *      tags: [Security]
 *      parameters:
 *        - name: securityId
 *          in: path
 *          description: securityId
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
 *                    description: updated price of the ticker
 *        "400":
 *          description: Bad Request
 */

/**
 * @swagger
 * path:
 *  /v1/security:
 *    get:
 *      summary: get all securities
 *      tags: [Security]
 *      parameters:
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
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  ticker:
 *                    type: string
 *                    description: security/ticker
 *                  price:
 *                    type: number
 *                    description: price of the ticker
 *        "400":
 *          description: Bad Request
 */
