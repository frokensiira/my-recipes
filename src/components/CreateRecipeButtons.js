import React from "react";
import { Link } from "react-router-dom";

const CreateRecipeButtons = () => {
    return (
        <div className="create-recipe">
            <div className="create-recipe__wrapper">
                <Link
                    className="create-recipe__link"
                    to={`/my-recipes/create-recipe/url/`}
                >
                    <button className="button create-recipe__button">
                        Lägg in länk till ett recept
                    </button>
                </Link>
                <Link
                    className="create-recipe__link"
                    to={`/my-recipes/create-recipe/file/`}
                >
                    <button className="button create-recipe__button">
                        Ladda upp en receptfil
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CreateRecipeButtons;
