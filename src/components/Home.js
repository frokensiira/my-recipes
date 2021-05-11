import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import AllRecipes from "./AllRecipes";
import { ReactComponent as Banner } from "../assets/banner.svg";
import Loading from "./Loading";
import { motion } from "framer-motion";

const Home = () => {
    const { currentUser, loading } = useAuth();

    return (
        <>
            <section className="banner">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 1 }}
                            className="banner__text-area"
                        >
                            <h1
                                className={
                                    currentUser
                                        ? "banner__user"
                                        : "banner__heading"
                                }
                            >
                                {currentUser
                                    ? `Välkommen ${currentUser.displayName}!`
                                    : "My Veggie Recipes"}
                            </h1>
                            <div className="banner__image banner__image--mobile">
                                <Banner />
                            </div>
                            {currentUser ? (
                                ""
                            ) : (
                                <p className="banner__text">
                                    Skapa och inspireras av nya vegetariska
                                    recept! Skapa konto för att kunna lägga in
                                    dina favoritrecept eller spara andras.
                                </p>
                            )}

                            {currentUser ? (
                                <Link
                                    className="button link"
                                    to={`/my-recipes/create-recipe`}
                                >
                                    Skapa recept
                                </Link>
                            ) : (
                                <Link className="button link" to={`/signup`}>
                                    Skapa konto
                                </Link>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 1 }}
                            className="banner__image banner__image--desktop"
                        >
                            <Banner />
                        </motion.div>
                    </>
                )}
            </section>

            <AllRecipes />
        </>
    );
};

export default Home;
