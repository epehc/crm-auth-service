import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Usuario from '../models/usuario';
import dotenv from 'dotenv';
import logger from "../utils/logger";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await Usuario.findOne({where: {google_id: profile.id,},});

                if (user) {
                    logger.info(`User authenticated`);
                    return done(null, user);
                }

                if (!profile.emails || profile.emails.length === 0) {
                    logger.error('No email found');
                    return done(new Error('No email found'), false);
                }

                const newUser = await Usuario.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    google_id: profile.id,
                });

                logger.info(`User ${newUser} authenticated`)
                return done(null, newUser);
            } catch (error) {
                logger.error(`Failed to authenticate user: ${error}`);
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    try{
        logger.info(`User ${user.id} serialized`);
        done(null, user.id);
    }catch (error) {
        logger.error(`Failed to serialize user: ${error}`);
        done(error, null);
    }
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await Usuario.findByPk(id);
        logger.info(`User deserialized`);
        done(null, user);
    } catch (error) {
        logger.error(`Failed to deserialize user: ${error}`);
        done(error, null);
    }
});

export default passport;