import React from 'react';

export default function DownloadHistoryBtn({ appointments, userFullName }) {

    if (!appointments || appointments.length === 0) return null;

    const handleDownloadTxt = () => {

        let fileContent = `==================================================\n`;
        fileContent += `       דוח היסטוריית רישומים - בריכת PoolHub       \n`;
        fileContent += `==================================================\n\n`;
        fileContent += `שלום וברכה, ${userFullName || 'מנוי יקר'}\n`;
        fileContent += `להלן רשימת חלונות הזמן והמשמרות שהוזמנו על ידך במערכת:\n\n`;

        appointments.forEach((app, index) => {
            const formattedDate = new Date(app.session_date).toLocaleDateString('he-IL');
            const startTime = app.start_time.substring(0, 5);
            const endTime = app.end_time.substring(0, 5);
            
            fileContent += `${index + 1}. תאריך: ${formattedDate} | שעות: ${startTime} - ${endTime} | סוג פעילות: ${app.session_type}\n`;
        });

        fileContent += `\n\n--------------------------------------------------\n`;
        fileContent += `הופק אוטומטית בתאריך: ${new Date().toLocaleDateString('he-IL')} | תודה שבחרת ב-PoolHub!\n`;

        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `PoolHub_History_${userFullName || 'User'}.txt`;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button 
            onClick={handleDownloadTxt}
            className="renew-sub-btn" 
            style={{ 
                backgroundColor: '#10b981', 
                marginBottom: '15px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
             הורד דוח רישומים לקובץ טקסט (TXT)
        </button>
    );
}