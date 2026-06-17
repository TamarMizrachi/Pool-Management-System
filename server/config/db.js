const mysql = require('mysql2');
require('dotenv').config();

// יצירת בריכת חיבורים (Connection Pool) לניהול יעיל של פניות ל-DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// בדיקה אוטומטית שהחיבור ל-MySQL תקין בעת הפעלת השרת
pool.getConnection((err, connection) => {
    if (err) {
        console.error('שגיאה בחיבור למסד הנתונים של הבריכה:', err.message);
    } else {
        console.log('החיבור ל-MySQL בוצע בהצלחה! מסד הנתונים מחובר.');
        connection.release();
    }
});

// ייצוא בריכת החיבורים עם תמיכה ב-Promises (async/await)
module.exports = pool.promise();
