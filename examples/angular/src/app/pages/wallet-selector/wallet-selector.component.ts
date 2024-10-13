import type { OnInit } from "@angular/core";
import type { AccountState, WalletSelector } from "@meer-wallet-selector/core";
import { setupWalletSelector } from "@meer-wallet-selector/core";
import type { WalletSelectorModal } from "@meer-wallet-selector/modal-ui-js";
import { setupModal } from "@meer-wallet-selector/modal-ui-js";
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
import { setupNearSnap } from "@meer-wallet-selector/near-snap";
import { setupNeth } from "@meer-wallet-selector/neth";
import { setupWalletConnect } from "@meer-wallet-selector/wallet-connect";
import { Component } from "@angular/core";
import { setupMyNearWallet } from "@meer-wallet-selector/my-near-wallet";
import { setupRamperWallet } from "@meer-wallet-selector/ramper-wallet";
import { setupLedger } from "@meer-wallet-selector/ledger";
import { setupNearMobileWallet } from "@meer-wallet-selector/near-mobile-wallet";
import { setupMintbaseWallet } from "@meer-wallet-selector/bitte-wallet";
import { setupBitteWallet } from "@meer-wallet-selector/bitte-wallet";
import { setupOKXWallet } from "@meer-wallet-selector/okx-wallet";
import { setupEthereumWallets } from "@meer-wallet-selector/ethereum-wallets";
import { createWeb3Modal } from "@web3modal/wagmi";
import { reconnect, http, createConfig, type Config } from "@wagmi/core";
import { type Chain } from "@wagmi/core/chains";
import { injected, walletConnect } from "@wagmi/connectors";
import { CONTRACT_ID } from "../../../constants";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

// Get a project ID at https://cloud.walletconnect.com
const projectId = "30147604c5f01d0bc4482ab0665b5697";

// NOTE: This is the NEAR wallet playground used in dev mode.
// TODO: Replace with the NEAR chain after the protocol upgrade.
const near: Chain = {
  id: 398,
  name: "NEAR Protocol Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "NEAR",
    symbol: "NEAR",
  },
  rpcUrls: {
    default: { http: ["https://near-wallet-relayer.testnet.aurora.dev"] },
    public: { http: ["https://near-wallet-relayer.testnet.aurora.dev"] },
  },
  blockExplorers: {
    default: {
      name: "NEAR Explorer",
      url: "https://testnet.nearblocks.io",
    },
  },
  testnet: true,
};

const wagmiConfig: Config = createConfig({
  chains: [near],
  transports: {
    [near.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "NEAR Guest Book",
        description: "A guest book with comments stored on the NEAR blockchain",
        url: "https://near.github.io/wallet-selector",
        icons: ["https://near.github.io/wallet-selector/favicon.ico"],
      },
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
  ],
});
reconnect(wagmiConfig);

const web3Modal = createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  enableOnramp: false,
  allWallets: "SHOW",
});

@Component({
  selector: "near-wallet-selector-wallet-selector",
  templateUrl: "./wallet-selector.component.html",
  styleUrls: ["./wallet-selector.component.scss"],
})
export class WalletSelectorComponent implements OnInit {
  selector: WalletSelector;
  modal: WalletSelectorModal;
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
        setupOKXWallet(),
        setupNarwallets(),
        setupWelldoneWallet(),
        setupHereWallet(),
        setupCoin98Wallet(),
        setupNearFi(),
        setupNearSnap(),
        setupNeth({
          bundle: false,
        }),
        setupWalletConnect({
          projectId: "c8cb6204543639c31aef44ea4837a554", // Replace this with your own projectId form WalletConnect.
          // Overrides the default methods on wallet-connect.ts
          // the near_signMessage and near_verifyOwner are missing here.
          methods: [
            "near_signIn",
            "near_signOut",
            "near_getAccounts",
            "near_signTransaction",
            "near_signTransactions",
          ],
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
        setupEthereumWallets({ wagmiConfig, web3Modal }),
      ],
    });

    const _modal = setupModal(_selector, {
      contractId: CONTRACT_ID,
    });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.accountId =
      state.accounts.find((account) => account.active)?.accountId || null;

    window.selector = _selector;
    window.modal = _modal;

    this.selector = _selector;
    this.modal = _modal;
  }
}
