import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { db } from "../firebase";
import AddRecipeButton from "./AddRecipeButton";
import { ReactComponent as Broccoli } from "../assets/broccoli.svg";

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);

    const getRecipes = async () => {
        const myRecipes = [];

        const snapshot = await db.collection("recipes").get();

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
    }, []);

    return (
        <>
            <h1 className="page__title">
                Recept <Broccoli className="icon" />
            </h1>
            <ul className="filter">
                <li className="filter__item">Alla</li>
                <li className="filter__item">Veganska</li>
            </ul>
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
