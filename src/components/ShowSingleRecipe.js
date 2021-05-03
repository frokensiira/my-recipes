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
            }
            //want to delete recipe from favourites
            else if (like === false) {
                deleteLikeFromRecipe();
            }
        }
    }, [like]);

    const deleteRecipe = () => {
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
                console.log("error", error);
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
                    <div className="wrapper">
                        <div className="recipe">
                            {recipe.photoUrl ? (
                                <SRLWrapper>
                                    <a
                                        href={recipe.photoUrl}
                                        title="Visa bild"
                                        data-attribute="SRL"
                                        className="recipe_image-link"
                                    >
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
                                    </a>
                                </SRLWrapper>
                            ) : (
                                <div className="recipe_image-link">
                                    <img
                                        src={foodPlaceholder}
                                        className="recipe__image"
                                        alt="plate"
                                    />
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
                                            className="recipe__link"
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
                                            <div className="card__likes">
                                                <p>{likes.length} gillar</p>
                                            </div>

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

                                            <div className="card__heart">
                                                {like ? (
                                                    <HeartFilled
                                                        onClick={handleLike}
                                                    />
                                                ) : (
                                                    <Heart
                                                        onClick={handleLike}
                                                    />
                                                )}
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
                        </div>
                    </div>
                )
            )}
        </>
    );
};

export default ShowSingleRecipe;

// import React, { useState, useEffect, useRef } from "react";
// import foodPlaceholder from "../assets/images/placeholder.jpg";
// import { useParams } from "react-router-dom";
// import useRecipe from "../hooks/useRecipe";
// import { SRLWrapper } from "simple-react-lightbox";
// import { ReactComponent as Vegan } from "../assets/vegan.svg";
// import { useAuth } from "../contexts/AuthContext";
// import { db, storage } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
// import { faTrashAlt, faEdit } from "@fortawesome/free-regular-svg-icons";
// import { ReactComponent as Heart } from "../assets/heart.svg";
// import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
// import profilePlaceholder from "../assets/profile-placeholder.svg";
// import Loading from "./Loading";

// const ShowSingleRecipe = () => {
//     const { recipeId } = useParams();
//     const { recipe, loading } = useRecipe(recipeId);
//     const { currentUser } = useAuth();
//     const [likes, setLikes] = useState([]);
//     const [like, setLike] = useState(false);
//     const initialRender = useRef(true);
//     const navigate = useNavigate();

//     const handleLike = (e) => {
//         setLike((prevState) => !prevState);
//     };

//     const getLikesForRecipe = () => {
//         //check if collection likes exist
//         db.collection("likes")
//             .get()
//             .then((data) => {
//                 if (data.size > 0) {
//                     const unsubscribe = db
//                         .collection("likes")
//                         .where("recipeId", "==", recipeId)
//                         .onSnapshot((snapshot) => {
//                             const snapshotLikes = [];
//                             snapshot.forEach((doc) => {
//                                 snapshotLikes.push({
//                                     id: doc.id,
//                                     ...doc.data(),
//                                 });
//                             });
//                             setLikes(snapshotLikes);

//                             if (
//                                 currentUser &&
//                                 currentUser.uid !== recipe.creator &&
//                                 snapshotLikes.length !== 0
//                             ) {
//                                 snapshotLikes.forEach((like) => {
//                                     if (like.liker === currentUser.uid) {
//                                         setLike(true);
//                                     }
//                                 });
//                             }
//                         });
//                     return unsubscribe;
//                 }
//             });
//     };

//     const addLikeToRecipe = (docRef) => {
//         db.collection("likes")
//             .add({
//                 liker: currentUser.uid,
//                 recipeId: recipeId,
//             })
//             .then(() => {
//                 getLikesForRecipe();
//             })
//             .catch((err) => {
//                 console.log("err", err);
//             });
//     };

