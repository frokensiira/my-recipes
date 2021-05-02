import React from "react";
import { ReactComponent as Mail } from "../assets/mail.svg";

const InputMail = ({ emailRef }) => {
    return (
        <div className="form__input-wrapper">
            <Mail className="form__icon" />
            <input
                className="form__input form__input-account"
                type="email"
                ref={emailRef}
                placeholder="Email"
                required
                name="email"
            />
        </div>
    );
};

export default InputMail;
