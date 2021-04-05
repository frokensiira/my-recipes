import React from "react";
import { Link } from "react-router-dom";

const AddRecipeButton = () => {
    return (
        <Link to={`/my-recipes/create-recipe`} className="add-recipe">
                <div className="add-recipe__plus-wrapper">
                    <div className="add-recipe__plus-bar add-recipe__plus-bar--horizontal"></div>
                    <div className="add-recipe__plus-bar add-recipe__plus-bar--vertical"></div>
                </div>
        </Link>
    );
};

export default AddRecipeButton;
