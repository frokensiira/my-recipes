import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import useRecipes from "../hooks/useRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes } = useRecipes(vegan);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    return (
        <>
            <h1 className="page__title">Mina recept <Cabbage className="icon"/></h1>
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />
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
