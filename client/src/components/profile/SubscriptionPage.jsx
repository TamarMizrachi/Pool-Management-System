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
            const data = await sendRequest('/api/subscription/my-subscription', 'GET', null, true); setSubData(data);

            if (data && data.hasSubscription) {
                const now = new Date();
                const endDate = new Date(data.end_date);
                const diffTime = endDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    setAlertMessage('⚠️ פג התוקף של המנוי שלך! אנא בצע רכישה מחדש כדי שתוכל להירשם לבריכה.');
                } else if (diffDays > 0 && diffDays <= 5) {
                    setAlertMessage(`⚠️ לבחירתך: המנוי שלך עומד לפוג בעוד ${diffDays} ימים!`);
                } else {
                    setAlertMessage('');
                }
            } else {
                setAlertMessage('ℹ️ אין לך מנוי פעיל במערכת. רכשי מנוי כדי ליהנות מרישום למשמרות הפעילות.');
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
            await sendRequest('/api/subscription/purchase', 'POST', null, true); alert('הסימולציה עברה בהצלחה! המנוי עודכן ל-30 יום נוספים בדיבי. 🎉');
            setIsPaymentMode(false);
            loadSubscription();
        } catch (err) {
            alert(err.message || 'שגיאה ברכישה');
        }
    };

    const isSubActive = subData?.hasSubscription && (new Date(subData.end_date) > new Date());

    if (isPaymentMode) {
        return (
            <div className="sub-page-container">
                <div className="sub-page-card">
                    <h2>💳 קופת תשלום מדומה - PoolHub</h2>
                    <div className="title-underline"></div>
                    <div className="payment-details-box">
                        <p><strong>הפריט:</strong> מנוי חבר חודשי (30 ימי פעילות בבריכה)</p>
                        <p><strong>מחיר:</strong> 0.00 ₪ (מצב סימולציה לימודי)</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button className="sub-action-btn purchase" onClick={handleConfirmPurchase}>✔️ אשר תשלום ורכישה</button>
                        <button className="sub-action-btn cancel" onClick={() => setIsPaymentMode(false)}>ביטול</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sub-page-container">
            <div className="sub-page-card">
                <h2>📋 ניהול ורכישת מנוי משתמש</h2>
                <div className="title-underline"></div>

                {alertMessage && <div className="sub-alert-banner">{alertMessage}</div>}

                <div className="sub-details-section">
                    {!subData?.hasSubscription ? (
                        <div>
                            <p>סטטוס נוכחי: <span className="sub-status-badge expired">ללא מנוי</span></p>
                            <p style={{ margin: '15px 0', color: '#4a5568' }}>כברירת מחדל, אין לך מנוי פעיל. לחצי על הכפתור למטה כדי לרכוש מנוי דיגיטלי.</p>
                            <button className="sub-action-btn purchase" onClick={() => setIsPaymentMode(true)}>🛒 רכישת מנוי חודשי</button>
                        </div>
                    ) : (
                        <div>
                            <p>סטטוס נוכחי:
                                <span className={`sub-status-badge ${isSubActive ? 'active' : 'expired'}`}>
                                    {isSubActive ? 'פעיל בתוקף' : 'פג תוקף'}
                                </span>
                            </p>
                            <p>תאריך התחלה: <strong>{new Date(subData.start_date).toLocaleDateString('he-IL')}</strong></p>
                            <p>תאריך סיום (תוקף): <strong>{new Date(subData.end_date).toLocaleDateString('he-IL')}</strong></p>

                            <button
                                className="sub-action-btn purchase"
                                onClick={() => setIsPaymentMode(true)}
                                disabled={isSubActive}
                                style={{ opacity: isSubActive ? 0.5 : 1, cursor: isSubActive ? 'not-allowed' : 'pointer', marginTop: '20px' }}
                            >
                                {isSubActive ? '🔒 מנוי כבר פעיל (הרכישה חסומה)' : '🔄 חדוש מנוי (פג תוקף)'}
                            </button>
                        </div>
                    )}
                </div>

                <button className="sub-action-btn back" onClick={() => navigate('/profile')} style={{ marginTop: '30px', backgroundColor: '#64748b' }}>
                    ⬅️ חזרה לאזור האישי
                </button>
            </div>
        </div>
    );
}