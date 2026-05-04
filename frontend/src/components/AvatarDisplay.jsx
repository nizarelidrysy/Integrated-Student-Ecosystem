/**
 * AvatarDisplay — shared component for displaying user avatars across all platforms.
 * Reads avatar from localStorage so it persists between portal, community, etc.
 * Falls back to user's initials in a gradient circle.
 */
import React from 'react';

export function getAvatarUrl(userId) {
  if (!userId) return null;
  return localStorage.getItem(`avatar_${userId}`) || null;
}

export function setAvatarUrl(userId, url) {
  if (!userId) return;
  if (url) {
    localStorage.setItem(`avatar_${userId}`, url);
  } else {
    localStorage.removeItem(`avatar_${userId}`);
  }
}

export function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
}

const ROLE_GRADIENT = {
  student: 'linear-gradient(135deg, #10B981, #059669)',
  teacher: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
  admin:   'linear-gradient(135deg, #8B5CF6, #6D28D9)',
};

/**
 * AvatarDisplay
 * @param {object}  demoUser  - the user object (needs id, first_name, last_name, role)
 * @param {number}  size      - diameter in px (default 120)
 * @param {string}  border    - CSS border string (optional)
 */
function AvatarDisplay({ demoUser, size = 120, border }) {
  const userId = demoUser?.id;
  const avatarUrl = getAvatarUrl(userId);
  const initials = getInitials(demoUser?.first_name, demoUser?.last_name);
  const gradient = ROLE_GRADIENT[demoUser?.role] || ROLE_GRADIENT.student;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    border: border || `3px solid rgba(16,185,129,0.3)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (avatarUrl) {
    return (
      <div style={containerStyle}>
        <img
          src={avatarUrl}
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  // Initials fallback
  return (
    <div style={{
      ...containerStyle,
      background: gradient,
      color: 'white',
      fontWeight: 800,
      fontSize: size / 2.8,
      letterSpacing: '-0.02em',
    }}>
      {initials}
    </div>
  );
}

export default AvatarDisplay;
