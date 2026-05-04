import React, { useState, useEffect } from 'react';
import api from '../api';

const MALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortFlat&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&top=shortRound&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&top=shortWaved&mouth=smile&eyebrows=default',
];
const FEMALE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&top=longHair&mouth=smile&eyebrows=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&top=bob&mouth=smile&eyebrows=default',
];

function CommunityAdminDashboard({ demoUser, activeTab }) {
  const [offers, setOffers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem(`avatar_${demoUser?.id}`) || null);
  const [showPicker, setShowPicker] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ first_name: demoUser?.first_name || '', last_name: demoUser?.last_name || '', email: demoUser?.email || '' });

  // Form states
  const [newOffer, setNewOffer] = useState({ title: '', company: '', location: '', description: '', offer_type: 'Internship' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchOffers();
    fetchAnnouncements();
    api.get('/accounts/users/').then(res => setAllUsers(res.data.filter(u => u.role !== 'teacher'))).catch(console.error);
  }, []);

  const fetchOffers = () => {
    api.get('/community/offers/')
      .then(res => setOffers(res.data))
      .catch(err => console.error(err));
  };

  const fetchAnnouncements = () => {
    api.get('/community/announcements/')
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error(err));
  };

  const handleCreateOffer = (e) => {
    e.preventDefault();
    api.post('/community/offers/', newOffer)
      .then(() => {
        setNewOffer({ title: '', company: '', location: '', description: '', offer_type: 'Internship' });
        fetchOffers();
      })
      .catch(err => console.error(err));
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    api.post('/community/announcements/', newAnnouncement)
      .then(() => {
        setNewAnnouncement({ title: '', content: '' });
        fetchAnnouncements();
      })
      .catch(err => console.error(err));
  };

  const deleteOffer = (id) => {
    api.delete(`/community/offers/${id}/`)
      .then(() => fetchOffers())
      .catch(err => console.error(err));
  };

  const handleSelectAvatar = (url) => { setAvatarUrl(url); localStorage.setItem(`avatar_${demoUser?.id}`, url); setShowPicker(false); };
  const handleDeleteAvatar = () => { setAvatarUrl(null); localStorage.removeItem(`avatar_${demoUser?.id}`); setShowPicker(false); };
  const initials = `${demoUser?.first_name?.[0] || ''}${demoUser?.last_name?.[0] || ''}`.toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel">
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(139,92,246,0.35)', cursor: 'pointer' }} onClick={() => setShowPicker(!showPicker)}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '2.5rem' }}>{initials}</div>
                    )}
                  </div>
                  <button className="btn btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => setShowPicker(!showPicker)}>🖼 Change Avatar</button>
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  {editMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}><label className="input-label">First Name</label><input className="input-field" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} /></div>
                      <div className="input-group" style={{ marginBottom: 0 }}><label className="input-label">Last Name</label><input className="input-field" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} /></div>
                      <div className="input-group" style={{ marginBottom: 0 }}><label className="input-label">Email</label><input className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-primary" onClick={() => setEditMode(false)}>Save Changes</button>
                        <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ marginBottom: '0.2rem' }}>{formData.first_name} {formData.last_name}</h2>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Administrator · Community</p>
                      <button className="btn btn-secondary" style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }} onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
                    </>
                  )}
                  {!editMode && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px,1fr))', gap: '0.875rem' }}>
                      {[
                        { label: 'Matricule', value: demoUser?.matricule, highlight: true },
                        { label: 'Email', value: formData.email || demoUser?.email },
                        { label: 'Service', value: demoUser?.admin_profile?.service },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} style={{ padding: '0.75rem 1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</p>
                          <p style={{ fontWeight: 600, color: highlight ? 'var(--primary)' : 'inherit' }}>{value || '—'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {showPicker && (
                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>👤 Male Avatars</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {MALE_AVATARS.map(url => <img key={url} src={url} alt="" onClick={() => handleSelectAvatar(url)} style={{ width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', border: avatarUrl === url ? '3px solid #10B981' : '2px solid #e2e8f0' }} />)}
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>👩 Female Avatars</p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {FEMALE_AVATARS.map(url => <img key={url} src={url} alt="" onClick={() => handleSelectAvatar(url)} style={{ width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', border: avatarUrl === url ? '3px solid #10B981' : '2px solid #e2e8f0' }} />)}
                  </div>
                  <button className="btn btn-danger" style={{ fontSize: '0.8rem' }} onClick={handleDeleteAvatar}>🗑 Remove (use initials)</button>
                </div>
              )}
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="tab-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div className="glass-panel">
              <h2 style={{marginBottom: '1.5rem'}}>Manage Offers</h2>
              <form onSubmit={handleCreateOffer} className="admin-form" style={{maxWidth: '100%'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                  <div className="input-group" style={{marginBottom: 0}}>
                    <label className="input-label">Title</label>
                    <input type="text" className="input-field" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} required />
                  </div>
                  <div className="input-group" style={{marginBottom: 0}}>
                    <label className="input-label">Company</label>
                    <input type="text" className="input-field" value={newOffer.company} onChange={e => setNewOffer({...newOffer, company: e.target.value})} required />
                  </div>
                  <div className="input-group" style={{marginBottom: 0}}>
                    <label className="input-label">Location (Google Maps or Text)</label>
                    <input type="text" className="input-field" value={newOffer.location} onChange={e => setNewOffer({...newOffer, location: e.target.value})} />
                  </div>
                  <div className="input-group" style={{marginBottom: 0}}>
                    <label className="input-label">Offer Type</label>
                    <select className="input-field" value={newOffer.offer_type} onChange={e => setNewOffer({...newOffer, offer_type: e.target.value})}>
                      <option value="Internship">Internship</option>
                      <option value="PFA">PFA</option>
                      <option value="PFE">PFE</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <textarea className="input-field" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} required rows={4} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: 'max-content'}}>Post Offer</button>
              </form>
            </div>
            
            <div className="grid-cards">
              {offers.map(offer => (
                <div key={offer.id} className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
                  <span className="badge badge-success" style={{alignSelf: 'flex-start', marginBottom: '10px'}}>{offer.offer_type}</span>
                  <h3 style={{marginBottom: '5px'}}>{offer.title}</h3>
                  <p style={{fontWeight: 600, color: 'var(--primary)', marginBottom: '5px'}}>{offer.company}</p>
                  {offer.location && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px'}}>📍 {offer.location}</p>}
                  <p style={{flex: 1, marginBottom: '15px'}}>{offer.description}</p>
                  <button onClick={() => deleteOffer(offer.id)} className="btn btn-danger btn-small" style={{marginTop: 'auto', alignSelf: 'flex-end'}}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="tab-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div className="glass-panel">
              <h2 style={{marginBottom: '1.5rem'}}>Campus Announcements</h2>
              <form onSubmit={handleCreateAnnouncement} className="admin-form" style={{maxWidth: '100%'}}>
                <div className="input-group">
                  <label className="input-label">Title</label>
                  <input type="text" className="input-field" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Content</label>
                  <textarea className="input-field" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} required rows={4} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: 'max-content'}}>Post Announcement</button>
              </form>
            </div>
            
            <div className="announcement-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {announcements.map(ann => (
                <div key={ann.id} className="glass-panel">
                  <h3 style={{marginBottom: '10px'}}>{ann.title}</h3>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px'}}>{new Date(ann.date_posted).toLocaleDateString()}</p>
                  <p>{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'directory':
        return (
          <div className="tab-content animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>Users Directory</h2>
            <div className="grid-cards">
              {allUsers.map(u => (
                <div key={u.id} className="glass-panel" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: u.role === 'admin' ? '#8B5CF6' : '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{u.role} · {u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="dashboard-content admin-mode">
      {renderContent()}
    </div>
  );
}

export default CommunityAdminDashboard;
