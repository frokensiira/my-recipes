import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { db } from "../firebase";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";
import Filter from "./Filter";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [vegan, setVegan] = useState(false);

    const getRecipes = async () => {
        const myRecipes = [];
        let snapshot;

        if (vegan) {
            snapshot = await db
                .collection("recipes")
                .where("vegan", "==", true)
                .get();
        } else {
            snapshot = await db.collection("recipes").get();
        }

        snapshot.forEach((doc) => {
            myRecipes.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        setRecipes(myRecipes);
    };

    useEffect(() => {
        getRecipes();
    }, [vegan]);

    const handleFilterSearch = (e) => {
        if (e.target.id === "vegan") {
            setVegan(true);
        } else {
            setVegan(false);
        }
    };

    return (
        <>
            <h1 className="page__title">
                Recept <Broccoli className="icon" />
            </h1>
            <Filter vegan={vegan} handleFilterSearch={handleFilterSearch} />
            <div className="cards">
                {recipes.length !== 0 &&
                    recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} />
                    ))}
            </div>
            <AddRecipeButton />
        </>
    );
};

export default AllRecipes;