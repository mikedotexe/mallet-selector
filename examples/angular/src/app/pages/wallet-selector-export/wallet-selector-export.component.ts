import type { OnInit } from "@angular/core";
import type { AccountState, WalletSelector } from "@meer-wallet-selector/core";
import { setupWalletSelector } from "@meer-wallet-selector/core";
import type { WalletSelectorModal } from "@meer-wallet-selector/account-export";
import { setupSender } from "@meer-wallet-selector/sender";
import { setupBitgetWallet } from "@meer-wallet-selector/bitget-wallet";
import { setupXDEFI } from "@meer-wallet-selector/xdefi";
import { setupMathWallet } from "@meer-wallet-selector/math-wallet";
import { setupNightly } from "@meer-wallet-selector/nightly";
import { setupMeteorWallet } from "@meer-wallet-selector/meteor-wallet";
import { setupNarwallets } from "@meer-wallet-selector/narwallets";
import { setupWelldoneWallet } from "@meer-wallet-selector/welldone-wallet";
import { setupHereWallet } from "@meer-wallet-selector/here-wallet";
import { setupCoin98Wallet } from "@meer-wallet-selector/coin98-wallet";
import { setupNearFi } from "@meer-wallet-selector/nearfi";
import { setupNeth } from "@meer-wallet-selector/neth";
import { setupWalletConnect } from "@meer-wallet-selector/wallet-connect";
import { Component } from "@angular/core";
import { setupExportSelectorModal } from "@meer-wallet-selector/account-export";
import { setupMyNearWallet } from "@meer-wallet-selector/my-near-wallet";
import { setupRamperWallet } from "@meer-wallet-selector/ramper-wallet";
import { setupNearMobileWallet } from "@meer-wallet-selector/near-mobile-wallet";
import { setupLedger } from "@meer-wallet-selector/ledger";
import { setupMintbaseWallet } from "@meer-wallet-selector/bitte-wallet";
import { setupBitteWallet } from "@meer-wallet-selector/bitte-wallet";
import { CONTRACT_ID } from "../../../constants";

declare global {
  interface Window {
    exportSelector: WalletSelector;
    exportModal: WalletSelectorModal;
  }
}

@Component({
  selector: "near-wallet-selector-wallet-selector-export",
  templateUrl: "./wallet-selector-export.component.html",
  styleUrls: ["./wallet-selector-export.component.scss"],
})
export class WalletSelectorExportComponent implements OnInit {
  exportSelector: WalletSelector;
  exportModal: WalletSelectorModal;
  accountId: string | null;
  accounts: Array<AccountState> = [];

  async ngOnInit() {
    await this.initialize().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }

  async initialize() {
    const _selector = await setupWalletSelector({
      network: "testnet",
      debug: true,
      modules: [
        setupMyNearWallet(),
        setupLedger(),
        setupSender(),
        setupBitgetWallet(),
        setupXDEFI(),
        setupMathWallet(),
        setupNightly(),
        setupMeteorWallet(),
        setupNarwallets(),
        setupWelldoneWallet(),
        setupHereWallet(),
        setupCoin98Wallet(),
        setupNearFi(),
        setupNeth({
          bundle: false,
        }),
        setupWalletConnect({
          projectId: "c4f79cc...",
          metadata: {
            name: "NEAR Wallet Selector",
            description: "Example dApp used by NEAR Wallet Selector",
            url: "https://github.com/mikedotexe/mallet-selector",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
          },
        }),
        setupRamperWallet(),
        setupNearMobileWallet(),
        setupMintbaseWallet({ contractId: CONTRACT_ID }),
        setupBitteWallet({ contractId: CONTRACT_ID }),
      ],
    });
    /**
     * Insert list of accounts to be imported here
     * accounts: [{ accountId: "test.testnet", privateKey: "ed25519:..."}, ...]
     */
    const _modal = setupExportSelectorModal(_selector, {
      accounts: [],
      onComplete: (completedAccounts) => {
        console.log("Transfer Completed: ", completedAccounts);
      },
    });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.accountId =
      state.accounts.find((account) => account.active)?.accountId || null;

    window.exportSelector = _selector;
    window.exportModal = _modal;

    this.exportSelector = _selector;
    this.exportModal = _modal;
  }

  show() {
    this.exportModal.show();
  }
}
