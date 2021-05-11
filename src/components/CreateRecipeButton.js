import React from "react";
import { Link } from "react-router-dom";

const CreateRecipeButton = ({ link, children }) => {
    return (
        <Link
            className="button create-recipe__button"
            to={`/my-recipes/create-recipe/${link}/`}
        >
            {children}
        </Link>
    );
};

export default CreateRecipeButton;
