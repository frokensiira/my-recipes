import React, { useState } from "react";
import foodPlaceholder from "../assets//images/food_placeholder.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";

const RecipeCard = ({ recipe }) => {
    const { currentUser } = useAuth();
    const [like, setLike] = useState(false);

    const handleLike = (e) => {
        setLike((prevState) => !prevState);
    };

    return (
        <div className="card">
            <div className="card__wrapper">
                {recipe.vegan && <p className="card__flag">Veganskt</p>}
                <Link to={`/my-recipes/${recipe.id}`} className="card__link">
                    {recipe.photoUrl ? (
                        <img
                            src={recipe.photoUrl}
                            className="card__image"
                            role="presentation"
                        />
                    ) : (
                        <img
                            src={foodPlaceholder}
                            id="placeholder"
                            className="card__image"
                            alt="plate with cutlery"
                        />
                    )}

                    <h1 className="card__title">{recipe.name}</h1>
                </Link>
                <p className="card__text">{recipe.comment}</p>

                <div className="card__footer">
                    <div className="card__footer-owner">
                        <img
                            className="card__profile-image"
                            src={profilePlaceholder}
                        />
                        <p className="card__footer-name">
                            {recipe.ownerUsername}
                        </p>
                    </div>

                    {currentUser && currentUser.uid !== recipe.owner ? (
                        like ? (
                            <div className="card__heart--filled">
                                <HeartFilled onClick={handleLike} />
                            </div>
                        ) : (
                            <div className="card__heart">
                                <Heart onClick={handleLike} />
                            </div>
                        )
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
