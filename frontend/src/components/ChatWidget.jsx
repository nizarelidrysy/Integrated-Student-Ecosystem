import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Check, CheckCheck } from 'lucide-react';
import api from '../api';

function ChatWidget({ demoUser, currentRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Unread count per sender
  const [seenIds, setSeenIds] = useState(new Set());

  // Always poll for messages (even when closed) so unread badge is always visible
  useEffect(() => {
    fetchMessages(); // initial load
    const bgInterval = setInterval(fetchMessages, 10000); // background poll every 10s
    return () => clearInterval(bgInterval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchMessages(); // immediate refresh on open
      const interval = setInterval(fetchMessages, 4000); // faster poll when open
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
    // Mark visible conversation messages as read
    if (selectedUser) {
      const incomingIds = filteredMessages
        .filter(m => m.sender?.id === selectedUser.id && !seenIds.has(m.id))
        .map(m => m.id);
      if (incomingIds.length > 0) {
        setSeenIds(prev => {
          const next = new Set(prev);
          incomingIds.forEach(id => next.add(id));
          return next;
        });
        // Tell backend these are read
        incomingIds.forEach(id => {
          api.patch(`/community/messages/${id}/`, { is_read: true }).catch(() => {});
        });
      }
    }
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = () => {
    api.get('/accounts/users/')
      .then(res => {
        // Only students and admins can message — no teachers
        const allowed = res.data.filter(u =>
          u.id !== demoUser?.id && u.role !== 'teacher'
        );
        setUsers(allowed);
      })
      .catch(console.error);
  };

  const fetchMessages = () => {
    api.get('/community/messages/')
      .then(res => setMessages(res.data))
      .catch(console.error);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim() || !demoUser) return;

    api.post('/community/messages/', {
      sender_id: demoUser.id,
      receiver_id: selectedUser.id,
      content: newMessage
    }).then(() => {
      setNewMessage('');
      fetchMessages();
    }).catch(console.error);
  };

  const filteredMessages = selectedUser ? messages.filter(m =>
    (m.sender?.id === demoUser?.id && m.receiver === selectedUser.id) ||
    (m.sender?.id === selectedUser.id && m.receiver === demoUser?.id)
  ) : [];

  // Unread count per user (messages sent to me that aren't yet seen)
  const unreadCount = (userId) =>
    messages.filter(m =>
      m.sender?.id === userId &&
      m.receiver === demoUser?.id &&
      !m.is_read &&
      !seenIds.has(m.id)
    ).length;

  const totalUnread = users.reduce((sum, u) => sum + unreadCount(u.id), 0);

  const initials = (u) =>
    `${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase();

  const avatarColor = (role) => role === 'admin' ? '#8B5CF6' : '#10B981';

  return (
    <>
      {/* Floating Button with badge */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
        {totalUnread > 0 && (
          <div style={{
            position: 'absolute', top: '-6px', right: '-6px',
            background: '#EF4444', color: 'white',
            borderRadius: '50%', width: '22px', height: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700, border: '2px solid white',
            animation: 'pulse 2s infinite',
          }}>
            {totalUnread}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'var(--primary)', color: 'white', border: 'none',
            boxShadow: '0 4px 16px rgba(16,185,129,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          }}
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '2rem',
          width: '380px', height: '540px',
          background: 'white', borderRadius: '18px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
          zIndex: 999, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.2s ease forwards',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            flexShrink: 0,
          }}>
            <MessageCircle size={20} />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Community Chat</span>
            {selectedUser && (
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.85 }}>
                {selectedUser.first_name} {selectedUser.last_name}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Contacts list */}
            <div style={{
              width: selectedUser ? '70px' : '100%',
              borderRight: selectedUser ? '1px solid #e2e8f0' : 'none',
              background: '#f8fafc',
              overflowY: 'auto',
              transition: 'width 0.25s ease',
              flexShrink: 0,
            }}>
              {selectedUser && (
                <div
                  onClick={() => setSelectedUser(null)}
                  style={{
                    padding: '0.75rem 0', textAlign: 'center', cursor: 'pointer',
                    borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem',
                    color: '#10B981', fontWeight: 700,
                  }}
                >
                  ←
                </div>
              )}
              {users.map(u => {
                const uc = unreadCount(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    style={{
                      padding: selectedUser ? '0.75rem 0' : '0.9rem 1rem',
                      borderBottom: '1px solid #e2e8f0', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      gap: selectedUser ? 0 : '0.75rem',
                      justifyContent: selectedUser ? 'center' : 'flex-start',
                      background: selectedUser?.id === u.id
                        ? 'rgba(16,185,129,0.1)' : 'transparent',
                      position: 'relative', transition: 'background 0.15s',
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: avatarColor(u.role),
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                      }}>
                        {initials(u)}
                      </div>
                      {uc > 0 && (
                        <div style={{
                          position: 'absolute', top: '-4px', right: '-4px',
                          background: '#EF4444', color: 'white', borderRadius: '50%',
                          width: '18px', height: '18px', fontSize: '0.65rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, border: '1.5px solid white',
                        }}>
                          {uc}
                        </div>
                      )}
                    </div>
                    {!selectedUser && (
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{
                          fontWeight: uc > 0 ? 700 : 600,
                          whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                          fontSize: '0.9rem',
                        }}>
                          {u.first_name} {u.last_name}
                        </div>
                        <div style={{
                          fontSize: '0.73rem', color: '#64748b',
                          textTransform: 'capitalize',
                        }}>
                          {u.role}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {users.length === 0 && !selectedUser && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No contacts available
                </div>
              )}
            </div>

            {/* Chat Area */}
            {selectedUser && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '1rem 0.875rem',
                  display: 'flex', flexDirection: 'column', gap: '0.4rem',
                }}>
                  {filteredMessages.map(m => {
                    const isMe = m.sender?.id === demoUser?.id;
                    const isRead = m.is_read || seenIds.has(m.id);
                    return (
                      <div key={m.id} style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '82%',
                      }}>
                        <div style={{
                          background: isMe ? 'linear-gradient(135deg, #10B981, #059669)' : '#f1f5f9',
                          color: isMe ? 'white' : '#1e293b',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '14px',
                          borderBottomRightRadius: isMe ? '3px' : '14px',
                          borderBottomLeftRadius: isMe ? '14px' : '3px',
                          fontSize: '0.88rem', lineHeight: 1.45,
                        }}>
                          {m.content}
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.25rem',
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                          marginTop: '2px', paddingLeft: isMe ? 0 : '4px',
                          paddingRight: isMe ? '4px' : 0,
                        }}>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          {isMe && (
                            isRead
                              ? <CheckCheck size={13} color="#10B981" />
                              : <Check size={13} color="#94a3b8" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredMessages.length === 0 && (
                    <div style={{
                      margin: 'auto', color: '#94a3b8',
                      fontSize: '0.83rem', textAlign: 'center', lineHeight: 1.6,
                    }}>
                      No messages yet.<br />
                      Say hi to {selectedUser.first_name}! 👋
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} style={{
                  padding: '0.75rem', borderTop: '1px solid #e2e8f0',
                  display: 'flex', gap: '0.5rem', flexShrink: 0,
                }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedUser.first_name}...`}
                    style={{
                      flex: 1, padding: '0.5rem 0.875rem', borderRadius: '20px',
                      border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.88rem',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#10B981'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button type="submit" disabled={!newMessage.trim()} style={{
                    background: newMessage.trim() ? 'linear-gradient(135deg, #10B981, #059669)' : '#e2e8f0',
                    color: 'white', border: 'none', borderRadius: '50%',
                    width: '38px', height: '38px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s, transform 0.15s',
                  }}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
