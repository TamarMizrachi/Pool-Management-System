import React from 'react';

export default function AdminLiveStatus({ user, activeLiveSlot, showAdminForm, setShowAdminForm }) {
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="admin-status-wrapper">
            <div className={`admin-live-status-box ${activeLiveSlot ? 'active' : ''}`}>
                
                <h4 className={`admin-live-title ${activeLiveSlot ? 'active' : 'inactive'}`}>
                     מצב נוכחי בבריכה בזמן אמת:
                </h4>

                {activeLiveSlot ? (
                    <div className="admin-live-content">
                        <p style={{ margin: '2px 0' }}>
                            סוג המשמרת כעת: <strong className="admin-live-badge-type">{activeLiveSlot.session_type}</strong>
                        </p>
                        <p style={{ margin: '2px 0' }}>
                            שעות הפעילות: <strong>{activeLiveSlot.start_time.substring(0, 5)} - {activeLiveSlot.end_time.substring(0, 5)}</strong>
                        </p>
                        <p className="admin-live-registered-count">
                            👥 {activeLiveSlot.total_registered || 0} רוחצים רשומים במים כרגע!
                        </p>
                    </div>
                ) : (
                    <p className="admin-live-empty-text">
                        אין פעילות מתוזמנת או רוחצים רשומים בבריכה בשעה זו.
                    </p>
                )}
            </div>

            <button className="admin-add-slot-toggle" onClick={() => setShowAdminForm(!showAdminForm)}>
                {showAdminForm ? ' סגור טופס הוספה' : ' הוספת חלון זמן חדש ללוח'}
            </button>
        </div>
    );
}