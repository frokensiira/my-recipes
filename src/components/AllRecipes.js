import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";
import Filter from "./Filter";
import useAllRecipes from "../hooks/useAllRecipes";
import Loading from "./Loading";
import NoRecipes from "./NoRecipes";
import PageTitle from "./PageTitle";
import { useAuth } from "../contexts/AuthContext";

const AllRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes, loading } = useAllRecipes(vegan);
    const { currentUser } = useAuth();

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
            <PageTitle>Recept <Broccoli className="icon" /></PageTitle>
            
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

                {
                    currentUser && (<AddRecipeButton />)
                }

            </div>
        </main>
    );
};

export default AllRecipes;
