import express from 'express';
import { decorateRouter } from '@awaitjs/express';
import { BadRequestError, NotFoundError } from '../../infrastructure/errors';

const router = decorateRouter(express.Router());

/**
 * @openapi
 * definitions:
 *   ArticleV1:
 *     required:
 *       - identifier
 *       - identifierType
 *       - name
 *       - description
 *     properties:
 *       identifier:
 *         type: string
 *       identifierType:
 *         type: string
 *         enum:
 *           - ean13
 *           - custom
 *       name:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @openapi
 * tags:
 *   name: Articles V1
 *   description: Posting and getting articles
 */

/**
 * @openapi
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - Articles V1
 *     produces:
 *       - application/json
 *     description: Gets a list of all articles.
 *     summary: Gets all articles.
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ArticleV1'
 */
router.getAsync('/', async (req: express.Request, res: express.Response) => {
    // TODO
});

/**
 * @openapi
 * /api/v1/articles/{articleIdentifier}:
 *   get:
 *     tags:
 *       - Articles V1
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: articleIdentifier
 *         schema:
 *           type: string
 *         required: true
 *         description: Article identifier
 *     description: Gets the article with the given identifier.
 *     summary: Gets one article.
 *     responses:
 *       200:
 *         description: The article with the given identifier.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ArticleV1'
 *       404:
 *         description: The article was not found.
 */
router.getAsync('/:id', async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    if (id !== NaN) {
        // TODO
    }

    throw new NotFoundError();
});

/**
 * @openapi
 * /api/v1/articles:
 *   post:
 *     tags:
 *       - Articles V1
 *     description: Adds a new article with article number, name and description.
 *     summary: Create new article.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/ArticleV1'
 *     responses:
 *       200:
 *         description: Article was added successfully.
 */
router.postAsync('/', async (req: express.Request, res: express.Response) => {
    // TODO

    throw new BadRequestError('invalid article');
});

export default router;
