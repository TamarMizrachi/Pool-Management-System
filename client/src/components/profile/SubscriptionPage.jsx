
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import './SubscriptionPage.css';

export default function SubscriptionPage() {

    const { user } = useAuth();
    const { sendRequest, loading } = useFetch();
    const navigate = useNavigate();

    const [subData, setSubData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [isPaymentMode, setIsPaymentMode] = useState(false);

    const loadSubscription = async () => {
        try {
            const data = await sendRequest('/api/subscription/my-subscription', 'GET', null, true); 
            setSubData(data);

            if (data && data.id) {
                const now = new Date();
                const endDate = new Date(data.end_date);
                const diffTime = endDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0 || data.status === 'expired') {
                    setAlertMessage('פג התוקף של המנוי שלך! אנא בצע רכישה מחדש כדי שתוכל להירשם לבריכה.');
                } else if (diffDays > 0 && diffDays <= 5) {
                    setAlertMessage(`לבחירתך: המנוי שלך עומד לפוג בעוד ${diffDays} ימים!`);
                } else {
                    setAlertMessage('');
                }
            } else {
                setAlertMessage('אין לך מנוי פעיל במערכת. רכשי מנוי כדי ליהנות מרישום למשמרות הפעילות.');
            }
        } catch (err) {
            console.error('שגיאה בטעינת המנוי:', err.message);
        }
    };

    useEffect(() => {
        if (user) loadSubscription();
    }, [user]);

    const handleConfirmPurchase = async () => {
        try {
            await sendRequest('/api/subscription/purchase', 'POST', null, true);
            alert('הרכישה עברה בהצלחה! המנוי עודכן ל-30 יום נוספים.');
            setIsPaymentMode(false);
            loadSubscription(); 
        } catch (err) {
            alert(err.message || 'שגיאה ברכישה. ייתכן וקיים מנוי פעיל בתוקף.');
        }
    };

    const isSubActive = subData && subData.status === 'active' && (new Date(subData.end_date) > new Date());

    if (isPaymentMode) {
        return (
            <div className="sub-page-container">
                <div className="sub-page-card">
                    <h2>קופת תשלום מדומה - PoolHub</h2>
                    <div className="title-underline"></div>
                    <div className="payment-details-box">
                        <p><strong>הפריט:</strong> מנוי חבר חודשי (30 ימי פעילות בבריכה)</p>
                        <p><strong>מחיר:</strong> 0.00 ₪</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button className="sub-action-btn purchase" onClick={handleConfirmPurchase} disabled={loading}>
                            {loading ? 'מבצע רכישה...' : '✔️ אשר תשלום ורכישה'}
                        </button>
                        <button className="sub-action-btn cancel" onClick={() => setIsPaymentMode(false)}>ביטול</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sub-page-container">
            <div className="sub-page-card">
                <h2>ניהול ורכישת מנוי משתמש</h2>
                <div className="title-underline"></div>

                {alertMessage && <div className="sub-alert-banner">{alertMessage}</div>}

                <div className="sub-details-section">
                    {/* אם אין מידע על מנוי, או שיש מנוי קודם אבל הוא כבר לא פעיל */}
                    {!subData || subData.status === 'expired' || !isSubActive ? (
                        <div>
                            <p>סטטוס נוכחי: <span className="sub-status-badge expired">ללא מנוי פעיל</span></p>
                            <p style={{ margin: '15px 0', color: '#4a5568' }}>
                                כברירת מחדל, אין לך מנוי תקף כרגע ברשת הבריכות. לחצי על הכפתור למטה כדי לרכוש או לחדש מנוי דיגיטלי.
                            </p>
                            <button className="sub-action-btn purchase" onClick={() => setIsPaymentMode(true)}>
                                {subData ? 'חידוש מנוי חודשי' : 'רכישת מנוי חודשי'}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p>סטטוס נוכחי:
                                <span className="sub-status-badge active">פעיל בתוקף</span>
                            </p>
                            <p>תאריך התחלה: <strong>{new Date(subData.start_date).toLocaleDateString('he-IL')}</strong></p>
                            <p>תאריך סיום (תוקף): <strong>{new Date(subData.end_date).toLocaleDateString('he-IL')}</strong></p>

                            <button
                                className="sub-action-btn purchase"
                                onClick={() => setIsPaymentMode(true)}
                                disabled={isSubActive}
                                style={{ 
                                    opacity: 0.5, 
                                    cursor: 'not-allowed', 
                                    marginTop: '20px' 
                                }}
                            >
                                מנוי כבר פעיל (הרכישה חסומה)
                            </button>
                        </div>
                    )}
                </div>

                <button className="sub-action-btn back" onClick={() => navigate('/profile')} style={{ marginTop: '30px', backgroundColor: '#64748b' }}>
                    חזרה לאזור האישי
                </button>
            </div>
        </div>
    );
}