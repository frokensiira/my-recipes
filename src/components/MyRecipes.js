import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import useMyRecipes from "../hooks/useMyRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import ClipLoader from "react-spinners/ClipLoader";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const [disLiked, setDisLiked] = useState(false);
    const { recipes, likedRecipes, loading } = useMyRecipes(vegan, disLiked);
    const [allRecipes, setAllRecipes] = useState(null);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    useEffect(() => {
        if (recipes && likedRecipes) {
            setAllRecipes(recipes.concat(likedRecipes));
        }
    }, [recipes, likedRecipes]);

    const handleDislike = () => {
        setDisLiked(true);
    };

    return (
        <main>
            <h1 className="page__title">
                Mina recept <Cabbage className="icon" />
            </h1>
            {loading && (
                <div className="recipe-form--loading">
                    <ClipLoader color="var(--green)" />
                </div>
            )}
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />
            <div className="cards">
                {allRecipes && allRecipes.length !== 0 ? (
                    allRecipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={recipe.id}
                            handleDislike={handleDislike}
                        />
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
