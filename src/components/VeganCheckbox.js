import React from "react";

const VeganCheckbox = ({recipe, handleCheckbox}) => {
    return (
        <div className="recipe-form__checkbox-wrapper">
            <label className="recipe-form__switch">
                <label className="recipe-form__label recipe-form__checkbox-label">
                    <input
                        type="checkbox"
                        name="Veganskt"
                        onChange={handleCheckbox}
                        className="recipe-form__checkbox"
                        checked={recipe.vegan}
                    />
                    <span className="recipe-form__slider"></span>
                    Veganskt
                </label>
            </label>
        </div>
    );
};

export default VeganCheckbox;
