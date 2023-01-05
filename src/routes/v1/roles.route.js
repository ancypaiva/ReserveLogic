const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const rolesvalidation = require('../../validations/roles.validation');
const rolesController = require('../../controllers/roles.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(rolesvalidation.createRole), rolesController.createRole)
  .get(auth(), validate(rolesvalidation.getRoles), rolesController.getRoles);
router.route('/select').get(validate(rolesvalidation.getRole), rolesController.getRoleSelect);
router.route('/modules').get(auth(), validate(rolesvalidation.getRole), rolesController.getModules);

router
  .route('/:RoleId')
  .get(auth(), validate(rolesvalidation.deleteEmployee), rolesController.getRole)
  .patch(auth(), validate(rolesvalidation.deleteEmployee), rolesController.updateRole)
  .delete(auth(), validate(rolesvalidation.deleteEmployee), rolesController.deleteRole);

module.exports = router;

/**
 * @swagger
 * definitions:
 *   roles:
 *     properties:
 *       name:
 *         type: string
 *       permissions:
 *         type: object
 */
/**
 * @swagger
 * /v1/roles/:
 *   get:
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     description: Returns all roles
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of roles models
 *         schema:
 *           $ref: '#/definitions/roles'
 */
/**
 * @swagger
 * /v1/roles/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     description: Returns a single role
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: roles's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: A single role
 *         schema:
 *           $ref: '#/definitions/roles'
 */
/**
 * @swagger
 * /v1/roles/{id}:
 *   patch:
 *     summary: Update a role
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *              example:
 *               name: fake name
 *               permissions:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/rp;role'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /v1/roles/{id}:
 *   delete:
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a single role
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Roles's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
