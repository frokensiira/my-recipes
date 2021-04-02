import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { Link } from "react-router-dom";
import AllRecipes from "./AllRecipes";

import { ReactComponent as Banner } from "../assets/banner.svg";


const Home = () => {
    const { currentUser, loading } = useAuth();

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
                    <div className="banner__image banner__image--mobile">
                        <Banner />
                    </div>
                    <p className="banner__text">
                        Skapa och inspireras av nya vegetariska recept! Skapa
                        konto för att kunna lägga in dina favoritrecept eller
                        spara andras.
                    </p>
                    <button className="button">
                        <Link className="banner__link" to={`/signup`}>
                            Skapa konto
                        </Link>
                    </button>
                </div>
                <div className="banner__image banner__image--desktop">
                    <Banner />
                </div>
            </section>
            <main className="page">
                <AllRecipes/>
            </main>
        </>
    );
};

export default Home;
