const db = require('../config/db');

const ScheduleModel = {
    
    async getAllSlots() {
        const query = `
            SELECT ps.*, COUNT(a.id) AS total_registered
            FROM pool_schedule ps
            LEFT JOIN appointments a ON ps.id = a.schedule_id
            GROUP BY ps.id
            ORDER BY ps.session_date ASC, ps.start_time ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    async createSlot(sessionDate, startTime, endTime, sessionType) {
        const [result] = await db.query(
            'INSERT INTO pool_schedule (session_date, start_time, end_time, session_type) VALUES (?, ?, ?, ?)',
            [sessionDate, startTime, endTime, sessionType]
        );
        return result.insertId;
    },
    async updateSlot(id, sessionDate, startTime, endTime, sessionType) {
        const [result] = await db.query(
            'UPDATE pool_schedule SET session_date = ?, start_time = ?, end_time = ?, session_type = ? WHERE id = ?',
            [sessionDate, startTime, endTime, sessionType, id]
        );
        return result.affectedRows > 0;
    },

    async deleteSlot(id) {
        const [result] = await db.query('DELETE FROM pool_schedule WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
    async getUserAppointments(userId) {
        const [rows] = await db.query(
            'SELECT schedule_id FROM appointments WHERE user_id = ?',
            [userId]
        );
        return rows;
    },

    async createAppointment(userId, slotId) {
        const [result] = await db.query(
            'INSERT INTO appointments (user_id, schedule_id) VALUES (?, ?)',
            [userId, slotId]
        );
        return result.insertId;
    },

    async deleteAppointment(userId, slotId) {
        const [result] = await db.query(
            'DELETE FROM appointments WHERE user_id = ? AND schedule_id = ?',
            [userId, slotId]
        );
        return result.affectedRows > 0;
    }
};


module.exports = ScheduleModel;
