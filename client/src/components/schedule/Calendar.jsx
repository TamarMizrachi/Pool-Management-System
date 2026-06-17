import React, { useState, useEffect } from 'react';
import ReactCalendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import './Calendar.css';

import AdminSlotForm from './AdminSlotForm';
import AdminLiveStatus from './AdminLiveStatus';
import CalendarTileContent from './CalendarTileContent';

export default function Calendar() {
    const { user } = useAuth(); 
    const { sendRequest, loading } = useFetch(); 
    const [slots, setSlots] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]); 

    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newStart, setNewStart] = useState('');
    const [newEnd, setNewEnd] = useState('');
    const [newType, setNewType] = useState('רחצת גברים');
    const [isEditing, setIsEditing] = useState(false);
    const [editingSlotId, setEditingSlotId] = useState(null);

    const getCurrentSlotInfo = () => {
        const now = new Date();
        const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

        return slots.find(slot => {
            const slotDate = new Date(slot.session_date).toDateString();
            return slotDate === now.toDateString() && currentTimeString >= slot.start_time && currentTimeString <= slot.end_time;
        });
    };

    const activeLiveSlot = getCurrentSlotInfo();

    const loadScheduleData = async () => {
        try {
            const data = await sendRequest('/api/schedule', 'GET', null, false);
            setSlots(data);

            if (user && user.role === 'client') {
                const appointments = await sendRequest('/api/schedule/my-appointments', 'GET', null, true);
                setMyAppointments(appointments.map(app => app.slot_id));
            }
        } catch (err) {
            console.error('שגיאה בטעינת הנתונים:', err.message);
        }
    };

    useEffect(() => {
        loadScheduleData();
    }, [user]);

    const handleRegister = async (slotId) => {
        try {
            await sendRequest('/api/schedule/appointment/register', 'POST', { slot_id: slotId }, true);
            alert('נרשמת בהצלחה לשעת הפעילות במתחם!');
            loadScheduleData();
        } catch (err) { alert(err.message || 'שגיאה בתהליך הרישום'); }
    };

    const handleCancelRegister = async (slotId) => {
        try {
            await sendRequest('/api/schedule/appointment/cancel', 'DELETE', { slot_id: slotId }, true);
            alert('ההרשמה שלך למשמרת בבוטלה בהצלחה.');
            loadScheduleData();
        } catch (err) { alert(err.message || 'שגיאה בביטול הרישום'); }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm('האם אתה בטוח שברצונך למחוק משמרת זו לחלוטין מהלוח?')) return;
        try {
            await sendRequest(`/api/schedule/${slotId}`, 'DELETE', null, true);
            alert('המשמרת נמחקה בהצלחה מהמערכת.');
            loadScheduleData();
        } catch (err) { alert(err.message || 'שגיאה במחיקת המשמרת'); }
    };

    const handleEditClick = (slot) => {
        setIsEditing(true);
        setEditingSlotId(slot.id);
        setNewDate(new Date(slot.session_date).toISOString().split('T')[0]);
        setNewStart(slot.start_time.substring(0, 5));
        setNewEnd(slot.end_time.substring(0, 5));
        setNewType(slot.session_type);
        setShowAdminForm(true);
        document.getElementById('schedule-section').scrollIntoView({ behavior: 'smooth' });
    };

    const handleGuestClick = (slot) => {
        alert(`כדי להירשם ל${slot.session_type} בין השעות ${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}, אנא התחברו או הרשמו תחילה למערכת.`);
    };

    const handleAddSlotSubmit = async (e) => {
        e.preventDefault();
        const payload = { session_date: newDate, start_time: newStart, end_time: newEnd, session_type: newType };
        try {
            if (isEditing) {
                await sendRequest(`/api/schedule/${editingSlotId}`, 'PUT', payload, true);
                alert('המשמרת עודכנה בהצלחה!');
            } else {
                await sendRequest('/api/schedule', 'POST', payload, true);
                alert('המשמרת נוספה בהצלחה!');
            }
            setShowAdminForm(false);
            setIsEditing(false);
            setEditingSlotId(null);
            setNewDate(''); setNewStart(''); setNewEnd('');
            loadScheduleData();
        } catch (err) { alert(err.message || 'שגיאה בשמירת הנתונים'); }
    };

    return (
        <section id="schedule-section" className="schedule-section">
            <div className="section-title">
                <h2>📅 לוח שעות פעילות חודשי ומערכת רישום</h2>
                <div className="title-underline"></div>

                <AdminLiveStatus
                    user={user}
                    activeLiveSlot={activeLiveSlot}
                    showAdminForm={showAdminForm}
                    setShowAdminForm={setShowAdminForm}
                />
            </div>

            <AdminSlotForm
                showAdminForm={showAdminForm} setShowAdminForm={setShowAdminForm}
                isEditing={isEditing} setIsEditing={setIsEditing}
                newDate={newDate} setNewDate={setNewDate}
                newStart={newStart} setNewStart={setNewStart}
                newEnd={newEnd} setNewEnd={setNewEnd}
                newType={newType} setNewType={setNewType}
                onSubmit={handleAddSlotSubmit}
            />

            <div className="full-width-calendar-container">
                {loading && <div className="schedule-loading-overlay">מעדכן לוח שעות...</div>}

                <ReactCalendar
                    locale="he-IL"
                    tileContent={(props) => (
                        <CalendarTileContent
                            {...props}
                            slots={slots}
                            myAppointments={myAppointments}
                            user={user}
                            handleGuestClick={handleGuestClick}
                            handleRegister={handleRegister}
                            handleCancelRegister={handleCancelRegister}
                            handleEditClick={handleEditClick}
                            handleDeleteSlot={handleDeleteSlot}
                        />
                    )}
                />
            </div>
        </section>
    );
}