import type { ModuleState, Wallet } from "@meer-wallet-selector/core";
import { modalState } from "../modal";
import type { HardwareWalletAccountState } from "../render-modal";
import { renderLedgerAccountsOverviewList } from "./LedgerAccountsOverviewList";
import { renderSpecifyDerivationPath } from "./SpecifyDerivationPath";
import { translate } from "@meer-wallet-selector/core";
import { BackArrowIcon } from "./icons/BackArrowIcon";
import { CloseIcon } from "./icons/CloseIcon";

export async function renderLedgerSelectAccount(
  module: ModuleState<Wallet>,
  accounts: Array<HardwareWalletAccountState>
) {
  if (!modalState) {
    return;
  }

  document.querySelector(".modal-right")!.innerHTML = `
    <div class="nws-modal-body">
      <div class="nws-modal-header-wrapper"><button class="back-button" id="back-button">${BackArrowIcon}</button>
        <div class="nws-modal-header">
          <h3 class="middleTitle">${translate(
            "modal.ledger.selectYourAccounts"
          )}</h3>
            <button class="close-button">${CloseIcon}</button>
        </div>
      </div>
      <div class="derivation-path-wrapper">
        <div class="choose-ledger-account-form-wrapper">
          <p>We found ${
            accounts.length
          } accounts on your device. Select the account(s) you wish to connect.</p>
          <div class="button-wrapper"><button id="change-derivation-path-button">HD.../${modalState.derivationPath.slice(
            -2,
            -1
          )}</button></div>
          <form class="form">
            <div>
              <div class="nws-form-control">
                <div id="accounts"></div>
              <div class="action-buttons"><button class="middleButton" id="connect-button">Connect</button></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  for (let i = 0; i < accounts.length; i++) {
    document.getElementById("accounts")?.insertAdjacentHTML(
      "beforeend",
      `
      <div class="account">
        <input type="checkbox" id="${
          accounts[i].accountId
        }" name="account" value="${accounts[i].accountId}" ${
        i === 0 ? "checked" : ""
      }>
        <label for="${accounts[i].accountId}"> ${accounts[i].accountId}</label>
        <br>
      </div>
      `
    );
  }

  document
    .getElementById("change-derivation-path-button")
    ?.addEventListener("click", () => {
      renderSpecifyDerivationPath(module);
    });

  document.getElementById("connect-button")?.addEventListener("click", (e) => {
    e.preventDefault();

    const accountCheckStatuses = Array.from(
      document.querySelectorAll("input[name='account']")
    ).map((el) => (el as HTMLInputElement).checked);

    const checkedAccounts = accounts.filter(
      (_account, i) => accountCheckStatuses[i]
    );

    if (checkedAccounts.length < 1) {
      return;
    }

    renderLedgerAccountsOverviewList(module, accounts, checkedAccounts);
  });
}
