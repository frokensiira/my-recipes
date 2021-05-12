import React from "react";
import { Link } from "react-router-dom";

const NoRecipes = ({ vegan }) => {
    return (
        <div className="page__feedback">
            {vegan ? (
                <p>
                    Det finns inga veganska recept än. Skapa det allra första!
                </p>
            ) : (
                <p>Det finns inga recept än. Skapa det allra första!</p>
            )}
            <Link to="/my-recipes/create-recipe" className="button link">
                Skapa recept
            </Link>
        </div>
    );
};

export default NoRecipes;
