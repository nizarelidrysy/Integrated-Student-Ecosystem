import React from 'react';

function EmsiSharePlaceholder() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EMSI Share</h1>
      <div style={styles.icon}>🚧</div>
      <p style={styles.subtitle}>This platform is currently under construction and will be available in the future.</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: '2.5rem',
    color: '#2E7D32',
    marginBottom: '20px'
  },
  icon: {
    fontSize: '5rem',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    maxWidth: '500px'
  }
};

export default EmsiSharePlaceholder;
