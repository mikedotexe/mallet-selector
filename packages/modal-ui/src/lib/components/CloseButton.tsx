import React from "react";
import { CloseIcon } from "./icons/CloseIcon.js";

interface CloseButtonProps {
    onClick: () => void;
}

export const CloseButton = ({ onClick }: CloseButtonProps): JSX.Element => {
    return (
        <button onClick={onClick} className="close-button">
            <CloseIcon />
        </button>
    );
};
