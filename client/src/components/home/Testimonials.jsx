import React from 'react';

function Testimonials() {
    const reviews = [
        {
            id: 1,
            text: '"הבריכה הכי נקייה, מאורגנת ואיכותית שיצא לי להתאמן בה בארץ. המים תמיד בטמפרטורה מושלמת והאווירה נהדרת!"',
            author: 'אבירם מ.'
        },
        {
            id: 2,
            text: '"מקום יפהפה ברמות אחרות! צוות המצילים עירני ומקצועי, מתקני הבריכה מתוחזקים ברמה הגבוהה ביותר שיש. מומלץ בחום!"',
            author: 'רוני א.'
        }
    ];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="section-title">
                <h2>מה המנויים שלנו מספרים?</h2>
                <div className="title-underline"></div>
            </div>
            <div className="testimonials-grid">
                {reviews.map(review => (
                    <div key={review.id} className="testimonial-card">
                        <span className="quote-icon">”</span>
                        <p className="testimonial-text">{review.text}</p>
                        <h4 className="testimonial-author">- {review.author}</h4>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Testimonials;