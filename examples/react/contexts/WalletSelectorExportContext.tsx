import type { ReactNode } from "react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { map, distinctUntilChanged } from "rxjs";
import { setupWalletSelector } from "@meer-wallet-selector/core";
import type { WalletSelector, AccountState } from "@meer-wallet-selector/core";
import { setupExportSelectorModal } from "@meer-wallet-selector/account-export";
import type { WalletSelectorModal } from "@meer-wallet-selector/account-export";
import { setupHereWallet } from "@meer-wallet-selector/here-wallet";
import { setupSender } from "@meer-wallet-selector/sender";
import { setupBitgetWallet } from "@meer-wallet-selector/bitget-wallet";
import { setupMathWallet } from "@meer-wallet-selector/math-wallet";
import { setupNightly } from "@meer-wallet-selector/nightly";
import { setupMeteorWallet } from "@meer-wallet-selector/meteor-wallet";
import { setupWelldoneWallet } from "@meer-wallet-selector/welldone-wallet";
import { setupNearFi } from "@meer-wallet-selector/nearfi";
import { setupWalletConnect } from "@meer-wallet-selector/wallet-connect";
import { setupCoin98Wallet } from "@meer-wallet-selector/coin98-wallet";
import { Loading } from "../components/Loading";
import { setupMyNearWallet } from "@meer-wallet-selector/my-near-wallet";
import { setupLedger } from "@meer-wallet-selector/ledger";
import { setupRamperWallet } from "@meer-wallet-selector/ramper-wallet";
import { setupNearMobileWallet } from "@meer-wallet-selector/near-mobile-wallet";
import { setupMintbaseWallet } from "@meer-wallet-selector/bitte-wallet";
import { setupBitteWallet } from "@meer-wallet-selector/bitte-wallet";
import { CONTRACT_ID } from "../constants";

declare global {
  interface Window {
    importSelector: WalletSelector;
    exportModal: WalletSelectorModal;
  }
}

interface ExportAccountSelectorContextValue {
  importSelector: WalletSelector;
  exportModal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
}

const ExportAccountSelectorContext =
  React.createContext<ExportAccountSelectorContextValue | null>(null);

export const ExportAccountSelectorContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [importSelector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: "testnet",
      debug: true,
      modules: [
        setupMyNearWallet(),
        setupLedger(),
        setupSender(),
        setupBitgetWallet(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        setupWelldoneWallet(),
        setupHereWallet(),
        setupCoin98Wallet(),
        setupNearFi(),
        setupRamperWallet(),
        setupMintbaseWallet({ contractId: CONTRACT_ID }),
        setupBitteWallet({ contractId: CONTRACT_ID }),
        setupWalletConnect({
          projectId: "c4f79cc...",
          metadata: {
            name: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            url: "https://github.com/mikedotexe/mallet-selector",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        }),
        setupNearMobileWallet(),
      ],
    });
    /**
     * Insert list of accounts to be imported here
     * accounts: [{ accountId: "test.testnet", privateKey: "ed25519:..."}, ...]
     */
    const _modal = setupExportSelectorModal(_selector, {
      accounts: [],
      onComplete: (completeProps) => {
        console.log(
          `${completeProps.accounts} exported to ${completeProps.walletName}`
        );
      },
    });
    const state = _selector.store.getState();
    setAccounts(state.accounts);

    // this is added for debugging purpose only
    // for more information (https://github.com/mikedotexe/mallet-selector/pull/764#issuecomment-1498073367)
    window.importSelector = _selector;
    window.exportModal = _modal;

    setSelector(_selector);
    setModal(_modal);
    setLoading(false);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!importSelector) {
      return;
    }

    const subscription = importSelector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        setAccounts(nextAccounts);
      });

    return () => subscription.unsubscribe();
  }, [importSelector]);

  const exportWalletSelectorContextValue =
    useMemo<ExportAccountSelectorContextValue>(
      () => ({
        importSelector: importSelector!,
        exportModal: modal!,
        accounts,
        accountId:
          accounts.find((account) => account.active)?.accountId || null,
      }),
      [importSelector, modal, accounts]
    );

  if (loading) {
    return <Loading />;
  }

  return (
    <ExportAccountSelectorContext.Provider
      value={exportWalletSelectorContextValue}
    >
      {children}
    </ExportAccountSelectorContext.Provider>
  );
};

export function useExportAccountSelector() {
  const context = useContext(ExportAccountSelectorContext);

  if (!context) {
    throw new Error(
      "useExportAccountSelector must be used within a ExportAccountSelectorContextProvider"
    );
  }

  return context;
}
