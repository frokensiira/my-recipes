import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CreateRecipeButton = ({ link, children }) => {
    return (
        <motion.Link
            className="create-recipe__link"
            to={`/my-recipes/create-recipe/${link}/`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1 }}
        >
            <button className="button create-recipe__button">{children}</button>
        </motion.Link>
    );
};

export default CreateRecipeButton;
