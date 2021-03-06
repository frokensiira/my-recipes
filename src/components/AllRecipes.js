import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";
import useAllRecipes from "../hooks/useAllRecipes";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import Loading from "./Loading";
import NoRecipes from "./NoRecipes";
import PageTitle from "./PageTitle";
import RecipeCard from "./RecipeCard";

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
        <>
            {recipes.length === 0 && !currentUser ? (
                ""
            ) : (
                <main>
                    <PageTitle>
                        Recept <Broccoli className="icon" />
                    </PageTitle>

                    {loading && <Loading />}
                    <div className="page">
                        <Filter
                            vegan={vegan}
                            handleFilterSearch={handleFilterSearch}
                        />

                        {recipes.length !== 0 ? (
                            <motion.section
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="cards"
                            >
                                {recipes.map((recipe) => (
                                    <RecipeCard
                                        recipe={recipe}
                                        key={recipe.id}
                                        handleDislike={handleDislike}
                                    />
                                ))}
                            </motion.section>
                        ) : (
                            !loading &&
                            currentUser && <NoRecipes vegan={vegan} />
                        )}

                        {currentUser && <AddRecipeButton />}
                    </div>
                </main>
            )}
        </>
    );
};

export default AllRecipes;