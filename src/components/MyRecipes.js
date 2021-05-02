import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import useMyRecipes from "../hooks/useMyRecipes";
import useMyLikedRecipes from "../hooks/useMyLikedRecipes";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import Loading from "./Loading";
import NoRecipes from "./NoRecipes";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes, loading, error } = useMyRecipes(vegan);
    const {
        likedRecipes,
        loadingLikes,
        errorLikes,
        setDisLiked,
    } = useMyLikedRecipes(vegan);
    const [allRecipes, setAllRecipes] = useState([]);

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
        <div>
            <h1 className="page__title">
                Mina recept <Cabbage className="icon" />
            </h1>
            {error || errorLikes ? <p>Problem med att ladda recept...</p> : ""}
            {loading || loadingLikes ? <Loading /> : ""}
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />

            {allRecipes.length !== 0 ? (
                <section className="cards">
                    {allRecipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            key={recipe.id}
                            handleDislike={handleDislike}
                        />
                    ))}
                </section>
            ) : (
                !loading && !loadingLikes && <NoRecipes vegan={vegan} />
            )}
            <AddRecipeButton />
        </div>
    );
};

export default MyRecipes;