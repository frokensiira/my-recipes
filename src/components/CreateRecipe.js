import React from "react";
import CreateRecipeButton from "./CreateRecipeButton";
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
            <div className="create-recipe">
                <div className="create-recipe__wrapper">
                    <CreateRecipeButton link="url">Lägg in länk till ett recept</CreateRecipeButton>
                    <CreateRecipeButton link="file">Ladda upp en receptfil</CreateRecipeButton>
                </div>
            </div>
        </main>
    );
};

export default CreateRecipe;
