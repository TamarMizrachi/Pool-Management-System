const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'pool_system_secret_key_123';

const AuthController = {

    async register(req, res) {

        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'נא למלא את כל השדות החשובים (שם, אימייל וסיסמה)' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            await UserModel.createUser(fullName, email, hashedPassword);

            return res.status(201).json({ message: 'המשתמש נרשם בהצלחה!' });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                return res.status(400).json({ message: 'האימייל הזה כבר רשום במערכת' });
            }
            console.error('Error in register:', error);
            return res.status(500).json({ message: 'שגיאת שרת פנימית בתהליך ההרשמה' });
        }
    },

    async login(req, res) {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'נא להזין אימייל וסיסמה' });
        }

        try {
            const user = await UserModel.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
            }

            const hashedPassword = await UserModel.getUserPasswordHash(user.id);
            if (!hashedPassword) {
                return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
            }

            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
            }

            const token = jwt.sign(
                { id: user.id, fullName: user.full_name, role: user.role },
                JWT_SECRET,
                { expiresIn: '3h' }
            );

            return res.json({
                message: 'התחברת בהצלחה!',
                token: token,
                user: {
                    id: user.id,
                    fullName: user.full_name,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({ message: 'שגיאת שרת פנימית בתהליך ההתחברות' });
        }
    }
};

module.exports = AuthController;