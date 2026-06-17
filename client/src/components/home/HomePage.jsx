import React from 'react';
import Calendar from '../schedule/Calendar';
import Testimonials from './Testimonials'; // הרכיב החדש שהוצאנו
import './HomePage.css';
import poolHeroImg from '../../assets/pool-top-view.jpg';

function HomePage() {
    return (
        <div className="homepage-container" id="top">

            <header id="about" className="hero-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.65)), url(${poolHeroImg})` }}>
                <div className="hero-content">
                    <p className="hero-tagline">PoolHub - Dive Into Better Experiences</p>
                    <p className="hero-description">
                        ברוכים הבאים למתחם השחייה המוביל והמתקדם ביותר! מים צלולים ונקיים בטמפרטורה מבוקרת, חוויית שחייה יוקרתית, שירות מקצועי ורמת בטיחות ללא פשרות.
                    </p>
                    <a href="#schedule-section" className="btn-hero-action">התחילו בסיור הווירטואלי</a>
                </div>
            </header>

            <section  className="info-section">
                <div id="media" className="media-section">
                    <div className="section-title">
                        <h2>מדיה, סיור וכללי בטיחות</h2>
                        <div className="title-underline"></div>
                    </div>

                    <div className="media-grid">
                        {/* קטע סרטונים והסרטות של הבריכה */}
                        <div className="media-card">
                            <h3>📹 הסרטות וסיור במתחם</h3>
                            <p className="card-subtitle">הציצו בסרטון הווידאו הרשמי של מתחם הבריכה והמתקנים שלנו:</p>
                            <div className="video-wrapper">
                                <video controls width="100%">
                                    <source src="/pool-video.mp4" type="video/mp4" />
                                    הדפדפן שלך אינו תומך בניגון וידאו.
                                </video>
                            </div>
                        </div>

                        {/* קטע כללי בטיחות בשמע (Audio) */}
                        <div className="media-card" id="safety">
                            <h3>🔊 כללי בטיחות בשמע</h3>
                            <p className="card-subtitle">לפני הכניסה למים, חובה להאזין להנחיות הבטיחות וההתנהגות במתחם:</p>
                            <div className="audio-wrapper">
                                <audio controls>
                                    <source src="/safety-rules.mp3" type="audio/mpeg" />
                                    הדפדפן שלך אינו תומך בניגון אודיו.
                                </audio>
                            </div>
                            <ul className="rules-list">
                                <li>הכניסה לשטח המים אך ורק באישור ובנוכחות המציל.</li>
                                <li>חל איסור מוחלט לרוץ בשטח סביב הבריכה למניעת החלקה.</li>
                                <li>יש להישמע להוראות צוות המצילים וההנהלה בכל עת.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonials />

            <section id="schedule-section">
                <Calendar />
            </section>

            <footer className="site-footer">
                <p>© 2026 PoolHub - כל הזכויות שמורות לפרויקט הבריכה של תמר ושושנה</p>
            </footer>

        </div>
    );
}

export default HomePage;