import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";
import Filter from "./Filter";
import useAllRecipes from "../hooks/useAllRecipes";
import Loading from "./Loading";
import NoRecipes from "./NoRecipes";

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

    const handleDislike = () => {
        console.log("not liking this recipe anymore");
    };

    return (
        <main>
            <h1 className="page__title">
                Recept <Broccoli className="icon" />
            </h1>
            {loading && <Loading />}
            <div className="page">
                <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />

                {recipes.length !== 0 ? (
                    <div className="cards">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                recipe={recipe}
                                key={recipe.id}
                                handleDislike={handleDislike}
                            />
                        ))}
                    </div>
                ) : (
                    !loading && <NoRecipes vegan={vegan} />
                )}

                <AddRecipeButton />
            </div>
        </main>
    );
};

export default AllRecipes;
