const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'pool_system_secret_key_123'; // חייב להיות אותו המפתח בדיוק כמו ב-authController!

const verifyToken = (req, res, next) => {
    // שליפת הטוקן מתוך כותרות הבקשה (Headers) ששלח ה-React
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // לוקח את הטוקן אחרי המילה "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'גישה נדחתה, אנא התחבר למערכת' });
    }

    try {
        // פענוח ואימות הטוקן באמצעות המפתח הסודי
        const verified = jwt.verify(token, JWT_SECRET);
        
        // הזרקת נתוני המשתמש (כולל ה-ID שלו) לתוך ה-req כדי שהקונטרולר הבא בתור יוכל להשתמש בו!
        req.user = verified; 
        
        next(); // אישור להמשיך הלאה לפונקציה בקונטרולר של השעות
    } catch (error) {
        return res.status(403).json({ message: 'טוקן אינו תקין או פג תוקף, אנא התחבר מחדש' });
    }
};

module.exports = verifyToken;
