import {Request, Router} from "express";
import passport from "../middlewares/passport";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import {assignRole, createUser, getUserById, makeAdmin, removeAdmin} from "../controllers/roleController";
import { authenticateJWT } from "@epehc/sharedutilities/middlewares/authMiddleware";
import { authorize } from "@epehc/sharedutilities/middlewares/authorize";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";
import { body } from "express-validator";



const router = Router()

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Start Google OAuth login
 *     description: Redirects the user to Google OAuth login page.
 *     responses:
 *       302:
 *         description: Redirect to Google login page.
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
)

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Processes Google OAuth response and returns a JWT token.
 *     responses:
 *       200:
 *         description: Authentication successful. Returns a JWT token.
 *       401:
 *         description: Authentication failed.
 */
router.get(
    '/google/callback',
    passport.authenticate('google', {session: false}),
    (req: any, res) => {
        try{
            const token = jwt.sign({
                id: req.user.id,
                email: req.user.email,
                roles: req.user.roles
            },
                process.env.JWT_SECRET!, {
                expiresIn: process.env.JWT_EXPIRATION!
            })
            logger.info(`User ${req.user.id} authenticated`)
            res.status(200).json({token})
        } catch (error) {
            logger.error(`Failed to authenticate user: ${error}`)
            res.status(500).json({error: 'Failed to authenticate user'})
        }

    }
)

/**
 * @swagger
 * /roles/assign:
 *   post:
 *     summary: Assign roles to a user
 *     description: Assign roles to a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles assigned successfully.
 *       400:
 *         description: Invalid input for role assignment.
 *       403:
 *         description: Access denied.
 */
router.post("/roles/assign",
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        body('id').isUUID().withMessage('Invalid user ID'),
        body('roles')
            .isArray()
            .withMessage('Roles must be an array')
            .custom((roles: any) => roles.every((role: any) => Object.values(UserRole).includes(role)))
            .withMessage('Invalid roles provided'),
    ], assignRole
)


/**
 * @swagger
 * /roles/make-admin:
 *   post:
 *     summary: Make a user an admin
 *     description: Make a user an admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User is now an admin.
 *       400:
 *         description: Invalid input for role assignment.
 *       403:
 *         description: Access denied.
 */
router.post('/roles/make-admin',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
    body('id').isUUID().withMessage('Invalid user ID')
    ],
    makeAdmin)

/**
 * @swagger
 * /roles/remove-admin:
 *   post:
 *     summary: Remove admin role from a user
 *     description: Remove admin role from a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin role removed successfully.
 *       400:
 *         description: Invalid input for role assignment.
 *       403:
 *         description: Access denied.
 */
router.post('/roles/remove-admin',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
    body('id').isUUID().withMessage('Invalid user ID')
    ],
    removeAdmin)

router.post('/users', createUser)

router.get('/users/:id', getUserById);


export default router;