import React, { useState, useEffect } from 'react';
import api from '../api';
import AvatarDisplay, { getAvatarUrl, setAvatarUrl } from '../components/AvatarDisplay';

// Simple smiling avatars for male / female
const MALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortFlat&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&top=shortRound&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&top=sides&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah&top=dreads&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&top=shortWaved&mouth=smile&eyebrows=default',
];
const FEMALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&top=longHair&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&top=bob&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Hajar&top=curly&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lina&top=straight&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara&top=bigHair&mouth=smile&eyebrows=default',
];

function InitialsAvatar({ firstName, lastName, size = 80 }) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #10B981, #059669)',
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size / 2.8, letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function ProfileSection({ demoUser }) {
  const [avatarKey, setAvatarKey] = useState(0); // bumped to force re-render after change
  const [showPicker, setShowPicker] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: demoUser?.first_name || '',
    last_name: demoUser?.last_name || '',
    email: demoUser?.email || '',
  });

  const currentAvatarUrl = getAvatarUrl(demoUser?.id);

  const handleSelectAvatar = (url) => {
    setAvatarUrl(demoUser?.id, url); // writes to localStorage via shared helper
    setAvatarKey(k => k + 1);
    setShowPicker(false);
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl(demoUser?.id, null); // clears from localStorage
    setAvatarKey(k => k + 1);
    setShowPicker(false);
  };

  const handleSaveProfile = () => setEditMode(false);

  return (
    <div className="tab-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Avatar Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '120px', height: '120px', borderRadius: '50%',
                overflow: 'hidden', border: '3px solid rgba(16,185,129,0.35)',
                flexShrink: 0, cursor: 'pointer',
              }}
              onClick={() => setShowPicker(!showPicker)}
              title="Change avatar"
            >
              <AvatarDisplay key={avatarKey} demoUser={demoUser} size={120} />
            </div>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
            >
              {showPicker ? 'Close' : '🖼 Change Avatar'}
            </button>
          </div>

          {/* Name & Info */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">First Name</label>
                  <input className="input-field" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Last Name</label>
                  <input className="input-field" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Email</label>
                  <input className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: '0.2rem' }}>
                  {formData.first_name} {formData.last_name}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                  {demoUser?.role === 'admin' ? 'Administrator' : 'Student · Community Member'}
                </p>
                <button className="btn btn-secondary" style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }} onClick={() => setEditMode(true)}>
                  ✏️ Edit Profile
                </button>
              </>
            )}

            {/* Info grid */}
            {!editMode && demoUser && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.875rem' }}>
                {[
                  { label: 'Matricule', value: demoUser.matricule, highlight: true },
                  { label: 'Email', value: formData.email || demoUser.email },
                  demoUser.student_profile && { label: 'Major', value: demoUser.student_profile.filiere },
                  demoUser.student_profile && { label: 'Year', value: `Year ${demoUser.student_profile.annee_etude}` },
                  demoUser.student_profile && { label: 'Tutor', value: demoUser.student_profile.tutor_name },
                  demoUser.admin_profile && { label: 'Service', value: demoUser.admin_profile.service },
                ].filter(Boolean).map(({ label, value, highlight }) => (
                  <div key={label} style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--background)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                      {label}
                    </p>
                    <p style={{ fontWeight: 600, color: highlight ? 'var(--primary)' : 'inherit', fontSize: '0.9rem' }}>
                      {value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Avatar Picker */}
        {showPicker && (
          <div style={{
            marginTop: '1.5rem', padding: '1.25rem',
            background: 'var(--background)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>👤 Male Avatars</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {MALE_AVATARS.map(url => (
                <img
                  key={url} src={url} alt="avatar" onClick={() => handleSelectAvatar(url)}
                  style={{
                    width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer',
                    border: currentAvatarUrl === url ? '3px solid #10B981' : '2px solid #e2e8f0',
                    transition: 'transform 0.15s', objectFit: 'cover',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>👩 Female Avatars</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {FEMALE_AVATARS.map(url => (
                <img
                  key={url} src={url} alt="avatar" onClick={() => handleSelectAvatar(url)}
                  style={{
                    width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer',
                    border: currentAvatarUrl === url ? '3px solid #10B981' : '2px solid #e2e8f0',
                    transition: 'transform 0.15s', objectFit: 'cover',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            <button className="btn btn-danger" style={{ fontSize: '0.8rem' }} onClick={handleDeleteAvatar}>
              🗑 Remove Avatar (use initials)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityStudentDashboard({ demoUser, activeTab }) {
  const [offers, setOffers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // CV Analyzer state
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [cvResult, setCvResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvInputMode, setCvInputMode] = useState('file'); // 'file' | 'text'

  useEffect(() => {
    fetchOffers();
    fetchMaterials();
    fetchAnnouncements();
  }, []);

  const fetchOffers = () => api.get('/community/offers/').then(res => setOffers(res.data)).catch(console.error);
  const fetchMaterials = () => api.get('/community/materials/').then(res => setMaterials(res.data)).catch(console.error);
  const fetchAnnouncements = () => api.get('/community/announcements/').then(res => setAnnouncements(res.data)).catch(console.error);

  const handleAnalyzeCV = () => {
    if (cvInputMode === 'file' && !cvFile) { alert('Please upload a PDF CV first.'); return; }
    if (cvInputMode === 'text' && !cvText.trim()) { alert('Please paste your CV text.'); return; }

    setIsAnalyzing(true);

    if (cvInputMode === 'file') {
      const formData = new FormData();
      formData.append('file', cvFile);
      api.post('/community/cv_analyze/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => { setCvResult(res.data); setIsAnalyzing(false); })
        .catch(() => { setIsAnalyzing(false); alert('Failed to analyze CV. Make sure it is a valid PDF.'); });
    } else {
      api.post('/community/cv_analyze/', { text: cvText })
        .then(res => { setCvResult(res.data); setIsAnalyzing(false); })
        .catch(() => { setIsAnalyzing(false); alert('Failed to analyze CV text.'); });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection demoUser={demoUser} />;

      case 'offers':
        return (
          <div className="tab-content animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Internships & Projects (PFA/PFE)</h2>
            <div className="grid-cards">
              {offers.map(offer => (
                <div key={offer.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className="badge badge-success">{offer.offer_type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(offer.date_posted).toLocaleDateString()}</span>
                  </div>
                  <h3>{offer.title}</h3>
                  <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '5px' }}>🏢 {offer.company}</p>
                  {offer.location && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>📍 {offer.location}</p>}
                  <p style={{ flex: 1, marginBottom: '15px' }}>{offer.description}</p>
                  {offer.created_by && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      Posted by {offer.created_by.first_name} {offer.created_by.last_name}
                    </p>
                  )}
                </div>
              ))}
              {offers.length === 0 && <p>No offers available.</p>}
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="tab-content animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Materials (CV & Cover Letters)</h2>
            <div className="grid-cards">
              {materials.map(material => (
                <div key={material.id} className="glass-panel">
                  <span className="badge badge-info">{material.material_type}</span>
                  <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>{material.title}</h3>
                  <p style={{ marginBottom: '15px' }}>{material.description}</p>
                  {material.file_url && (
                    <a href={material.file_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-small">
                      View Material
                    </a>
                  )}
                </div>
              ))}
              {materials.length === 0 && <p>No materials available.</p>}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="tab-content animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Campus Announcements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map(ann => (
                <div key={ann.id} className="glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
                  <h3 style={{ marginBottom: '5px' }}>{ann.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {new Date(ann.date_posted).toLocaleDateString()}
                    {ann.created_by && ` · By ${ann.created_by.first_name} ${ann.created_by.last_name}`}
                  </p>
                  <p>{ann.content}</p>
                </div>
              ))}
              {announcements.length === 0 && <p>No announcements.</p>}
            </div>
          </div>
        );

      case 'cv_analyzer':
      case 'cvanalyzer':
        return (
          <div className="tab-content animate-fade-in glass-panel">
            <h2 style={{ marginBottom: '6px' }}>AI CV Analyzer</h2>
            <p style={{ marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
              Upload your CV as a PDF, or paste the text directly, for an ATS score and recommendations.
            </p>

            {/* Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {['file', 'text'].map(mode => (
                <button
                  key={mode}
                  className={`btn ${cvInputMode === mode ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setCvInputMode(mode)}
                >
                  {mode === 'file' ? '📄 Upload PDF' : '📝 Paste Text'}
                </button>
              ))}
            </div>

            {cvInputMode === 'file' ? (
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <input
                  type="file" accept=".pdf"
                  onChange={e => setCvFile(e.target.files[0])}
                  className="input-field" style={{ padding: '10px' }}
                />
              </div>
            ) : (
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Paste your CV text</label>
                <textarea
                  className="input-field" rows={8}
                  value={cvText} onChange={e => setCvText(e.target.value)}
                  placeholder="Paste your CV content here..."
                />
              </div>
            )}

            <button onClick={handleAnalyzeCV} disabled={isAnalyzing} className="btn btn-primary">
              {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze My CV'}
            </button>

            {cvResult && (
              <div style={{
                marginTop: '1.5rem', padding: '1.25rem',
                background: 'var(--background)', borderRadius: 'var(--radius-md)',
                borderLeft: `4px solid ${cvResult.score > 70 ? 'var(--success)' : 'var(--danger)'}`,
              }}>
                <h3>ATS Score: <span style={{ color: cvResult.score > 70 ? 'var(--success)' : 'var(--danger)' }}>{cvResult.score}/100</span></h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1rem', fontSize: '0.9rem' }}>Words parsed: {cvResult.parsed_words}</p>
                <h4>Recommendations:</h4>
                <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cvResult.recommendations.map((rec, idx) => (
                    <li key={idx} style={{ color: 'var(--text-main)' }}>⚠️ {rec}</li>
                  ))}
                  {cvResult.recommendations.length === 0 && (
                    <li style={{ color: 'var(--success)' }}>✅ Your CV looks great! No major ATS issues found.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="dashboard-content">
      {renderContent()}
    </div>
  );
}

export default CommunityStudentDashboard;
