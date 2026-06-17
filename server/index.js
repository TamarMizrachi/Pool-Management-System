const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// 🆕 1. ייבוא הראוטר של הלוח
const scheduleRoutes = require('./routes/scheduleRoutes');
// 1. ייבוא הראוטר החדש של המנויים (בחלק העליון של הקובץ)
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);

// 🆕 2. חיבור הראוטר של הלוח (בדיוק במיקום הזה!)
app.use('/api/schedule', scheduleRoutes);

// נתיב הבדיקה הכללי - חייב להיות מתחת לראוטרים!
app.get('/', (req, res) => {
    res.send('שרת מערכת הבריכה באוויר ופועל בהצלחה!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`השרת רץ בהצלחה על פורט ${PORT}`);
});
