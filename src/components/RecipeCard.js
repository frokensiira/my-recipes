import React, { useEffect, useState, useRef } from "react";
import foodPlaceholder from "../assets//images/placeholder.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";
import { db } from "../firebase";
import { ReactComponent as Logo } from "../assets/logo.svg";

const RecipeCard = ({ recipe, handleDislike }) => {
    const { currentUser } = useAuth();
    const initialRender = useRef(true);
    const [likes, setLikes] = useState([]);
    const [like, setLike] = useState(false);

    const handleLike = (e) => {
        setLike((prevState) => !prevState);
    };

    const getLikesForRecipe = () => {
        //check if collection likes exist
        db.collection("likes")
            .get()
            .then((data) => {
                if (data.size > 0) {
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
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const addLikeToRecipe = () => {
        db.collection("likes")
            .add({
                liker: currentUser.uid,
                recipeId: recipe.id,
            })
            .then(() => {
                getLikesForRecipe();
            })
            .catch((error) => {
                console.error(error);
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
                        .catch((error) => {
                            console.error(error);
                        });
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getLikesForRecipe();

        return () => {
            setLikes(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //do not do anything when like is being set during initial render
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            if (like) {
                //check if collection likes exist
                db.collection("likes")
                    .get()
                    .then((data) => {
                        if (data.size > 0) {
                            const docRef = db
                                .collection("likes")
                                .where("recipeId", "==", recipe.id);

                            //check if like exist already
                            docRef
                                .get()
                                .then((querySnapshot) => {
                                    const like = [];
                                    querySnapshot.forEach((doc) => {
                                        if (
                                            doc.data().liker === currentUser.uid
                                        ) {
                                            like.push({
                                                id: doc.id,
                                                ...doc.data(),
                                            });
                                        }
                                    });
                                    //check if user already liked the recipe
                                    if (like.length !== 0) {
                                        return;
                                    } else {
                                        addLikeToRecipe();
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        } else {
                            addLikeToRecipe();
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (like === false) {
                deleteLikeFromRecipe();
            }
        }
    }, [like]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <article className="card">
            {recipe.vegan && <p className="card__flag">Veganskt</p>}
            <Link to={`/my-recipes/${recipe.id}`} className="card__link">
                <div className="card__image-wrapper">
                <img
                    src={recipe.photoUrl ? recipe.photoUrl : foodPlaceholder}
                    className="card__image"
                    alt=""
                /> {
                    !recipe.photoUrl &&
                    <div className="card__overlay">
                        <Logo/>
                    </div>

                }
                </div>
                <h1 className="card__title">{recipe.name}</h1>
            </Link>

            <div className="card__footer">
                <div className="card__footer-owner">
                    <img
                        className="card__profile-image"
                        src={profilePlaceholder}
                        alt="presentation"
                    />
                    <p className="card__footer-name">
                        {recipe.creatorUsername}
                    </p>
                </div>

                {currentUser && currentUser.uid !== recipe.creator ? (
                    <div className="card__heart">
                        {like ? (
                            <HeartFilled onClick={handleLike} />
                        ) : (
                            <Heart onClick={handleLike} />
                        )}
                        <p className="card__footer-likes">{likes.length}</p>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </article>
    );
};

export default RecipeCard;
