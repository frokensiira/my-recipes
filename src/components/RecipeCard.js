import React from "react";
import foodPlaceholder from "../assets//images/food_placeholder.png";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
    return (
        <Link to={`/my-recipes/${recipe.id}`} className="card__link">
            <div className="card">
                {recipe.photoUrl ? (
                    <img
                        src={recipe.photoUrl}
                        className="card__image"
                        alt={recipe.name}
                    />
                ) : (
                    <img
                        src={foodPlaceholder}
                        id="placeholder"
                        className="card__image"
                        alt="plate with cutlery"
                    />
                )}

                <div className="card__content">
                    <h1 className="card__title">{recipe.name}</h1>
                    <p className="card__text">{recipe.comment}</p>

                    {recipe.vegan && <p className="card__flag">Veganskt</p>}
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;