import {Router} from "express";
import passport from "../middlewares/passport";
import jwt from "jsonwebtoken";

const router = Router()

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
)

router.get(
    '/google/callback',
    passport.authenticate('google', {session: false}),
    (req: any, res) => {
        const token = jwt.sign({id: req.user.id}, process.env.JWT_SECRET!, {
            expiresIn: process.env.JWT_EXPIRATION!
        })
        res.json({token})

    }
)

export default router;