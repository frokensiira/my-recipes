import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import useMyRecipes from "../hooks/useMyRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes } = useMyRecipes(vegan);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    return (
        <main>
            <h1 className="page__title">
                Mina recept <Cabbage className="icon" />
            </h1>
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />
            <div className="cards">
                {recipes.length !== 0 ? (
                    recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    ))
                ) : vegan ? (
                    <p>Du har inga veganska recept än...</p>
                ) : (
                    <p>Du har inga recept än...</p>
                )}
                <AddRecipeButton />
            </div>
        </main>
    );
};

export default MyRecipes;
