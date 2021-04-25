import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const RecipeSubmitButton = ({ children, loading }) => {
    return (
        <button type="submit" className="button recipe-form__submit-button">
            {children}
            {loading && <ClipLoader color="#fff" size={25} />}
        </button>
    );
};

export default RecipeSubmitButton;
