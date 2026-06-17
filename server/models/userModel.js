const db = require('../config/db');

const UserModel = {
    
    async getUserByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; 
    },

    async getUserPasswordHash(userId) {
        const [rows] = await db.query('SELECT password_hash FROM user_passwords WHERE user_id = ?', [userId]);
        return rows[0] ? rows[0].password_hash : null;
    },

    async createUser(fullName, email, hashedPassword) {

        const [userResult] = await db.query(
            'INSERT INTO users (full_name, email, role) VALUES (?, ?, ?)',
            [fullName, email, 'client']
        );

        const newUserId = userResult.insertId;

        await db.query(
            'INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)',
            [newUserId, hashedPassword]
        );

        return newUserId;
    }
};

module.exports = UserModel;