import React from "react";
import { Link } from "react-router-dom";

const CreateRecipeButton = ({ link, children }) => {
    return (
        <Link
            className="button create-recipe__button"
            to={`/my-recipes/create-recipe/${link}/`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1 }}
        >
            {children}
        </Link>
    );
};

export default CreateRecipeButton;
