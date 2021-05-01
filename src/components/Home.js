import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import AllRecipes from "./AllRecipes";
import { ReactComponent as Banner } from "../assets/banner.svg";
import Loading from "./Loading";

const Home = () => {
    const { currentUser, loading } = useAuth();

    return (
        <>
            <section className="banner">
                {loading ? (
                    <Loading />
                ) : currentUser ? (
                    <>
                        <p>
                            Välkommen <strong>{currentUser.displayName}</strong>
                            !
                        </p>
                    </>
                ) : (
                    <>
                        <div className="banner__text-area">
                            <h1 className="banner__heading">
                                My Veggie Recipes
                            </h1>
                            <div className="banner__image banner__image--mobile">
                                <Banner />
                            </div>
                            <p className="banner__text">
                                Skapa och inspireras av nya vegetariska recept!
                                Skapa konto för att kunna lägga in dina
                                favoritrecept eller spara andras.
                            </p>

                            <Link className="button link" to={`/signup`}>
                                Skapa konto
                            </Link>
                        </div>
                        <div className="banner__image banner__image--desktop">
                            <Banner />
                        </div>
                    </>
                )}
            </section>

            <AllRecipes />
        </>
    );
};

export default Home;
