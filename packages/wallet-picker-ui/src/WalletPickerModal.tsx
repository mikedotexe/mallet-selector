import { styles } from './styles.js'
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { WalletSelector, ModuleState, WalletModule } from '@meer-wallet-selector/core';

export interface WalletOption {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
}

export interface WalletPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selector: WalletSelector;
  onWalletSelected: () => void;
}

export const WalletPickerModal: React.FC<WalletPickerModalProps> = ({
      isOpen,
      onClose,
      selector,
      onWalletSelected,
    }) => {
  if (!isOpen) return null;

  const [hoveredWalletId, setHoveredWalletId] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>([]);

  useEffect(() => {
    const modules = selector.store.getState().modules;
    const wallets: WalletOption[] = modules.map((module) => ({
      id: module.id,
      name: module.metadata.name,
      iconUrl: module.metadata.iconUrl,
      description: module.metadata.description || '',
    }));
    setAvailableWallets(wallets);
  }, [selector]);

  const handleWalletClick = async (walletId: string) => {
    try {
      const wallet = await selector.wallet(walletId);

      if (wallet.type === 'browser' || wallet.type === 'bridge') {
        await wallet.signIn({
          contractId: 'your-contract-id.testnet', // Replace with your contract ID
          methodNames: [], // Add method names if required
        });
      } else if (wallet.type === 'hardware') {
        await wallet.signIn({
          accounts: [], // Provide accounts for hardware wallet
          contractId: 'your-contract-id.testnet',
          methodNames: [],
        });
      }

      onWalletSelected();
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const modalContent = (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Select a Wallet</h2>
        <div style={styles.walletList}>
          {availableWallets.map((wallet) => (
            <div
              key={wallet.id}
              style={{
                ...styles.walletItem,
                ...(hoveredWalletId === wallet.id ? styles.walletItemHover : {}),
              }}
              onMouseEnter={() => setHoveredWalletId(wallet.id)}
              onMouseLeave={() => setHoveredWalletId(null)}
              onClick={() => handleWalletClick(wallet.id)}
            >
              <img
                src={wallet.iconUrl}
                alt={`${wallet.name} icon`}
                style={styles.walletIcon}
              />
              <span style={styles.walletName}>{wallet.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body) as React.ReactPortal;
};

