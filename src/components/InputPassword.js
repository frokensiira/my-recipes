import React from "react";

const InputPassword = ({ passwordRef }) => {
    return (
        <div className="form__input-wrapper">
            <div className="form-input__password form-input__container"></div>
            <input
                className="form__input form__input-account"
                type="password"
                ref={passwordRef}
                placeholder="Lösenord"
                required
            />
        </div>
    );
};

export default InputPassword;
