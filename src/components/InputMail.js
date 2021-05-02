import React from "react";

const InputMail = ({ emailRef }) => {
    return (
        <div className="form__input-wrapper">
            <div className="form-input__mail form-input__container"></div>
            <input
                className="form__input form__input-account form_input-mail"
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
