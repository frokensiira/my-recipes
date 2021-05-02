import React from "react";

const FormButton = ({ loading, children }) => {
    return (
        <div className="form__button">
            <button disabled={loading} className="button" type="submit">
                {children}
            </button>
        </div>
    );
};

export default FormButton;
