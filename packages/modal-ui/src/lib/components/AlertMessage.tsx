import React from "react";
import { ModalHeader } from "./ModalHeader.js";
import { ConnectionResult } from "./ConnectionResult.js";
import type { ModuleState } from "@meer-wallet-selector/core";

interface AlertMessageProps {
    message: string;
    module?: ModuleState;
    onBack: (retry: boolean) => void;
    onCloseModal: () => void;
}

export const AlertMessage = ({
                                 message,
                                 module,
                                 onBack,
                                 onCloseModal,
                             }: AlertMessageProps): JSX.Element => {
    return (
        <div> {/* Keeping div instead of Fragment */}
            <ModalHeader title="" onCloseModal={onCloseModal} />
            <div className="alert-message connecting-wrapper connecting-wrapper-err">
                <div className="content">
                    <div className="icon">
                        <img src={module?.metadata.iconUrl} alt={module?.metadata.name} />
                    </div>
                    <h3 className="connecting-name">{module?.metadata.name}</h3>
                    <ConnectionResult
                        module={module!}
                        message={message}
                        err={message !== null}
                        onRetry={() => {
                            onBack(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
