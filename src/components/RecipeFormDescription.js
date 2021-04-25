import React from "react";

const RecipeFormDescription = ({recipe, handleInput}) => {
    return (
        <div className="recipe-form__field">
            <label htmlFor="comment" className="recipe-form__label">
                Kommentar
            </label>
            <textarea
                name="comment"
                className="form__textarea"
                id="comment"
                rows="4"
                maxLength="300"
                onChange={handleInput}
                value={recipe.comment}
            ></textarea>
        </div>
    );
};

export default RecipeFormDescription;
