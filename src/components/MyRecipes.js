import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import useMyRecipes from "../hooks/useMyRecipes";
import useMyLikedRecipes from "../hooks/useMyLikedRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes, loading, error } = useMyRecipes(vegan);
    const {
        likedRecipes,
        loadingLikes,
        errorLikes,
        setDisLiked,
    } = useMyLikedRecipes(vegan);
    const [allRecipes, setAllRecipes] = useState(null);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    const handleDislike = () => {
        setDisLiked(true);
    };

    useEffect(() => {
        if (recipes && likedRecipes) {
            setAllRecipes(recipes.concat(likedRecipes));
        }
    }, [recipes, likedRecipes]);

    return (
        <main>
            <h1 className="page__title">
                Mina recept <Cabbage className="icon" />
            </h1>
            {error || errorLikes && <p>Problem med att ladda recept...</p>}
            {loading || loadingLikes && <Loading />}
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />

            {allRecipes && allRecipes.length !== 0 ? (
                <div className="cards">
                    {allRecipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={recipe.id}
                            handleDislike={handleDislike}
                        />
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="page__feedback">
                        {vegan ? (
                            <p>
                                Du har inga veganska recept än. Skapa ditt allra
                                första!
                            </p>
                        ) : (
                            <p>
                                Du har inga recept än. Skapa ditt allra första!
                            </p>
                        )}
                        <Link
                            to="/my-recipes/create-recipe"
                            className="button link"
                        >
                            Skapa recept
                        </Link>
                    </div>
                )
            )}
            <AddRecipeButton />
        </main>
    );
};

export default MyRecipes;
