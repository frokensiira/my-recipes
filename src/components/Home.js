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
                            <motion.h1
                                className="banner__heading"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 1 }}
                            >
                                My Veggie Recipes
                            </motion.h1>
                            <div className="banner__image banner__image--mobile">
                                <Banner />
                            </div>
                            <motion.p
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 1 }}
                                className="banner__text"
                            >
                                Skapa och inspireras av nya vegetariska recept!
                                Skapa konto för att kunna lägga in dina
                                favoritrecept eller spara andras.
                            </motion.p>

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
