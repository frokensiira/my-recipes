import React, { useState, useEffect } from "react";
import { ReactComponent as Cabbage } from "../assets/cabbage.svg";
import { motion } from "framer-motion";
import useMyRecipes from "../hooks/useMyRecipes";
import useMyLikedRecipes from "../hooks/useMyLikedRecipes";
import AddRecipeButton from "./AddRecipeButton";
import Filter from "./Filter";
import Loading from "./Loading";
import NoRecipes from "./NoRecipes";
import PageTitle from "./PageTitle";
import RecipeCard from "./RecipeCard";

const MyRecipes = () => {
    const [vegan, setVegan] = useState(false);
    const { recipes, loading, error } = useMyRecipes(vegan);
    const {
        likedRecipes,
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
        <main>
            <PageTitle>
                Mina recept <Cabbage className="icon" />
            </PageTitle>
            {error ? <p>Problem med att ladda recept...</p> : ""}
            {loading ? <Loading /> : ""}

            <div className="page">
                <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />

                {allRecipes.length !== 0 ? (
                    <motion.section
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="cards"
                    >
                        {allRecipes.map((recipe) => (
                            <RecipeCard
                                recipe={recipe}
                                key={recipe.id}
                                handleDislike={handleDislike}
                            />
                        ))}
                    </motion.section>
                ) : (
                    !loading && <NoRecipes vegan={vegan} />
                )}
                <AddRecipeButton />
            </div>
        </main>
    );
};

export default MyRecipes;