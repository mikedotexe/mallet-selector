export const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.9)', // Dark overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1a1a1a', // Dark background
    border: '2px solid #5a189a', // Purple border
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    padding: '24px',
    boxSizing: 'border-box' as const,
    maxHeight: '80vh',
    overflowY: 'auto' as const,
  },
  title: {
    marginTop: 0,
    marginBottom: '16px',
    textAlign: 'center' as const,
    color: '#e0aaff', // Light purple
  },
  walletList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  walletItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#2c2c2c',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  walletItemHover: {
    backgroundColor: '#3a0ca3', // Dark purple
  },
  walletIcon: {
    width: '48px',
    height: '48px',
    objectFit: 'contain' as const,
    borderRadius: '8px',
    marginRight: '16px',
  },
  walletName: {
    color: '#ffffff',
    fontSize: '18px',
  },
};
