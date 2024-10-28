import React, {ReactNode, useCallback, useEffect, useState} from "react";
import type { EventEmitterService, ModuleState, WalletSelector } from "@meer-wallet-selector/core";
import type { ModalEvents, ModalHideReason, ModalOptions, Theme } from "../modal.types.js";
import type { ModalRoute } from "./Modal.types.js";
import { WalletNetworkChanged } from "./WalletNetworkChanged.js";
import { WalletOptions } from "./WalletOptions.js";
import { AlertMessage } from "./AlertMessage.js";
import { DerivationPath } from "./DerivationPath.js";
import { WalletConnecting } from "./WalletConnecting.js";
import { WalletNotInstalled } from "./WalletNotInstalled.js";
import { WalletHome } from "./WalletHome.js";
import { WalletConnected } from "./WalletConnected.js";
import { ScanQRCode } from "./ScanQRCode.js";
import { translate, allowOnlyLanguage } from "@meer-wallet-selector/core";

interface ModalProps {
  selector: WalletSelector;
  options: ModalOptions;
  visible: boolean;
  hide: () => void;
  emitter: EventEmitterService<ModalEvents>;
}

const getThemeClass = (theme?: Theme): string => {
  switch (theme) {
    case "dark":
      return "dark-theme";
    case "light":
      return "light-theme";
    default:
      return "";
  }
};

export const Modal = ({
                                              selector,
                                              options,
                                              visible,
                                              hide,
                                              emitter,
                                            }: ModalProps): ReactNode => {
  const [route, setRoute] = useState<ModalRoute>({ name: "WalletHome" });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<ModuleState | undefined>();
  const [bridgeWalletUri, setBridgeWalletUri] = useState<string | undefined>();

  const { rememberRecentWallets } = selector.store.getState();
  const [isChecked, setIsChecked] = useState(rememberRecentWallets === "enabled");

  const handleSwitchChange = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
    selector.setRememberRecentWallets();
  };

  useEffect(() => {
    setRoute({ name: "WalletHome" });
    allowOnlyLanguage(selector.options.languageCode);
    const { selectedWalletId, modules } = selector.store.getState();
    if (selectedWalletId) {
      const module = modules.find((m) => m.id === selectedWalletId);
      setSelectedWallet(module);
      setRoute({
        name: "WalletConnected",
        params: { module },
      });
    }
    setBridgeWalletUri(undefined);
  }, [visible, selector]);

  const handleDismissClick = useCallback(
      ({ hideReason }: { hideReason?: ModalHideReason }) => {
        setAlertMessage(null);
        setRoute({ name: "WalletHome" });

        if (hideReason) {
          emitter.emit("onHide", { hideReason });
        }
        hide();
      },
      [hide, emitter]
  );

  useEffect(() => {
    const subscription = selector.on("networkChanged", ({ networkId }) => {
      if (networkId === selector.options.network.networkId) {
        handleDismissClick({});
      } else {
        setRoute({ name: "WalletNetworkChanged" });
      }
    });

    return () => subscription.remove();
  }, [selector, handleDismissClick]);


  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismissClick({ hideReason: "user-triggered" });
      }
    };
    window.addEventListener("keydown", close);

    return () => window.removeEventListener("keydown", close);
  }, [handleDismissClick]);

  const handleWalletClick = async (module: ModuleState, qrCodeModal: boolean) => {
    setSelectedWallet(module);

    try {
      const { deprecated, available } = module.metadata;

      if (module.type === "injected" && !available) {
        setRoute({ name: "WalletNotInstalled", params: { module } });
        return;
      }

      const wallet = await module.wallet();

      if (deprecated) {
        setAlertMessage(`${module.metadata.name} is deprecated. Please select another wallet.`);
        setRoute({ name: "AlertMessage", params: { module } });
        return;
      }

      if (wallet.type === "hardware") {
        setRoute({ name: "DerivationPath", params: { walletId: wallet.id || "ledger" } });
        return;
      }

      setRoute({ name: "WalletConnecting", params: { wallet } });

      if (wallet.type === "bridge") {
        const subscription = selector.on("uriChanged", ({ uri }) => {
          setBridgeWalletUri(uri);
          setRoute({ name: "ScanQRCode", params: { uri, wallet } });
        });

        await wallet.signIn({
          contractId: options.contractId,
          methodNames: options.methodNames,
          qrCodeModal,
        });

        subscription.remove();
        handleDismissClick({ hideReason: "wallet-navigation" });
        return;
      }

      await wallet.signIn({
        contractId: options.contractId,
        methodNames: options.methodNames,
      });

      handleDismissClick({ hideReason: "wallet-navigation" });
    } catch (err) {
      const message = (err as Error).message || "Something went wrong";
      setAlertMessage(`Failed to sign in with ${module.metadata.name}: ${message}`);
      setRoute({ name: "AlertMessage", params: { module } });
    }
  };

  if (!visible) {
    return null;
  }

  return (
      <div className={`nws-modal-wrapper ${getThemeClass(options?.theme)} ${visible ? "open" : ""}`}>
        <div
            className="nws-modal-overlay"
            onClick={() => handleDismissClick({ hideReason: "user-triggered" })}
        />
        <div className="nws-modal">
          <div className="modal-left">
            <div className="modal-left-title">
              <h2>{translate("modal.wallet.connectYourWallet")}</h2>
              <span className="nws-remember-wallet">{translate("modal.wallet.rememberWallet")}</span>
              <label className="nws-switch">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                />
                <span className="nws-slider round" />
              </label>
            </div>
            <WalletOptions handleWalletClick={(module) => handleWalletClick(module, false)} selector={selector} />
          </div>
          <div className="modal-right">
            <div className="nws-modal-body">
              {route.name === "AlertMessage" && alertMessage && (
                  <AlertMessage
                      message={alertMessage}
                      module={route.params?.module}
                      onBack={(retry) => {
                        if (retry) {
                          handleWalletClick(selectedWallet!, false);
                        }
                        setAlertMessage(null);
                        setRoute({ name: "WalletHome" });
                      }}
                      onCloseModal={() => handleDismissClick({ hideReason: "user-triggered" })}
                  />
              )}
              {/* Other route components go here */}
            </div>
          </div>
        </div>
      </div>
  );
};
