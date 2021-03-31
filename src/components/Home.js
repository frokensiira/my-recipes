import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { ReactComponent as Banner } from "../assets/banner.svg";

const Home = () => {
    const { currentUser, loading } = useAuth();

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
            {/* {loading ? (
                <p>loading...</p>
            ) : currentUser ? (
                <p>
                    You are signed in as{" "}
                    <strong>{currentUser && currentUser.email}</strong>
                </p>
            ) : (
                ""
            )} */}
            <section className="banner">
                <div className="banner__text-area">
                    <h1 className="banner__heading">My Veggie Recipes</h1>
                    <p className="banner__text">
                        Skapa och inspireras av nya vegetariska recept! Se alla
                        recept i menyn eller skapa konto för att kunna lägga in
                        dina favoritrecept eller spara andras.
                    </p>
                    <button className="banner__button">
                        <Link className="banner__link" to={`/signup`}>
                            Skapa konto
                        </Link>
                    </button>
                </div>
                <div className="banner__image">
                    <Banner />
                </div>
            </section>
            <main className="page">
                <h1 className="page__title">Senast tillagda recepten</h1>
                <div className="cards">
                    {recipes.length !== 0 &&
                        recipes.map((recipe) => (
                            <RecipeCard recipe={recipe} key={recipe.id} />
                        ))}
                </div>
            </main>
        </>
    );
};

export default Home;
