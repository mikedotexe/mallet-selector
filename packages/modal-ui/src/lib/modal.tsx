import React from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
import type { WalletSelector } from "@meer-wallet-selector/core";
import type { WalletSelectorModal, ModalOptions } from "./modal.types.js";
import { Modal } from "./components/Modal.js";
import { EventEmitter } from "@meer-wallet-selector/core";
import type { ModalEvents } from "./modal.types.js";

const MODAL_ELEMENT_ID = "near-wallet-selector-modal";

let modalInstance: WalletSelectorModal | null = null;
let root: Root | null = null;

export const setupModal = (
    selector: WalletSelector,
    options: ModalOptions
): WalletSelectorModal => {
  if (!root) {
    const body = document.body;
    const container = document.createElement("div");
    container.id = MODAL_ELEMENT_ID;
    body.appendChild(container);

    root = createRoot(container);
  }

  const emitter = new EventEmitter<ModalEvents>();

  const render = (visible = false) => {
    if (root) {
      root.render(
            <Modal
                selector={selector}
                options={options}
                visible={visible}
                hide={() => render(false)}
                emitter={emitter}
            />
      );
    }
  };

  if (!modalInstance) {
    modalInstance = {
      show: () => {
        render(true);
      },
      hide: () => {
        render(false);
      },
      on: (eventName, callback) => {
        return emitter.on(eventName, callback);
      },
      off: (eventName, callback) => {
        emitter.off(eventName, callback);
      },
    };
  }

  return modalInstance;
};
