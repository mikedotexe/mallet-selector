import { renderGetAWallet } from "./GetAWallet.js";
import { translate } from "@meer-wallet-selector/core";
import { CloseIcon } from "./icons/CloseIcon.js";
import { KeyIcon } from "./icons/KeyIcon.js";
import { FolderIcon } from "./icons/FolderIcon.js";

export async function renderWhatIsAWallet() {
  document.querySelector(".modal-right")!.innerHTML = `
    <div class="nws-modal-body">
      <div class="wallet-home-wrapper">
        <div class="nws-modal-header-wrapper">
          <div class="nws-modal-header">
            <h3 class="middleTitle">${translate(
              "modal.wallet.whatIsAWallet"
            )}</h3>
            <button class="close-button">
              ${CloseIcon}
            </button>
          </div>
        </div>

        <div class="wallet-info-wrapper  what-wallet-hide">
          <div class="wallet-what">
            <div class="icon-side">
                ${KeyIcon}
            </div>
            <div class="content-side">
              <h3>${translate("modal.wallet.secureAndManage")}</h3>
              <p>${translate("modal.wallet.safelyStore")}</p>
            </div>
          </div>

          <div class="wallet-what">
            <div class="icon-side">
              ${FolderIcon}
            </div>
            <div class="content-side">
              <h3>${translate("modal.wallet.logInToAny")}</h3>
              <p>${translate("modal.wallet.noNeedToCreate")}</p>
            </div>
          </div>

            <div class="button-spacing"></div>
              <button class="middleButton" id="get-a-wallet-button">
                ${translate("modal.wallet.getAWallet")}
              </button>
        </div>

        <div class="what-wallet-mobile">
          <p>
            ${translate("modal.wallet.useAWallet")}
          </p>
          <button class="middleButton" id="get-a-wallet-button-mobile">
            ${translate("modal.wallet.getAWallet")}
          </button>
        </div>

        <div class="lang-selector-wrapper">
          <select class="lang-selector" name="lang">
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

      </div>
    </div>
  `;

  document
    .getElementById("get-a-wallet-button")
    ?.addEventListener("click", () => {
      renderGetAWallet();
    });

  document
    .getElementById("get-a-wallet-button-mobile")
    ?.addEventListener("click", () => {
      renderGetAWallet();
    });
}