//     const deleteLikeFromRecipe = () => {
//         //find document with the recipe like
//         db.collection("likes")
//             .where("recipeId", "==", recipeId)
//             .where("liker", "==", currentUser.uid)
//             .get()
//             .then((query) => {
//                 query.forEach((doc) => {
//                     //delete recipe from database
//                     db.collection("likes")
//                         .doc(doc.id)
//                         .delete()
//                         .then(() => {
//                             getLikesForRecipe();
//                         })
//                         .catch((err) => {
//                             console.log(
//                                 "could not remove like from recipe",
//                                 err
//                             );
//                         });
//                 });
//             })
//             .catch((err) => {
//                 console.log("could not remove like from recipe", err);
//             });
//     };

//     useEffect(() => {
//         getLikesForRecipe();

//         return () => {
//             setLikes(false);
//         };
//     }, []);

//     useEffect(() => {
//         if (initialRender.current) {
//             initialRender.current = false;
//         } else {
//             if (like) {
//                 //check if collection likes exist
//                 db.collection("likes")
//                     .get()
//                     .then((data) => {
//                         if (data.size > 0) {
//                             const docRef = db
//                                 .collection("likes")
//                                 .where("recipeId", "==", recipeId);

//                             //check if like exist already
//                             docRef
//                                 .get()
//                                 .then((querySnapshot) => {
//                                     const like = [];
//                                     querySnapshot.forEach((doc) => {
//                                         if (
//                                             doc.data().liker === currentUser.uid
//                                         ) {
//                                             like.push({
//                                                 id: doc.id,
//                                                 ...doc.data(),
//                                             });
//                                         }
//                                     });

//                                     if (like.length !== 0) {
//                                         return;
//                                     } else {
//                                         addLikeToRecipe();
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     console.log("err", err);
//                                 });
//                         } else {
//                             addLikeToRecipe();
//                         }
//                     })
//                     .catch((err) => {
//                         console.log("error", err);
//                     });
//             }
//             //want to delete recipe from favourites
//             else if (like === false) {
//                 deleteLikeFromRecipe();
//             }
//         }
//     }, [like]);

//     const deleteRecipe = () => {
//         // delete recipe from database
//         db.collection("recipes")
//             .doc(recipeId)
//             .delete()
//             .then(() => {
//                 navigate("/my-recipes/");
//             });
//     };

//     const deleteRecipeFile = () => {
//         // delete recipe file from storage
//         storage
//             .ref(recipe.fullPathFile)
//             .delete()
//             .then(() => {
//                 deleteLikes();
//             })
//             .catch((error) => {
//                 console.log("error", error);
//             });
//     };

//     //if recipe that is getting deleted has likes,
//     //remove the like documents from firestore
//     const deleteLikes = () => {
//         db.collection("likes")
//             .where("recipeId", "==", recipeId)
//             .get()
//             .then((query) => {
//                 const batch = db.batch();
//                 query.forEach((doc) => {
//                     batch.delete(doc.ref);
//                 });
//                 batch
//                     .commit()
//                     .then(() => {
//                         deleteRecipe();
//                     })
//                     .catch((err) => {
//                         console.log("error", err);
//                     });
//             })
//             .catch((err) => {
//                 console.log("error", err);
//             });
//     };

//     const handleDelete = async () => {
//         //check if the recipe photo exist in storage, if so delete it
//         if (recipe.fullPathPhoto) {
//             storage
//                 .ref(recipe.fullPathPhoto)
//                 .delete()
//                 .then(() => {
//                     //check if the recipe has a file, if so delete it
//                     if (recipe.fullPathFile) {
//                         deleteRecipeFile();
//                     } else {
//                         deleteRecipe();
//                     }
//                 })
//                 .catch((error) => {
//                     console.log("error", error);
//                 });
//         } else {
//             //check if the recipe has a file, if so delete it
//             if (recipe.fullPathFile) {
//                 deleteRecipeFile();
//             } else {
//                 deleteLikes();
//             }
//         }
//     };

