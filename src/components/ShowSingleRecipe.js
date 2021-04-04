import React from "react";
import foodPlaceholder from "../assets/images/food_placeholder.png";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { SRLWrapper } from "simple-react-lightbox";
import { ReactComponent as Delete } from "../assets/trash.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ShowSingleRecipe = () => {
    const { recipeId } = useParams();
    const { recipe, loading } = useRecipe(recipeId);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleDelete = async () => {
        //check if the recipe photo exist in storage, if so delete it
        if (recipe.path) {
            try {
                await storage.ref(recipe.path).delete();
            } catch (error) {
                console.log("error", error);
            }
        }

        // delete recipe from database
        db.collection("recipes")
            .doc(recipeId)
            .delete()
            .then(() => {
                navigate("/my-recipes/");
            });
    };

    const handleEdit = () => {};

    return (
        <>
            {loading ? (
                <p>Laddar</p>
            ) : (
                recipe && (
                    <div className="recipe">
                        {recipe.photoUrl ? (
                            <SRLWrapper>
                                <a
                                    href={recipe.photoUrl}
                                    title="Visa bild"
                                    data-attribute="SRL"
                                >
                                    <img
                                        src={recipe.photoUrl}
                                        className="recipe__image"
                                        alt="food"
                                    />
                                </a>
                            </SRLWrapper>
                        ) : (
                            <SRLWrapper>
                                <a
                                    href={recipe.photoUrl}
                                    title="Visa bild"
                                    data-attribute="SRL"
                                >
                                    <img
                                        src={foodPlaceholder}
                                        className=""
                                        alt="plate"
                                    />
                                </a>
                            </SRLWrapper>
                        )}

                        <div className="recipe__content">
                            <div>
                                <h1>{recipe.name}</h1>

                                {recipe.comment && (
                                    <p className="recipe__text">
                                        {recipe.comment}
                                    </p>
                                )}
                                {recipe.vegan && <p>Veganskt</p>}
                            </div>

                            {recipe.recipeUrl && (
                                <div className="recipe__file">
                                    <SRLWrapper>
                                        <a
                                            href={recipe.recipeUrl}
                                            title="Visa recept"
                                            data-attribute="SRL"
                                        >
                                            <img
                                                src={recipe.recipeUrl}
                                                className="recipe__file"
                                                alt="food"
                                            />
                                        </a>
                                    </SRLWrapper>
                                </div>
                            )}

                            {recipe.url && (
                                <div className="recipe__link">
                                    <a
                                        href={recipe.url}
                                        className="btn btn-primary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Länk till receptet
                                    </a>
                                </div>
                            )}

                            {currentUser && currentUser.uid == recipe.owner ? (
                                <div>
                                    <button
                                        className="recipe__delete-button"
                                        onClick={handleDelete}
                                    >
                                        <Delete className="recipe__delete-icon" />
                                        Radera recept
                                    </button>
                                    <Link
                                        to={`/my-recipes/edit-recipe/url/${recipeId}`}
                                        className="recipe__edit-link"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="recipe__edit-icon" />
                                        Redigera recept
                                    </Link>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                )
            )}
        </>
    );
};

export default ShowSingleRecipe;