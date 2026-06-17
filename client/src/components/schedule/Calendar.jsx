import React, { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar'; // ייבוא לוח השנה
import 'react-calendar/dist/Calendar.css'; // עיצוב בסיסי
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import './Calendar.css';
import AdminSlotForm from './AdminSlotForm';

export default function Calendar() {
    const { user } = useAuth(); // קבלת המשתמש המחובר
    const { sendRequest, loading } = useFetch(); // שימוש ב-useFetch שלכן

    const [slots, setSlots] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]); // שמירת מספרי ה-ID של המשמרות שהמשתמש נרשם אליהן בטבלת ההרשמות

    // סטייט לטופס מנהל
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [newType, setNewType] = useState('רחצת גברים');

    // משתני מצב חדשים לצורך עריכת משמרת
    const [isEditing, setIsEditing] = useState(false);
    const [editingSlotId, setEditingSlotId] = useState(null);

    // פונקציית עזר שמחשבת בזמן אמת אם יש משמרת שמתרחשת ממש עכשיו, וכמה רשומים אליה
    const getCurrentSlotInfo = () => {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${currentHours}:${currentMinutes}:00`;

        // מחפש משמרת שמתאימה לתאריך של היום ושהשעה הנוכחית נמצאת בטווח שלה
        const currentSlot = slots.find(slot => {
            const slotDate = new Date(slot.session_date).toDateString();
            const todayDate = now.toDateString();
            return slotDate === todayDate && currentTimeString >= slot.start_time && currentTimeString <= slot.end_time;
        });

        return currentSlot;
    };

    const activeLiveSlot = getCurrentSlotInfo();
    // טעינת כל המשמרות וההרשמות מהדאטה-בייס
    const loadScheduleData = async () => {
        try {
            // 1. שליפת כל המשמרות הקיימות ללוח
            const data = await sendRequest('/api/schedule', 'GET', null, false);
            setSlots(data);

            // 2. שליפת ההרשמות הקיימות של המשתמש מטבלת appointments
            if (user && user.role === 'client') {
                const appointments = await sendRequest('/api/schedule/my-appointments', 'GET', null, true);
                // נמפה את התוצאה למערך פשוט של מספרי ID של המשמרות
                setMyAppointments(appointments.map(app => app.slot_id));
            }
        } catch (err) {
            console.error('שגיאה בטעינת הנתונים:', err.message);
        }
    };

    useEffect(() => {
        loadScheduleData();
    }, [user]);

    // פונקציית ביצוע הרשמה חדשה לטבלת appointments
    const handleRegister = async (slotId) => {
        try {
            await sendRequest('/api/schedule/appointment/register', 'POST', { slot_id: slotId }, true);
            alert('נרשמת בהצלחה לשעת הפעילות במתחם!');
            loadScheduleData(); // רענון הלוח והחלפת הכפתור
        } catch (err) {
            alert(err.message || 'שגיאה בתהליך הרישום');
        }
    };

    // פונקציית ביטול הרשמה קיימת מטבלת appointments
    const handleCancelRegister = async (slotId) => {
        try {
            await sendRequest('/api/schedule/appointment/cancel', 'DELETE', { slot_id: slotId }, true);
            alert('ההרשמה שלך למשמרת בוטלה בהצלחה.');
            loadScheduleData(); // רענון הלוח והחלפת הכפתור
        } catch (err) {
            alert(err.message || 'שגיאה בביטול הרישום');
        }
    };

    // 1. פונקציה למחיקת משמרת מהלוח על ידי המנהל
    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק משמרת זו לחלוטין מהלוח?')) return;
        try {
            await sendRequest(`/api/schedule/${slotId}`, 'DELETE', null, true);
            alert('המשמרת נמחקה בהצלחה מהמערכת.');
            loadScheduleData(); // רענון הלוח
        } catch (err) {
            alert(err.message || 'שגיאה במחיקת המשמרת');
        }
    };

    // 2. פונקציה שמכינה את הטופס וממלאת אותו בנתוני המשמרת שנבחרה לעריכה
    const handleEditClick = (slot) => {
        setIsEditing(true);
        setEditingSlotId(slot.id);

        // המרת התאריך לפורמט שהדפדפן מבין (yyyy-MM-dd)
        const formattedDate = new Date(slot.session_date).toISOString().split('T')[0];
        setNewDate(formattedDate);
        setNewStart(slot.start_time.substring(0, 5));
        setNewEnd(slot.end_time.substring(0, 5));
        setNewType(slot.session_type);

        setShowAdminForm(true); // פתיחת הטופס באופן אוטומטי

        // גלילה חלקה למעלה אל עבר הטופס
        document.getElementById('schedule-section').scrollIntoView({ behavior: 'smooth' });
    };
    // לחיצה של אורח לא מחובר
    const handleGuestClick = (slot) => {
        alert(`כדי להירשם ל${slot.session_type} בין השעות ${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}, אנא התחברו או הרשמו תחילה למערכת.`);
    };

    // פונקציית הקסם: רצה אוטומטית על כל משבצת (Tile) בלוח החודשי ומציגה את הפעילויות בתוכה
    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const currentDateString = date.toDateString();

            // סינון כל המשמרות שמתאימות בדיוק לתאריך של המשבצת הנוכחית
            const daySlots = slots.filter(slot => new Date(slot.session_date).toDateString() === currentDateString);

            if (daySlots.length > 0) {
                return (
                    <div className="tile-activities-wrapper">
                        {daySlots.map(slot => {
                            const isRegistered = myAppointments.includes(slot.id);

                            return (
                                <div key={slot.id} className="tile-activity-item">
                                    {/* שינוי 1: הצגת זמן התחלה וזמן סיום ביחד */}
                                    <span className="tile-activity-time">⏱️ {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                                    <span className="tile-activity-text">{slot.session_type}</span>

                                    {/* שינוי 2: אזור כפתורי פעולה מבוססי <span> למניעת שגיאות HTML */}
                                    <div className="tile-activity-actions">
                                        {/* מקרה א': אורח לא מחובר */}
                                        {!user && (
                                            <span className="slot-span-btn guest-btn" onClick={(e) => {
                                                e.stopPropagation(); // מניעת הפעלת הלחיצה של המשבצת הכללית
                                                handleGuestClick(slot);
                                            }}>
                                                🔒 הרשמה
                                            </span>
                                        )}

                                        {/* מקרה ב': לקוח מחובר - בדיקה האם רשום בטבלת appointments */}
                                        {user && user.role === 'client' && (
                                            isRegistered ? (
                                                <span className="slot-span-btn cancel-btn" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelRegister(slot.id);
                                                }}>
                                                    ❌ ביטול רישום
                                                </span>
                                            ) : (
                                                <span className="slot-span-btn register-btn" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRegister(slot.id);
                                                }}>
                                                    ➕ הרשמה מהירה
                                                </span>
                                            )
                                        )}

                                        {/* מקרה ג': מנהל מערכת - הצגת כמות רשומים וכפתורי ניהול משמרת */}
                                        {user && user.role === 'admin' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '3px', width: '100%' }}>
                                                {/* הצגת כמות האנשים הרשומים לאותה שעה מתוך הדיבי בזמן אמת */}
                                                <span className="slot-admin-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
                                                    👥 {slot.total_registered || 0} רשומים לשעה זו
                                                </span>

                                                <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                                                    <span
                                                        className="slot-span-btn"
                                                        style={{ backgroundColor: '#f59e0b', color: 'white', flex: 1, padding: '4px', marginTop: 0, textAlign: 'center' }}
                                                        onClick={(e) => { e.stopPropagation(); handleEditClick(slot); }}
                                                    >
                                                        📝 ערוך
                                                    </span>
                                                    <span
                                                        className="slot-span-btn cancel-btn"
                                                        style={{ flex: 1, padding: '4px', marginTop: 0, textAlign: 'center' }}
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.id); }}
                                                    >
                                                        ❌ מחק
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }
        return null;
    };

    const handleAddSlotSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            session_date: newDate,
            start_time: newStart,
            end_time: newEnd,
            session_type: newType
        };

        try {
            if (isEditing) {
                // אם אנחנו במצב עריכה - שולחים בקשת PUT עם ה-ID של המשמרת
                await sendRequest(`/api/schedule/${editingSlotId}`, 'PUT', payload, true);
                alert('המשמרת עודכנה בהצלחה בלוח הפעילות!');
            } else {
                // אם אנחנו במצב רגיל - שולחים בקשת POST ליצירה חדשה
                await sendRequest('/api/schedule', 'POST', payload, true);
                alert('המשמרת נוספה בהצלחה ומוצגת כעת בלוח החודשי!');
            }

            // איפוס הטופס והחזרתו למצב רגיל
            setShowAdminForm(false);
            setIsEditing(false);
            setEditingSlotId(null);
            setNewDate('');
            setNewStart('');
            setNewEnd('');
            loadScheduleData(); // רענון הלוח
        } catch (err) {
            alert(err.message || 'שגיאה בשמירת הנתונים');
        }
    };

    return (
        <section id="schedule-section" className="schedule-section">
            <div className="section-title">
                <h2>📅 לוח שעות פעילות חודשי ומערכת רישום</h2>
                <div className="title-underline"></div>

                {/* פיצ'ר מצב נוכחי בבריכה - מוצג למנהל בלבד בראש הלוח */}
                {user && user.role === 'admin' && (
                    <div style={{ marginTop: '20px', padding: '15px', background: activeLiveSlot ? '#f0fdf4' : '#f8fafc', border: `1px solid ${activeLiveSlot ? '#bbf7d0' : '#cbd5e1'}`, borderRadius: '12px', textAlign: 'right' }}>
                        <h4 style={{ margin: 0, color: activeLiveSlot ? '#166534' : '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔵 מצב נוכחי בבריכה בזמן אמת:
                        </h4>
                        {activeLiveSlot ? (
                            <div style={{ margin: '8px 0 0 0', fontSize: '1rem', color: '#15803d', lineHeight: '1.6' }}>
                                <p style={{ margin: '2px 0' }}>
                                    סוג המשמרת כעת: <strong style={{ backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px', color: '#166534' }}>{activeLiveSlot.session_type}</strong>
                                </p>
                                <p style={{ margin: '2px 0' }}>
                                    שעות הפעילות: <strong>{activeLiveSlot.start_time.substring(0, 5)} - {activeLiveSlot.end_time.substring(0, 5)}</strong>
                                </p>
                                <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', fontSize: '1.05rem' }}>
                                    👥 {activeLiveSlot.total_registered || 0} רוחצים רשומים במים כרגע!
                                </p>
                            </div>
                        ) : (
                            <p style={{ margin: '5px 0 0 0', fontSize: '1rem', color: '#64748b', fontStyle: 'italic' }}>
                                אין פעילות מתוזמנת או רוחצים רשומים בבריכה בשעה זו.
                            </p>
                        )}
                    </div>
                )}

                {user && user.role === 'admin' && (
                    <button className="admin-add-slot-toggle" style={{ marginTop: '20px' }} onClick={() => setShowAdminForm(!showAdminForm)}>
                        {showAdminForm ? '✖ סגור טופס הוספה' : '➕ הוספת חלון זמן חדש ללוח'}
                    </button>
                )}
            </div>

            {/* טופס מנהל */}
            {/* שימוש בקומפוננטת הטופס המבודדת - מונע באגים, כפילויות ובריחת אלמנטים */}
            <AdminSlotForm
                showAdminForm={showAdminForm}
                setShowAdminForm={setShowAdminForm}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                newDate={newDate}
                setNewDate={setNewDate}
                newStart={newStart}
                setNewStart={setNewStart}
                newEnd={newEnd}
                setNewEnd={setNewEnd}
                newType={newType}
                setNewType={setNewType}
                onSubmit={handleAddSlotSubmit}
            />

            {/* לוח השנה ברוחב מלא עם הפעילויות בפנים */}
            <div className="full-width-calendar-container">
                {loading && <div className="schedule-loading-overlay">מעדכן לוח שעות...</div>}

                <ReactCalendar
                    locale="he-IL"
                    tileContent={renderTileContent} // קישור פונקציית השתלת הפעילויות!
                />
            </div>
        </section>
    );
}
