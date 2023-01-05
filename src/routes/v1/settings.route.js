const express = require('express');
const validate = require('../../middlewares/validate');
const settingsValidation = require('../../validations/settings.validation');
const settingsController = require('../../controllers/settings.controller');

const router = express.Router();

router.route('/').get(settingsController.getSettings);
router.route('/logo').post(settingsController.updateLogo);
router.route('/logoremove').post(settingsController.removeLogo);
router.route('/updatedate').patch(settingsController.updateDate);
router.route('/:type').patch(validate(settingsValidation.updateSettings), settingsController.updateSettings);

module.exports = router;

/**
 * @swagger
 * /v1/settings:
 *   get:
 *     summary: Get all settings
 *     description: .
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: values
 *         schema:
 *           type: object
 *         description: User name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /v1/settings/general:
 *   patch:
 *     summary: Update general settings
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: values
 *         required: true
 *         schema:
 *           type: object
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */
