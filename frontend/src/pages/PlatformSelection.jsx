import React, { useState, useEffect } from 'react';

const PLATFORMS = [
  {
    id: 'portal',
    icon: '🏫',
    title: 'Student Portal',
    desc: 'Academic records, absences, grades, and documents.',
    color: '#10B981',
    delay: 0.1,
  },
  {
    id: 'community',
    icon: '🌍',
    title: 'EMSI Community',
    desc: 'Internships, CV analysis, networking, and resources.',
    color: '#3B82F6',
    delay: 0.2,
    teacherDisabled: true,
  },
  {
    id: 'share',
    icon: '🔗',
    title: 'EMSI Share',
    desc: 'Shared resources platform — coming soon.',
    color: '#8B5CF6',
    delay: 0.3,
    comingSoon: true,
  },
];

const ROLE_COLORS = { student: '#10B981', teacher: '#3B82F6', admin: '#8B5CF6' };
const ROLE_ICONS = { student: '🎓', teacher: '👨‍🏫', admin: '🛡️' };

function PlatformSelection({ currentRole, onSelectPlatform, onBack }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const roleColor = ROLE_COLORS[currentRole] || '#10B981';
  const roleIcon = ROLE_ICONS[currentRole] || '👤';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 40%, #eff6ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: '2rem', left: '2rem',
          background: 'rgba(255,255,255,0.8)', border: '1px solid #e2e8f0',
          color: '#64748b', cursor: 'pointer', fontSize: '0.9rem',
          fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '8px',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.4rem',
          transition: 'all 0.2s',
          opacity: visible ? 1 : 0,
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#10B981'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.color = '#64748b'; }}
      >
        ← Back
      </button>

      {/* Logo + Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <img
          src="/src/assets/logo.png"
          alt="EMSIGHT"
          style={{ height: '75px', marginBottom: '1rem', filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.25))' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <h1 style={{
          fontSize: '2.25rem', fontWeight: 900,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '-0.04em', marginBottom: '0.5rem',
        }}>
          Choose a Platform
        </h1>

        {/* Role pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '999px',
          background: `${roleColor}18`, border: `1px solid ${roleColor}40`,
          fontSize: '0.85rem', fontWeight: 600, color: roleColor,
          marginTop: '0.5rem',
        }}>
          <span>{roleIcon}</span>
          <span>Continuing as {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}</span>
        </div>
      </div>

      {/* Platform Cards */}
      <div style={{
        display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
        justifyContent: 'center', padding: '0 1.5rem', maxWidth: '900px', width: '100%',
      }}>
        {PLATFORMS.map(platform => {
          const isDisabled = platform.teacherDisabled && currentRole === 'teacher';
          const isClickable = !isDisabled;

          return (
            <div
              key={platform.id}
              onClick={() => isClickable && onSelectPlatform(platform.id)}
              onMouseEnter={() => isClickable && setHovered(platform.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: '1 1 230px', maxWidth: '270px',
                background: isDisabled ? 'rgba(241,245,249,0.8)' : 'rgba(255,255,255,0.92)',
                border: `2px solid ${hovered === platform.id ? platform.color : '#e2e8f0'}`,
                borderRadius: '20px', padding: '2.25rem 1.75rem',
                textAlign: 'center',
                cursor: isClickable ? 'pointer' : 'not-allowed',
                boxShadow: hovered === platform.id
                  ? `0 20px 40px -8px ${platform.color}30`
                  : '0 4px 20px rgba(0,0,0,0.07)',
                transform: visible
                  ? hovered === platform.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0)'
                  : 'translateY(40px) scale(0.95)',
                opacity: visible ? (isDisabled ? 0.5 : 1) : 0,
                transition: `opacity 0.5s ease ${platform.delay}s, transform ${hovered === platform.id ? '0.2s' : `0.5s ease ${platform.delay}s`}`,
                position: 'relative',
              }}
            >
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${platform.color}20, ${platform.color}10)`,
                border: `2px solid ${platform.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.25rem', margin: '0 auto 1.25rem',
                transition: 'transform 0.2s',
                transform: hovered === platform.id ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
              }}>
                {platform.icon}
              </div>
              <h2 style={{
                fontSize: '1.15rem', fontWeight: 700,
                color: hovered === platform.id ? platform.color : '#1e293b',
                marginBottom: '0.5rem', transition: 'color 0.2s',
              }}>
                {platform.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                {platform.desc}
              </p>
              {isDisabled && (
                <span style={{
                  display: 'inline-block', marginTop: '0.875rem',
                  padding: '0.2rem 0.75rem', background: '#fef2f2',
                  color: '#dc2626', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  Not available for Teachers
                </span>
              )}
              {platform.comingSoon && !isDisabled && (
                <span style={{
                  display: 'inline-block', marginTop: '0.875rem',
                  padding: '0.2rem 0.75rem', background: `${platform.color}15`,
                  color: platform.color, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  Coming Soon
                </span>
              )}
              <div style={{
                marginTop: '1.25rem', height: '3px', borderRadius: '2px',
                background: `linear-gradient(to right, ${platform.color}, ${platform.color}60)`,
                opacity: hovered === platform.id ? 1 : 0, transition: 'opacity 0.2s',
              }} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: '1.5rem',
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
        fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center',
      }}>
        EMSIGHT © 2026 · École Marocaine des Sciences de l'Ingénieur
      </div>
    </div>
  );
}

export default PlatformSelection;
