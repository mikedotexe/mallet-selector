import { setupWalletSelector } from "@meer-wallet-selector/core";
import { setupModal } from "@meer-wallet-selector/modal-ui-js";
import { setupMyNearWallet } from "@meer-wallet-selector/my-near-wallet";
import { setupHereWallet } from "@meer-wallet-selector/here-wallet";

const selector = await setupWalletSelector({
  network: "testnet",
  modules: [setupMyNearWallet(), setupHereWallet()],
});

const modal = setupModal(selector, {
  contractId: "test.testnet",
});

window.selector = selector;
window.modal = modal;

document.getElementById('open-walletselector-button').addEventListener('click', () => modal.show());

