import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import dotenv from 'dotenv';

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
                const user = await User.findOne({
                    where: {
                        google_id: profile.id,
                    },
                });

                if (user) {
                    return done(null, user);
                }

                if (!profile.emails || profile.emails.length === 0) {
                    return done(new Error('No email found'), false);
                }

                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    google_id: profile.id,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;