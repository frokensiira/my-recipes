import React from "react";
import CreateRecipeButtons from "./CreateRecipeButtons";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";

const CreateRecipe = () => {
    return (
        <>
            <h1 className="page__title">
                Skapa recept
                <Artichoke className="icon" />
            </h1>
            <p className="page__text">Steg 1 av 2</p>
            <p className="page__text">Välj ett av nedanstående alternativ:</p>
            <CreateRecipeButtons />
        </>
    );
};

export default CreateRecipe;
