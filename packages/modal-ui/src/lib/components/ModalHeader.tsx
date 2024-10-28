import React from "react";
import { CloseButton } from "./CloseButton.js";

interface ModalHeaderProps {
    title: string;
    onCloseModal: () => void;
}

export const ModalHeader = ({ title, onCloseModal }: ModalHeaderProps): JSX.Element => {
    const additionalClasses = title === "Get a Wallet" ? " -open" : "";
    return (
        <div className="nws-modal-header">
            <h3 className={`middleTitle${additionalClasses}`}>{title}</h3>
            <CloseButton onClick={onCloseModal} />
        </div>
    );
};
