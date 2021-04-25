import React, { useState, useEffect, useRef } from "react";
import foodPlaceholder from "../assets/images/food_placeholder.png";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { SRLWrapper } from "simple-react-lightbox";
import { ReactComponent as Vegan } from "../assets/vegan.svg";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt, faEdit } from "@fortawesome/free-regular-svg-icons";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";

const ShowSingleRecipe = () => {
    const { recipeId } = useParams();
    const { recipe, loading } = useRecipe(recipeId);
    const { currentUser } = useAuth();
    const [likes, setLikes] = useState([]);
    const [like, setLike] = useState(false);
    const initialRender = useRef(true);
    const navigate = useNavigate();
    
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
                        .where("recipeId", "==", recipeId)
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
            });
    };

    const addLikeToRecipe = (docRef) => {
        db.collection("likes")
            .add({
                liker: currentUser.uid,
                recipeId: recipeId,
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
            .where("recipeId", "==", recipeId)
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
                //check if collection likes exist
                db.collection("likes")
                    .get()
                    .then((data) => {
                        if (data.size > 0) {
                            const docRef = db
                                .collection("likes")
                                .where("recipeId", "==", recipeId);

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
                        } else {
                            addLikeToRecipe();
                        }
                    })
                    .catch((err) => {
                        console.log("error", err);
                    });
            } else if (like === false) {
                console.log("want to delete recipe from favourites");

                deleteLikeFromRecipe();
            }
        }
    }, [like]);

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
                                        className="recipe__image"
                                        alt="plate"
                                    />
                                </a>
                            </SRLWrapper>
                        )}

                        <div className="recipe__content">
                            <div>
                                <h1 className="recipe__heading">
                                    {recipe.name}
                                </h1>

                                {recipe.comment && (
                                    <p className="recipe__text">
                                        {recipe.comment}
                                    </p>
                                )}

                                {recipe.url && (
                                    <a
                                        href={recipe.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="recipe__link"
                                    >
                                        Länk till receptet
                                        <FontAwesomeIcon
                                            className="recipe__link-icon"
                                            icon={faChevronRight}
                                        />
                                    </a>
                                )}

                                {recipe.fileUrl && (
                                    <div className="recipe__file">
                                        <SRLWrapper>
                                            <a
                                                href={recipe.fileUrl}
                                                title="Visa recept"
                                                data-attribute="SRL"
                                            >
                                                <img
                                                    src={recipe.fileUrl}
                                                    className="recipe__file"
                                                    alt="food"
                                                />
                                            </a>
                                        </SRLWrapper>
                                    </div>
                                )}

                                {recipe.vegan && (
                                    <div className="recipe__vegan">
                                        <Vegan className="recipe__vegan-icon" />
                                        <p className="recipe__vegan-text">
                                            Veganskt
                                        </p>
                                    </div>
                                )}
                            </div>

                            {currentUser && currentUser.uid !== recipe.owner && (
                                <div className="recipe__footer">
                                    <div className="card__likes">
                                        <p>{likes.length} gillar</p>
                                    </div>

                                    <div className="recipe__footer-owner">
                                        <img
                                            className="recipe__profile-image"
                                            src={profilePlaceholder}
                                            alt=""
                                        />
                                        <p className="recipe__footer-name">
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
                            )}

                            {currentUser && currentUser.uid === recipe.owner ? (
                                <div className="recipe__buttons">
                                    <button
                                        className="recipe__delete-button"
                                        onClick={handleDelete}
                                    >
                                        <FontAwesomeIcon
                                            className="recipe__link-icon"
                                            icon={faTrashAlt}
                                        />
                                        Radera recept
                                    </button>

                                    {
                                        
                                    }
                                    <Link
                                        to={recipe.fileUrl ? `/my-recipes/edit-recipe/file/${recipeId}` : `/my-recipes/edit-recipe/url/${recipeId}` }
                                        className="recipe__edit-link"
                                    >
                                        <FontAwesomeIcon
                                            className="recipe__link-icon"
                                            icon={faEdit}
                                        />
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
