import React, { useEffect, useState, useRef } from "react";
import foodPlaceholder from "../assets//images/food_placeholder.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";
import { db } from "../firebase";

const RecipeCard = ({ recipe, handleDislike }) => {
    const { currentUser } = useAuth();
    const initialRender = useRef(true);
    const [likes, setLikes] = useState(null);
    const [like, setLike] = useState(false);    

    const handleLike = (e) => {
        setLike((prevState) => !prevState);
    };

    const getLikesForRecipe = () => {
        const unsubscribe = db
            .collection("likes")
            .where("recipeId", "==", recipe.id)
            .onSnapshot((snapshot) => {
                const snapshotLikes = [];
                snapshot.forEach((doc) => {
                    snapshotLikes.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setLikes(snapshotLikes);

                if (
                    currentUser &&
                    currentUser.uid !== recipe.creator &&
                    snapshotLikes.length !== 0
                ) {
                    snapshotLikes.forEach((like) => {
                        if (like.liker === currentUser.uid) {
                            setLike(true);
                        }
                    });
                }
            });
        return unsubscribe;
    };

    const addLikeToRecipe = (docRef) => {
        db.collection("likes")
            .add({
                liker: currentUser.uid,
                recipeId: recipe.id,
            })
            .then(() => {
                console.log("Added to seperate likes collection");
                getLikesForRecipe();
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    const deleteLikeFromRecipe = () => {
        //find document with the recipe like
        db.collection("likes")
            .where("recipeId", "==", recipe.id)
            .where("liker", "==", currentUser.uid)
            .get()
            .then((query) => {
                query.forEach((doc) => {
                    //delete recipe from database
                    db.collection("likes")
                        .doc(doc.id)
                        .delete()
                        .then(() => {
                            getLikesForRecipe();
                            handleDislike();
                        })
                        .catch((err) => {
                            console.log(
                                "could not remove like from recipe",
                                err
                            );
                        });
                });
            })
            .catch((err) => {
                console.log("could not remove like from recipe", err);
            });
    };

    useEffect(() => {
        getLikesForRecipe();

        return () => {
            setLikes(false);
        };
    }, []);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            if (like) {
                const docRef = db
                    .collection("likes")
                    .where("recipeId", "==", recipe.id);

                //check if like exist already
                docRef
                    .get()
                    .then((querySnapshot) => {
                        const like = [];
                        querySnapshot.forEach((doc) => {
                            if (doc.data().liker === currentUser.uid) {
                                like.push({
                                    id: doc.id,
                                    ...doc.data(),
                                });
                            }
                        });

                        if (like.length !== 0) {
                            console.log("already liked recipe");
                            return;
                        } else {
                            addLikeToRecipe();
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                    });
            } else if (like === false) {
                console.log("want to delete recipe from favourites");
                
                deleteLikeFromRecipe();
            }
        }
    }, [like]);

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
                    {likes && (
                        <div className="card__likes">
                            <p>{likes.length} gillar</p>
                        </div>
                    )}

                    <div className="card__footer-owner">
                        <img
                            className="card__profile-image"
                            src={profilePlaceholder}
                        />
                        <p className="card__footer-name">
                            {recipe.creatorUsername}
                        </p>
                    </div>

                    {like ? (
                        <div className="card__heart">
                            <HeartFilled onClick={handleLike} />
                        </div>
                    ) : (
                        <div className="card__heart">
                            <Heart onClick={handleLike} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
