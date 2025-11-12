import React from "react";
import "./AboutPage.css";
// Icons
import { FiCpu, FiGitBranch, FiShield, FiArrowRight, FiTarget, FiCheckCircle } from "react-icons/fi";
// 1. IMPORT ICONS FOR ROLES (Choose appropriate ones)
import { FaUsers, FaLightbulb, FaGraduationCap, FaCode, FaDatabase, FaBrain, FaPalette } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

// --- Data for Timeline (Unchanged) ---
const timelineData = [ /* ... Timeline data remains the same ... */
    { icon: <FaLightbulb className="timeline-icon" />, date: "Early 2024", title: "The Idea Spark", text: "Frustrated by complex medical reports, the founding team envisions a platform to simplify health data for everyone.", align: "left", },
    { icon: <FaUsers className="timeline-icon" />, date: "Mid 2024", title: "Team Assembled", text: "A team of 4 final year Computer Science and Engineering students from Bengaluru joins forces.", align: "right", },
    { icon: <FaGraduationCap className="timeline-icon" />, date: "2024-2025", title: "Major Project Origin 🎓", text: "Developed as a final year major project, applying academic knowledge to solve real-world health data challenges.", align: "left", },
    { icon: <FiGitBranch className="timeline-icon" />, date: "Late 2024", title: "Core Technology Built", text: "Developed the initial AI models for data extraction and interpretation from common lab report formats.", align: "right", },
    { icon: <FiCpu className="timeline-icon" />, date: "Early 2025", title: "Platform Launch (Beta)", text: "MyProject goes live! Users can upload reports and get initial insights and symptom analysis.", align: "left", },
    { icon: <FiCheckCircle className="timeline-icon" />, date: "Mid 2025", title: "Key Features Added", text: "Launched support for RT-PCR report analysis and user-entered symptom predictions.", align: "right", },
    { icon: <FiTarget className="timeline-icon" />, date: "Future Goals", title: "Looking Ahead", text: "Expanding integrations, adding proactive health recommendations, and fostering doctor-patient collaboration features.", align: "left", },
];


// --- UPDATED Team Data with Icons ---
const teamMembers = [
    { name: "Heerali", role: "Backend Developer", icon: <FaCode /> }, // Assign relevant icon
    { name: "Anushree", role: "Backend Developer", icon: <FaDatabase /> }, // Assign relevant icon
    { name: "Anagha", role: "Frotnend Developer", icon: <FaBrain /> }, // Assign relevant icon
    { name: "Anusha", role: "Frotnend Developer", icon: <FaPalette /> }, // Assign relevant icon
];

// --- Reusable Animated Section Component (Unchanged) ---
const AnimatedSection = React.memo(({ children, className = "", delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const style = { transitionDelay: `${delay}s` };
  return (
    <div ref={ref} className={`about-section-item ${className} ${inView ? "is-visible" : ""}`} style={style}>
      {children}
    </div>
  );
});

// --- Main AboutPage Component ---
function AboutPage({ darkMode }) {
  return (
    <div className={`about-page ${darkMode ? "dark" : ""}`}>
      <div className="background-blob"></div>

      {/* --- 1. Hero Section (Unchanged) --- */}
      <section className="about-hero about-section">
          {/* ... Hero content ... */}
        <AnimatedSection delay={0.1}><span className="hero-tagline">Our Mission</span></AnimatedSection>
        <AnimatedSection delay={0.2}><h1>Clarity in a Complex World.</h1></AnimatedSection>
        <AnimatedSection delay={0.3}><p>MyProject was born from a simple idea: your health data should empower you, not confuse you. We're dedicated to transforming dense medical reports into clear, actionable insights for a proactive life.</p></AnimatedSection>
        <AnimatedSection delay={0.4}><a href="/login" className="hero-cta">Get Started Now <FiArrowRight /></a></AnimatedSection>
      </section>

      {/* --- 2. Timeline Section (Unchanged) --- */}
      <section className="about-section timeline-wrapper">
          {/* ... Timeline content ... */}
        <AnimatedSection delay={0.1}><h2 className="timeline-heading">Our Journey So Far</h2></AnimatedSection>
        <div className="timeline-container">
          {timelineData.map((item, index) => (
            <AnimatedSection key={index} className={`timeline-item-wrapper ${item.align}`} delay={0.2 + index * 0.15}>
                <div className="timeline-item">
                    <div className="timeline-icon-container">{item.icon}</div>
                    <div className="timeline-content">
                        <span className="timeline-date">{item.date}</span>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </div>
                </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* --- 3. UPDATED Team Section --- */}
      <section className="about-section team-section">
        <AnimatedSection delay={0.1}><h2>Meet the Innovators</h2></AnimatedSection>
        <AnimatedSection delay={0.2}>
            <p className="team-intro">
                Developed by a dedicated team of final year Computer Science students from MITE.
            </p>
        </AnimatedSection>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <AnimatedSection key={index} className="team-member-card-wrapper" delay={0.3 + index * 0.1}>
                <div className="team-member-card">
                    {/* 2. Render Icon instead of Initials */}
                    <div className="team-member-icon-circle">{member.icon}</div>
                    <h4>{member.name}</h4>
                    <p className="role">{member.role}</p>
                </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AboutPage;