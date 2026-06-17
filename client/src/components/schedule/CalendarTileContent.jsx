import React from 'react';

export default function CalendarTileContent({ 
    date, 
    view, 
    slots, 
    myAppointments, 
    user, 
    handleGuestClick, 
    handleRegister, 
    handleCancelRegister, 
    handleEditClick, 
    handleDeleteSlot 
}) {
    if (view !== 'month') return null;

    const currentDateString = date.toDateString();
    const daySlots = slots.filter(slot => new Date(slot.session_date).toDateString() === currentDateString);

    if (daySlots.length === 0) return null;

    return (
        <div className="tile-activities-wrapper">
            {daySlots.map(slot => {
                const isRegistered = myAppointments.includes(slot.id);

                return (
                    <div key={slot.id} className="tile-activity-item">
                        <span className="tile-activity-time"> {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                        <span className="tile-activity-text">{slot.session_type}</span>

                        <div className="tile-activity-actions">
                            
                            {!user && (
                                <span className="slot-span-btn guest-btn" onClick={(e) => {
                                    e.stopPropagation(); // מונע קליק כפול על המשבצת כולה
                                    handleGuestClick(slot);
                                }}>
                                     הרשמה
                                </span>
                            )}

                            {user && user.role === 'client' && (
                                isRegistered ? (
                                    <span className="slot-span-btn cancel-btn" onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleCancelRegister(slot.id); 
                                    }}>
                                         ביטול רישום
                                    </span>
                                ) : (
                                    <span className="slot-span-btn register-btn" onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleRegister(slot.id); 
                                    }}>
                                         הרשמה מהירה
                                    </span>
                                )
                            )}

                            {user && user.role === 'admin' && (
                                <div className="admin-actions-layout">
                                    <span className="slot-admin-badge">
                                        👥 {slot.total_registered || 0} רשומים
                                    </span>
                                    <div className="admin-buttons-row">
                                        <span className="slot-span-btn admin-edit-btn-style" onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleEditClick(slot); 
                                        }}>
                                             ערוך
                                        </span>
                                        <span className="slot-span-btn cancel-btn admin-delete-btn-style" onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleDeleteSlot(slot.id); 
                                        }}>
                                             מחק
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