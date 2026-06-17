const db = require('../config/db');

const SubscriptionModel = {

    async getUserSubscription(userId) {
        const [rows] = await db.query(
            'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY end_date DESC LIMIT 1',
            [userId]
        );
        return rows[0];
    },

    async createSubscription(userId) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const sql = `
        INSERT INTO subscriptions (user_id, start_date, end_date, status)
        SELECT ?, ?, ?, 'active'
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1 FROM subscriptions 
            WHERE user_id = ? AND end_date > NOW()
        )
    `;

        const [result] = await db.query(sql, [userId, startDate, endDate, userId]);
        return result.insertId;
    },

    async updateToExpired(subscriptionId) {
        await db.query(
            'UPDATE subscriptions SET status = "expired" WHERE id = ?',
            [subscriptionId]
        );
    }
};

module.exports = SubscriptionModel;