//     return (
//         <>
//             {loading ? (
//                 <Loading />
//             ) : (
//                 recipe && (
//                     <div className="wrapper">
//                         <div className="recipe">
//                             {recipe.photoUrl ? (
//                                 <SRLWrapper>
//                                     <a
//                                         href={recipe.photoUrl}
//                                         title="Visa bild"
//                                         data-attribute="SRL"
//                                     >
//                                         <img
//                                             src={recipe.photoUrl}
//                                             className="recipe__image"
//                                             alt="food"
//                                         />
//                                     </a>
//                                 </SRLWrapper>
//                             ) : (
//                                 <SRLWrapper>
//                                     <a
//                                         href={recipe.photoUrl}
//                                         title="Visa bild"
//                                         data-attribute="SRL"
//                                     >
//                                         <img
//                                             src={foodPlaceholder}
//                                             className="recipe__image"
//                                             alt="plate"
//                                         />
//                                     </a>
//                                 </SRLWrapper>
//                             )}

//                             <div className="recipe__content">
//                                 <div className="recipe__description">
//                                     <h1 className="recipe__heading">
//                                         {recipe.name}
//                                     </h1>

//                                     {recipe.comment && (
//                                         <p className="recipe__text">
//                                             {recipe.comment}
//                                         </p>
//                                     )}

//                                     {recipe.url && (
//                                         <a
//                                             href={recipe.url}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="recipe__link"
//                                         >
//                                             Länk till receptet
//                                             <FontAwesomeIcon
//                                                 className="recipe__link-arrow"
//                                                 icon={faChevronRight}
//                                             />
//                                         </a>
//                                     )}

//                                     {recipe.fileUrl && (
//                                         <div className="recipe__file">
//                                             <SRLWrapper>
//                                                 <a
//                                                     href={recipe.fileUrl}
//                                                     title="Visa recept"
//                                                     data-attribute="SRL"
//                                                 >
//                                                     <img
//                                                         src={recipe.fileUrl}
//                                                         className="recipe__file"
//                                                         alt="food"
//                                                     />
//                                                 </a>
//                                             </SRLWrapper>
//                                         </div>
//                                     )}

//                                     {recipe.vegan && (
//                                         <div className="recipe__vegan">
//                                             <Vegan className="recipe__vegan-icon" />
//                                             <p className="recipe__vegan-text">
//                                                 Veganskt
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {currentUser &&
//                                     currentUser.uid !== recipe.owner && (
//                                         <div className="recipe__footer">
//                                             <div className="card__likes">
//                                                 <p>{likes.length} gillar</p>
//                                             </div>

//                                             <div className="recipe__footer-owner">
//                                                 <img
//                                                     className="recipe__profile-image"
//                                                     src={profilePlaceholder}
//                                                     alt=""
//                                                 />
//                                                 <p className="recipe__footer-name">
//                                                     {recipe.creatorUsername}
//                                                 </p>
//                                             </div>

//                                             <div className="card__heart">
//                                                 {like ? (
//                                                     <HeartFilled
//                                                         onClick={handleLike}
//                                                     />
//                                                 ) : (
//                                                     <Heart
//                                                         onClick={handleLike}
//                                                     />
//                                                 )}
//                                             </div>

//                                         </div>
//                                     )}

//                                 {currentUser &&
//                                 currentUser.uid === recipe.owner ? (
//                                     <div className="recipe__buttons">
//                                         <button
//                                             className="recipe__delete-button"
//                                             onClick={handleDelete}
//                                         >
//                                             <FontAwesomeIcon
//                                                 className="recipe__link-icon"
//                                                 icon={faTrashAlt}
//                                             />
//                                             Radera
//                                         </button>

//                                         {}
//                                         <Link
//                                             to={
//                                                 recipe.fileUrl
//                                                     ? `/my-recipes/edit-recipe/file/${recipeId}`
//                                                     : `/my-recipes/edit-recipe/url/${recipeId}`
//                                             }
//                                             className="recipe__edit-link"
//                                         >
//                                             <FontAwesomeIcon
//                                                 className="recipe__link-icon"
//                                                 icon={faEdit}
//                                             />
//                                             Redigera
//                                         </Link>
//                                     </div>
//                                 ) : (
//                                     ""
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )
//             )}
//         </>
//     );
// };

// export default ShowSingleRecipe;
