const ScheduleModel = require('../models/scheduleModel');

const ScheduleController = {

    async getAllSlots(req, res) {
        try {
            const slots = await ScheduleModel.getAllSlots();
            return res.json(slots);
        } catch (error) {
            console.error('Error in getAllSlots:', error);
            return res.status(500).json({ message: 'שגיאה בשליפת לוח השעות משרת המערכת' });
        }
    },

    async createSlot(req, res) {
        const { session_date, start_time, end_time, session_type } = req.body;

        if (!session_date || !start_time || !end_time || !session_type) {
            return res.status(400).json({ message: 'נא למלא את כל שדות המשמרת' });
        }

        try {
            const newSlotId = await ScheduleModel.createSlot(session_date, start_time, end_time, session_type);
            return res.status(201).json({ message: 'המשמרת התווספה בהצלחה ללוח!', id: newSlotId });
        } catch (error) {
            console.error('Error in createSlot:', error);
            return res.status(500).json({ message: 'שגיאה בהוספת משמרת חדשה' });
        }
    },

    async updateSlot(req, res) {
        const { id } = req.params;
        const { session_date, start_time, end_time, session_type } = req.body;

        if (!session_date || !start_time || !end_time || !session_type) {
            return res.status(400).json({ message: 'נא למלא את כל השדות לצורך עריכה' });
        }

        try {
            const success = await ScheduleModel.updateSlot(id, session_date, start_time, end_time, session_type);
            if (!success) {
                return res.status(404).json({ message: 'משמרת זו לא נמצאה במערכת' });
            }
            return res.json({ message: 'המשמרת עודכנה בהצלחה בלוח הפעילות!' });
        } catch (error) {
            console.error('Error in updateSlot:', error);
            return res.status(500).json({ message: 'שגיאה בעדכון המשמרת הנוכחית' });
        }
    },

    async deleteSlot(req, res) {
        const { id } = req.params;

        try {
            const success = await ScheduleModel.deleteSlot(id);
            if (!success) {
                return res.status(404).json({ message: 'משמרת זו לא נמצאה במערכת' });
            }
            return res.json({ message: 'המשמרת נמחקה בהצלחה מהלוח!' });
        } catch (error) {
            console.error('Error in deleteSlot:', error);
            return res.status(500).json({ message: 'שגיאה בתהליך מחיקת המשמרת' });
        }
    },
    async getMyAppointments(req, res) {
        try {
            const userId = req.user.id; 
            const appointments = await ScheduleModel.getUserAppointments(userId);

            const formattedAppointments = appointments.map(app => ({
                slot_id: app.schedule_id
            }));
            return res.json(formattedAppointments);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'שגיאה בשליפת ההרשמות שלך' });
        }
    },

    async registerToSlot(req, res) {
        const { slot_id } = req.body;
        const userId = req.user.id;

        if (!slot_id) {
            return res.status(400).json({ message: 'מזהה משמרת חסר' });
        }
        try {
            await ScheduleModel.createAppointment(userId, slot_id);
            return res.status(201).json({ message: 'נרשמת בהצלחה למשמרת!' });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'הנך כבר רשום למשמרת זו' });
            }
            return res.status(500).json({ message: 'שגיאה בתהליך הרישום למשמרת' });
        }
    },

    async cancelAppointment(req, res) {
        const { slot_id } = req.body;
        const userId = req.user.id;

        if (!slot_id) {
            return res.status(400).json({ message: 'מזהה משמרת חסר' });
        }
        try {
            const success = await ScheduleModel.deleteAppointment(userId, slot_id);
            if (!success) {
                return res.status(404).json({ message: 'לא נגרעה הרשמה, ייתכן שאינך רשום' });
            }
            return res.json({ message: 'ההרשמה בוטלה בהצלחה' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'שגיאה בביטול ההרשמה' });
        }
    }
};



module.exports = ScheduleController;
