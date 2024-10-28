import React, { Fragment } from "react";
import type { Wallet } from "@meer-wallet-selector/core";
import { ModalHeader } from "./ModalHeader.js";
import { translate } from "@meer-wallet-selector/core";
import { connectingLoaderBase64 } from "../images/connectingLoader.js";

interface WalletConnectingProps {
  wallet: Wallet | undefined;
  onBack: () => void;
  onCloseModal: () => void;
}

export const WalletConnecting: React.FC<WalletConnectingProps> = ({
                                                                    wallet,
                                                                    onCloseModal,
                                                                  }) => {
  return (
      <>
        <ModalHeader title="" onCloseModal={onCloseModal} />
        <div className="connecting-wrapper">
          <div className="content">
            <div className="icon">
              <img src={wallet?.metadata.iconUrl} alt={wallet?.metadata.name} />
            </div>
            <h3 className="connecting-name">{wallet?.metadata.name}</h3>
            <div className="connecting-details">
              <div className="spinner">
                <img src={connectingLoaderBase64} alt="loading-icon" />
              </div>
              <span>
              {translate("modal.wallet.connectingTo")} {wallet?.metadata.name}
                ...
            </span>
            </div>
            <div className="connecting-message">
            <span>
              {translate(`modal.wallet.connectingMessage.${wallet?.type}`)}
            </span>
            </div>
          </div>
        </div>
      </>
  );
};
