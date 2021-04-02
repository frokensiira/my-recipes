import React from "react";
import RecipeCard from "./RecipeCard";
import useRecipes from "../hooks/useRecipes";
import { ReactComponent as Icon } from "../assets/cabbage.svg";

const MyRecipes = () => {
    const { recipes } = useRecipes();

    return (
        <>
            <h1 className="page__title">Mina recept <Icon className="icon"/></h1>
            <main className="cards">
                {recipes.length !== 0 &&
                    recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    ))}
            </main>
        </>
    );
};

export default MyRecipes;
