import React from "react";
import CreateRecipeButtons from "./CreateRecipeButtons";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import PageTitle from "./PageTitle";

const CreateRecipe = () => {
    return (
        <main className="page">
            <PageTitle>
                Skapa recept
                <Artichoke className="icon" />
            </PageTitle>
            <p className="page__text">Steg 1 av 2</p>
            <p className="page__text">Välj ett av nedanstående alternativ:</p>
            <CreateRecipeButtons />
        </main>
    );
};

export default CreateRecipe;
