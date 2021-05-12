import React from "react";
import { ReactComponent as Artichoke } from "../assets/artichoke.svg";
import { ReactComponent as Link } from "../assets/link.svg";
import { ReactComponent as Upload } from "../assets/upload.svg";
import { motion } from "framer-motion";
import CreateRecipeButton from "./CreateRecipeButton";
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
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="create-recipe"
            >
                <div className="create-recipe__wrapper">
                    <CreateRecipeButton link="url">
                        Lägg in länk till ett recept
                        <Link className="create-recipe__icon" />
                    </CreateRecipeButton>
                    <CreateRecipeButton link="file">
                        Ladda upp en receptfil
                        <Upload className="create-recipe__icon"/>
                    </CreateRecipeButton>
                </div>
            </motion.div>
        </main>
    );
};

export default CreateRecipe;
