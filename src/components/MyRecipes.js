import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import useMyRecipes from "../hooks/useMyRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

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

            {allRecipes && allRecipes.length !== 0 ? (
                allRecipes.map((recipe) => (
                    <div className="cards">
                        <RecipeCard
                            recipe={recipe}
                            key={recipe.id}
                            handleDislike={handleDislike}
                        />
                        <AddRecipeButton />
                    </div>
                ))
            ) : (
                <div className="page__feedback">
                    {vegan ? (
                        <p>Du har inga veganska recept än. Skapa ditt allra första!</p>
                    ) : (
                        <p>Du har inga recept än. Skapa ditt allra första!</p>
                    )}
                    <Link to="/create-recipe" className="button banner__link">
                        Skapa recept
                    </Link>
                </div>
            )}
        </main>
    );
};

export default MyRecipes;
