import React from "react";

const RecipeSubmitButton = ({ children }) => {
    return (
        <button type="submit" className="button recipe-form__submit-button">
            {children}
        </button>
    );
};

export default RecipeSubmitButton;
