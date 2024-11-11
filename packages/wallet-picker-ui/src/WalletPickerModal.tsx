import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './WalletPickerModal.css';

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
    const [wallets, setWallets] = useState<WalletData[]>([]);

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
                    const walletInfo = walletModule.ack();
                    loadedWallets.push(walletInfo);
                } catch (error) {
                    console.error(`Dear developer, we need to talk.\nYou must check that you're supplying at least one package name as a string, and that it's installed. Error with wallet package: ${walletName}`, error);
                }
            }

            setWallets(loadedWallets);
        };

        // dude just let the thing return 0 don't leave it hanging, it's impolite
        loadWallets().then(() => 0);
    }, [walletNames]);

    // "Don't block the UI" ~ The Dream, Redacted 2024
    if (!isOpen) return null;

    const modalContent: React.ReactElement = (
        <div className="wallet-picker-overlay" onClick={onClose}>
            <div className="wallet-picker-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Select a Wallet</h2>
                <div className="wallet-list">
                    {wallets.map((wallet) => (
                        <div key={wallet.name} className="wallet-item">
                            <img src={wallet.icon} alt={`${wallet.name} icon`} />
                            <span>{wallet.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // React Portal time, folks
    // check it, the official example is making a modal
    // https://react.dev/reference/react-dom/createPortal#rendering-a-modal-dialog-with-a-portal
    return ReactDOM.createPortal(modalContent, document.body);
}
