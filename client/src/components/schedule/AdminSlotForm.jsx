import React from 'react';

export default function AdminSlotForm({
    showAdminForm,
    setShowAdminForm,
    isEditing,
    setIsEditing,
    newDate,
    setNewDate,
    newStart,
    setNewStart,
    newEnd,
    setNewEnd,
    newType,
    setNewType,
    onSubmit
}) {
    // אם המשתמש לא ביקש לפתוח את הטופס, הקומפוננטה לא מרנדרת כלום למסך
    if (!showAdminForm) return null;

    const handleCancel = () => {
        setShowAdminForm(false);
        setIsEditing(false);
        setNewDate('');
        setNewStart('');
        setNewEnd('');
    };

    return (
        <form onSubmit={onSubmit} className="admin-slot-form">
            <h3>{isEditing ? '📝 עריכת חלון זמן קיים' : '➕ יצירת חלון זמן חדש בבריכה'}</h3>
            
            <div className="form-row">
                <div>
                    <label>תאריך: </label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
                </div>

                <div>
                    <label>שעת התחלה: </label>
                    <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} required />
                </div>

                <div>
                    <label>שעת סיום: </label>
                    <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} required />
                </div>

                <div>
                    <label>סוג הפעילות: </label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                        <option value="רחצת גברים">רחצת גברים 👨</option>
                        <option value="רחצת נשים">רחצת נשים 👩</option>
                        <option value="רחצה חופשית (מעורב)">רחצה חופשית (מעורב) 🏊</option>
                        <option value="חוגים ואימונים מתקדמים">חוגים ואימונים מתקדמים 🏅</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button 
                    type="submit" 
                    className="admin-submit-slot-btn" 
                    style={{ backgroundColor: isEditing ? '#f59e0b' : '#03045e' }}
                >
                    {isEditing ? 'עדכן משמרת' : 'שמור משמרת'}
                </button>
                
                <button 
                    type="button" 
                    className="admin-submit-slot-btn" 
                    style={{ backgroundColor: '#64748b' }} 
                    onClick={handleCancel}
                >
                    סגור / ביטול
                </button>
            </div>
        </form>
    );
}