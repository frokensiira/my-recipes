import React, { useState, useEffect, useRef } from "react";
import foodPlaceholder from "../assets/images/placeholder.jpg";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import { SRLWrapper } from "simple-react-lightbox";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt, faEdit } from "@fortawesome/free-regular-svg-icons";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";
import Loading from "./Loading";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { motion } from "framer-motion";

const ShowSingleRecipe = () => {
    const { recipeId } = useParams();
    const { recipe, loading } = useRecipe(recipeId);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const initialRender = useRef(true);
    const [likes, setLikes] = useState([]);
    const [like, setLike] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLike = (e) => {
        setLike((prevState) => !prevState);
    };

    const resetError = () => {
        setError(false);
        setErrorMessage(null);
    }

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
                    resetError();
                    
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
            }).catch(error => {
                console.error(error.message);
                
            })
    };

    const addLikeToRecipe = (docRef) => {
        resetError();
        db.collection("likes")
            .add({
                liker: currentUser.uid,
                recipeId: recipeId,
            })
            .then(() => {
                getLikesForRecipe();
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(error.message);
            });
    };

    const deleteLikeFromRecipe = () => {
        resetError();
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
                            navigate("/my-recipes/");
                        })
                        .catch((err) => {
                            console.log(
                                "could not remove like from recipe",
                                err
                            );
                        });
                });
            })
            .catch((error) => {
                console.error(error);
                setError(true);
            });
    };

    useEffect(() => {
        getLikesForRecipe();

        return () => {
            setLikes(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                                        return;
                                    } else {
                                        addLikeToRecipe();
                                    }
                                })
                                .catch((error) => {
                                    console.error(error.message);
                                    setError(true);
                                });
                        } else {
                            addLikeToRecipe();
                        }
                    })
                    .catch((error) => {
                        console.error(error.message);
                        setError(true);
                    });
            }
            //want to delete recipe from favourites
            else if (like === false) {
                deleteLikeFromRecipe();
            }
        }
    }, [like]); // eslint-disable-line react-hooks/exhaustive-deps

    const deleteRecipe = () => {
        resetError();
        // delete recipe from database
        db.collection("recipes")
            .doc(recipeId)
            .delete()
            .then(() => {
                navigate("/my-recipes/");
            });
    };

    const deleteRecipeFile = () => {
        // delete recipe file from storage
        storage
            .ref(recipe.fullPathFile)
            .delete()
            .then(() => {
                deleteLikes();
            })
            .catch((error) => {
                console.error(error.message);
                setError(true);
            });
    };

    //if recipe that is getting deleted has likes,
    //remove the like documents from firestore
    const deleteLikes = () => {
        db.collection("likes")
            .where("recipeId", "==", recipeId)
            .get()
            .then((query) => {
                const batch = db.batch();
                query.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                batch
                    .commit()
                    .then(() => {
                        deleteRecipe();
                    })
                    .catch((err) => {
                        console.log("error", err);
                    });
            })
            .catch((err) => {
                console.log("error", err);
            });
    };

    const handleDelete = async () => {
        //check if the recipe photo exist in storage, if so delete it
        if (recipe.fullPathPhoto) {
            storage
                .ref(recipe.fullPathPhoto)
                .delete()
                .then(() => {
                    //check if the recipe has a file, if so delete it
                    if (recipe.fullPathFile) {
                        deleteRecipeFile();
                    } else {
                        deleteRecipe();
                    }
                })
                .catch((error) => {
                    console.log("error", error);
                });
        } else {
            //check if the recipe has a file, if so delete it
            if (recipe.fullPathFile) {
                deleteRecipeFile();
            } else {
                deleteLikes();
            }
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                recipe && (
                    <div className="recipe__wrapper">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 1 }}
                            className="recipe"
                        >
                            {recipe.photoUrl ? (
                                <SRLWrapper>
                                    <a
                                        href={recipe.photoUrl}
                                        title="Visa bild"
                                        data-attribute="SRL"
                                    >
                                        <div className="recipe__image-link">
                                            <img
                                                src={recipe.photoUrl}
                                                className="recipe__image"
                                                alt="food"
                                            />
                                            {recipe.vegan && (
                                                <p className="card__flag">
                                                    Veganskt
                                                </p>
                                            )}
                                        </div>
                                    </a>
                                </SRLWrapper>
                            ) : (
                                <div className="recipe__image-link">
                                    <img
                                        src={foodPlaceholder}
                                        className="recipe__image"
                                        alt="plate"
                                    />
                                    {recipe.vegan && (
                                        <p className="card__flag">Veganskt</p>
                                    )}
                                    <div className="recipe__overlay">
                                        <Logo />
                                    </div>
                                </div>
                            )}

                            <div className="recipe__content">
                                <div className="recipe__description">
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
                                            className="button recipe__link recipe__recipe"
                                        >
                                            Länk till receptet
                                            <FontAwesomeIcon
                                                className="recipe__link-arrow"
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
                                </div>

                                {currentUser &&
                                    currentUser.uid !== recipe.owner && (
                                        <div className="recipe__footer recipe__about">
                                            <div className="recipe__about-owner">
                                                <img
                                                    className="recipe__profile-image"
                                                    src={profilePlaceholder}
                                                    alt=""
                                                />
                                                <p className="recipe__about-name">
                                                    {recipe.creatorUsername}
                                                </p>
                                            </div>

                                            <div className="recipe__heart">
                                                {like ? (
                                                    <HeartFilled
                                                        onClick={handleLike}
                                                    />
                                                ) : (
                                                    <Heart
                                                        onClick={handleLike}
                                                    />
                                                )}
                                                <p className="recipe__likes">
                                                    {likes.length}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                {currentUser &&
                                currentUser.uid === recipe.owner ? (
                                    <div className="recipe__footer recipe__buttons">
                                        <button
                                            className="recipe__delete-button"
                                            onClick={handleDelete}
                                        >
                                            <FontAwesomeIcon
                                                className="recipe__link-icon"
                                                icon={faTrashAlt}
                                            />
                                            Radera
                                        </button>

                                        {}
                                        <Link
                                            to={
                                                recipe.fileUrl
                                                    ? `/my-recipes/edit-recipe/file/${recipeId}`
                                                    : `/my-recipes/edit-recipe/url/${recipeId}`
                                            }
                                            className="recipe__edit-link"
                                        >
                                            <FontAwesomeIcon
                                                className="recipe__link-icon"
                                                icon={faEdit}
                                            />
                                            Redigera
                                        </Link>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            {error && (
                                <div className="error">
                                    <p>
                                        {errorMessage
                                            ? errorMessage
                                            : "Något gick fel, försök igen."}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )
            )}
        </>
    );
};

export default ShowSingleRecipe;
