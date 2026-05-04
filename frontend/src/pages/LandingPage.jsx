import React, { useState, useEffect } from 'react';

const ROLES = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Student',
    desc: 'Access your portal, community, and resources.',
    color: '#10B981',
    delay: 0.1,
  },
  {
    id: 'teacher',
    icon: '👨‍🏫',
    title: 'Teacher',
    desc: 'Manage grades, calendars, and communicate.',
    color: '#3B82F6',
    delay: 0.2,
  },
  {
    id: 'admin',
    icon: '🛡️',
    title: 'Administrator',
    desc: 'Full platform management and oversight.',
    color: '#8B5CF6',
    delay: 0.3,
  },
];

function LandingPage({ onSelectRole }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Background decorative blobs */}
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

      {/* Logo + Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <img
          src="/src/assets/logo.png"
          alt="EMSIGHT"
          style={{ height: '90px', marginBottom: '1.25rem', filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.25))' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #10B981, #059669)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}>
          EMSIGHT
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: '#64748b',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Integrated Student Ecosystem
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          justifyContent: 'center', marginTop: '1.5rem',
        }}>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #10B981)' }} />
          <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Who are you?
          </span>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #10B981)' }} />
        </div>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '0 1.5rem',
        maxWidth: '900px',
        width: '100%',
      }}>
        {ROLES.map((role, i) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            onMouseEnter={() => setHovered(role.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: '1 1 230px',
              maxWidth: '270px',
              background: 'rgba(255,255,255,0.92)',
              border: `2px solid ${hovered === role.id ? role.color : '#e2e8f0'}`,
              borderRadius: '20px',
              padding: '2.25rem 1.75rem',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: hovered === role.id
                ? `0 20px 40px -8px ${role.color}30`
                : '0 4px 20px rgba(0,0,0,0.07)',
              transform: visible
                ? hovered === role.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
                : 'translateY(40px) scale(0.95)',
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${role.delay}s, transform ${hovered ? '0.2s' : '0.5s ease ' + role.delay + 's'}`,
            }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${role.color}20, ${role.color}10)`,
              border: `2px solid ${role.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.25rem',
              margin: '0 auto 1.25rem',
              transition: 'transform 0.2s',
              transform: hovered === role.id ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
            }}>
              {role.icon}
            </div>
            <h2 style={{
              fontSize: '1.2rem', fontWeight: 700,
              color: hovered === role.id ? role.color : '#1e293b',
              marginBottom: '0.5rem',
              transition: 'color 0.2s',
            }}>
              {role.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              {role.desc}
            </p>
            <div style={{
              marginTop: '1.5rem',
              height: '3px',
              borderRadius: '2px',
              background: `linear-gradient(to right, ${role.color}, ${role.color}60)`,
              opacity: hovered === role.id ? 1 : 0,
              transition: 'opacity 0.2s',
            }} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: '1.5rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.5s',
        fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center',
      }}>
        EMSIGHT © 2026 · École Marocaine des Sciences de l'Ingénieur
      </div>
    </div>
  );
}

export default LandingPage;
