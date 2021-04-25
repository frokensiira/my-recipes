import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";
import Filter from "./Filter";
import useAllRecipes from "../hooks/useAllRecipes";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const AllRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes, loading } = useAllRecipes(vegan);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    return (
        <>
            <h1 className="page__title">
                Recept <Broccoli className="icon" />
            </h1>
            {loading && (
                <div className="recipe-form--loading">
                    <ClipLoader color="var(--green)" />
                </div>
            )}
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />

            {recipes.length !== 0 ? (
                recipes.map((recipe) => (
                    <div className="cards">
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    </div>
                ))
            ) : (
                <div className="page__feedback">
                    {vegan ? (
                        <p>
                            Det finns inga veganska recept än. Skapa det allra
                            första!
                        </p>
                    ) : (
                        <p>Det finns inga recept än. Skapa det allra första!</p>
                    )}
                    <Link to="/create-recipe" className="button banner__link">
                        Skapa recept
                    </Link>
                </div>
            )}

            <AddRecipeButton />
        </>
    );
};

export default AllRecipes;
