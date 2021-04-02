import React from "react";
import RecipeCard from "./RecipeCard";
import useRecipes from "../hooks/useRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";

const MyRecipes = () => {
    const { recipes } = useRecipes();

    return (
        <>
            <h1 className="page__title">Mina recept <Cabbage className="icon"/></h1>
            <main className="cards">
                {recipes.length !== 0 &&
                    recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    ))}
                    <AddRecipeButton />
            </main>
        </>
    );
};

export default MyRecipes;
