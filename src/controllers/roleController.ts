import { Request, Response } from "express";
import Usuario from "../models/usuario";
import logger from "../utils/logger";
import {validationResult} from "express-validator";
import {UserRole} from "@epehc/sharedutilities/enums/userRole";

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
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to assign roles.
 */
export const assignRole = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
    }
    const { userId, roles } = req.body;

    if (!userId || !roles || !Array.isArray(roles) || !roles.every((role: any) => Object.values(UserRole).includes(role))) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ error: "Invalid input for role assignment" });
    }

    try {
        const user = await Usuario.findByPk(userId);
        if (!user) {
            logger.error(`Error al asignar roles: Usuario no encontrado`);
            res.status(404).json({ error: "User not found" });
            return
        }

        user.roles = roles; // Overwrite roles
        await user.save();

        logger.info(`Roles updated successfully for user ${user.id}`);
        res.status(200).json({ message: "Roles updated successfully", user });
    } catch (error) {
        logger.error(`Error al asignar roles: ${error}`);
        res.status(500).json({ error: "Failed to assign roles" });
    }
};

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
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to make user admin.
 */
export const makeAdmin = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.body;

    try {
        const user = await Usuario.findByPk(userId);
        if (!user) {
            logger.error(`Error al hacer admin: Usuario no encontrado`);
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (!user.roles.includes(UserRole.Admin)) {
            user.roles.push(UserRole.Admin);
            await user.save();
        }

        logger.info(`User ${user.id} is now an admin`);
        res.status(200).json({ message: "User is now an admin", user });
    } catch (error) {
        logger.error(`Error al hacer admin: ${error}`);
        res.status(500).json({ error: "Failed to make user admin" });
    }
};

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
 *         description: User is no longer an admin.
 *       400:
 *         description: Invalid input for role assignment.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to remove admin role.
 */
export const removeAdmin = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.body;

    try {
        const user = await Usuario.findByPk(userId);
        if (!user) {
            logger.error(`Error al remover admin: Usuario no encontrado`);
            res.status(404).json({ error: "User not found" });
            return;
        }

        user.roles = user.roles.filter(role => role !== UserRole.Admin);
        await user.save();

        logger.info(`User ${user.id} is no longer an admin`);
        res.status(200).json({ message: "User is no longer an admin", user });
    } catch (error) {
        logger.error(`Error al remover admin: ${error}`);
        res.status(500).json({ error: "Failed to remove admin role" });
    }
};
