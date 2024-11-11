import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface WalletData {
    name: string;
    icon: string;
    [key: string]: any;
}

export interface WalletPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletNames: string[];
}

export const WalletPickerModal: React.FC<WalletPickerModalProps> = ({ isOpen, onClose, walletNames }) => {
    // call hooks at top
    const [wallets, setWallets] = useState<WalletData[]>([]);
    const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);

    // escape key closes the modal, as the scriptures say
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        // tidy up event listener. for the 7th generation.
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // dynamically import wallets and collect their data
    useEffect(() => {
        const loadWallets = async () => {
            const loadedWallets: WalletData[] = [];

            for (const walletName of walletNames) {
                try {
                    // dynamic import time, supplied by dev using this package as strings
                    // which are the npm package names.
                    // 'booty' for package at https://www.npmjs.com/package/booty
                    const walletModule = await import(/* webpackIgnore: true */ walletName);
                    const setupWalletFunction = walletModule.setupMyNearWallet;
                    const walletData: WalletData = {
                        name: walletName,
                        // icon: walletModule.icon,
                        icon: 'hardcode bro',
                        setupFn: setupWalletFunction,
                    };
                    loadedWallets.push(walletData);
                } catch (error) {
                    console.error(
                        `Dear developer, we need to talk.\nYou must check that you're supplying at least one package name as a string, and that it's installed. Error with wallet package: ${walletName}`,
                        error
                    );
                }
            }

            setWallets(loadedWallets);
        };

        // dude just let the thing return somethin' don't leave it hanging, it's impolite
        loadWallets().then(() => {});
    }, [walletNames]);

    // "Don't block the UI" ~ The Dream, Redacted 2024
    if (!isOpen) {
        console.log("don't block the ui");
        return null;
    }

    const styles = {
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

    const modalContent: React.ReactNode = (
        <div style={styles.overlay} onClick={onClose} className={'near-wallet-picker nwp-specific-0 nwp-specific-1'}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()} className={'near-wallet-picker-div-1'}>
                <h2 style={styles.title}  className={'near-wallet-picker-header'}>Select a Wallet</h2>
                <div style={styles.walletList}  className={'near-wallet-picker-div-2'}>
                    {wallets.map((wallet) => (
                        <div
                            key={wallet.name}
                            style={{
                                ...styles.walletItem,
                                ...(hoveredWallet === wallet.name ? styles.walletItemHover : {}),
                            }}
                            onMouseEnter={() => setHoveredWallet(wallet.name)}
                            onMouseLeave={() => setHoveredWallet(null)}
                            className={`near-wallet-picker-wallet nwp-wallet-${wallet.name}`}
                        >
                            <img src={wallet.icon} alt={`${wallet.name} icon`} style={styles.walletIcon} className={'near-wallet-picker-img-1'}/>
                            <span style={styles.walletName} className={'near-wallet-picker-wallet-name'}>{wallet.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};
