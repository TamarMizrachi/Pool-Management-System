import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import './MyProfile.css';
import DownloadHistoryBtn from './DownloadHistoryBtn'; 

export default function MyProfile() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { sendRequest, loading } = useFetch();
    const [appointments, setAppointments] = useState([]);
    const [subStatus, setSubStatus] = useState('פעיל'); 
    const [subEndDate, setSubEndDate] = useState('31/12/2026');

    const loadUserHistory = async () => {
        try {
            const allSlots = await sendRequest('/api/schedule', 'GET', null, false);
            const userApps = await sendRequest('/api/schedule/my-appointments', 'GET', null, true);

            const registeredSlots = allSlots.filter(slot =>
                userApps.some(app => app.slot_id === slot.id)
            );

            setAppointments(registeredSlots);
        } catch (err) {
            console.error('שגיאה בטעינת היסטוריית הרשמות:', err.message);
        }
    };

    useEffect(() => {
        if (user) {
            loadUserHistory();
        }
    }, [user]);

   const handleRenewSubscription = async () => {
    alert('העברה זמנית לספק התשלומים... מבצע עדכון מנוי במערכת...');

    const result = await sendRequest(
        '/api/subscription/purchase', 
        'POST', 
        null, 
        { requireAuth: true } 
    );

    if (result) {
        alert('המנוי חודש בהצלחה בבסיס הנתונים ל-30 ימים נוספים!');
        if (typeof loadUserSubscription === 'function') {
            loadUserSubscription();
        } else {
            const newValidDate = new Date();
            newValidDate.setDate(newValidDate.getDate() + 30);
            setSubStatus('active');
            setSubEndDate(newValidDate.toLocaleDateString('he-IL'));
        }
    }
};

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2> האזור האישי של {user?.fullName}</h2>
                <div className="title-underline"></div>

                <div className="subscription-status-box" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <div>
                        <h3> סטטוס מנוי ורכישות במערכת</h3>
                        <p>לצפייה בתוקף המנוי הנוכחי שלך או ביצוע רכישה/חידוש.</p>
                    </div>
                    <button className="renew-sub-btn" onClick={() => navigate('/subscription')}>
                         מעבר לניהול מנוי
                    </button>
                </div>

                <div className="history-section">
                    <h3>היסטוריית רישומים וחלונות זמן שהוזמנו</h3>
                    {loading ? (
                        <p>טוען את היסטוריית הפעילויות שלך...</p>
                    ) : appointments.length === 0 ? (
                        <p className="no-data">טרם נרשמת למשמרות בבריכה. חזור לעמוד הבית והזמן מקום!</p>
                    ) : (
                        <div className="history-table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>תאריך הפעילות</th>
                                        <th>שעות</th>
                                        <th>סוג הרחצה / אימון</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app.id}>
                                            <td>{new Date(app.session_date).toLocaleDateString('he-IL')}</td>
                                            <td>{app.start_time.substring(0, 5)} - {app.end_time.substring(0, 5)}</td>
                                            <td>{app.session_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <DownloadHistoryBtn
                    appointments={appointments}
                    userFullName={user?.fullName}
                />
            </div>
        </div>
    );
}