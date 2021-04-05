import React, { useEffect, useState } from "react";
import foodPlaceholder from "../assets//images/food_placeholder.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
import profilePlaceholder from "../assets/profile-placeholder.svg";
import { db } from "../firebase";

const RecipeCard = ({ recipe }) => {
    const { currentUser } = useAuth();
    const [likes, setLikes] = useState(null);
    const [like, setLike] = useState(false);

    const handleLike = (e) => {
        setLike((prevState) => !prevState);
    };

    const addLikeToRecipe = (docRef) => {
        // add likes to recipe subcollection
        docRef
            .collection("likes")
            .add({
                liker: currentUser.uid,
            })
            .then(() => {
                console.log("like added to db");
                getLikesForRecipe();
            })
            .catch((err) => {
                console.log("something went wrong", err);
            });

        // add likes to seperate collection
        db.collection('likes').add({
            liker: currentUser.uid,
            recipeId: recipe.id
        }).then(() => {
            console.log('Added to seperate likes collection');
            
        }).catch((err) => {
            console.log('err', err);
            
        })
    };

    const getLikesForRecipe = () => {
        const unsubscribe = db
            .collection("recipes")
            .doc(recipe.id)
            .collection("likes")
            .onSnapshot((snapshot) => {
                const snapshotLikes = [];
                snapshot.forEach((doc) => {
                    snapshotLikes.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setLikes(snapshotLikes);
            });
        return unsubscribe;
    };

    const deleteLikeFromRecipe = () => {};

    useEffect(() => {
        getLikesForRecipe();
    }, []);

    useEffect(() => {
        if (like) {
            const docRef = db.collection("recipes").doc(recipe.id);

            //check if subcollection exist
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("document exist");

                    docRef
                        .collection("likes")
                        .get()
                        .then((sub) => {
                            console.log("sub", sub.docs);

                            if (sub.docs.length > 0) {
                                console.log("subcollection exist");

                                const unsubscribe = docRef
                                    .collection("likes")
                                    .onSnapshot((snapshot) => {
                                        const snapshotLikes = [];

                                        snapshot.forEach((doc) => {
                                            if (
                                                doc.data().liker ===
                                                currentUser.uid
                                            ) {
                                                console.log(
                                                    "liker already exist"
                                                );

                                                return;
                                            } else {
                                                console.log("want to add like");
                                                addLikeToRecipe(docRef);
                                            }
                                        });
                                        setLikes(snapshotLikes);
                                    });

                                return unsubscribe;
                            } else {
                                addLikeToRecipe(docRef);
                            }
                        });
                }
            });
        } else {
            //console.log("want to delete recipe from favourites");
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
                    {
                        likes && <div>{likes.length} likes</div>
                    }
                    
                    <div className="card__footer-owner">
                        <img
                            className="card__profile-image"
                            src={profilePlaceholder}
                        />
                        <p className="card__footer-name">
                            {recipe.creatorUsername}
                        </p>
                    </div>

                    {currentUser && currentUser.uid !== recipe.creator ? (
                        likes && likes.length !== 0 ? (
                            likes.map((like, index) => {
                                if (like.liker === currentUser.uid) {
                                    return (
                                        <div
                                            key={index}
                                            className="card__heart"
                                        >
                                            <HeartFilled onClick={handleLike} />
                                        </div>
                                    );
                                }
                            })
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

// import React, { useEffect, useState } from "react";
// import foodPlaceholder from "../assets//images/food_placeholder.png";
// import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import { ReactComponent as Heart } from "../assets/heart.svg";
// import { ReactComponent as HeartFilled } from "../assets/heart-filled.svg";
// import profilePlaceholder from "../assets/profile-placeholder.svg";
// import { db } from "../firebase";

// const RecipeCard = ({ recipe }) => {
//     const { currentUser } = useAuth();
//     const [likes, setLikes] = useState(null);
//     const [like, setLike] = useState(false);

//     const handleLike = (e) => {
//         setLike((prevState) => !prevState);
//     };

//     const addLikeToRecipe = () => {

//     }

//     const getLikesForRecipe = () => {

//     }

//     const deleteLikeFromRecipe = () => {

//     }

//     useEffect(() => {
//         console.log("like", like);

//         if (like) {
//             console.log("inside like");
//             const docRef = db.collection("recipes").doc(recipe.id);

//             //check if subcollection exist
//             docRef
//             .get().then(
//             doc => {
//               if (doc.exists) {
//                   console.log('document exist');

//                   docRef.collection('likes').get().
//                   then(sub => {
//                       console.log('sub', sub.docs);

//                     if (sub.docs.length > 0) {
//                         console.log('subcollection exist');

//                         const unsubscribe = docRef
//                         .collection("likes")
//                         .onSnapshot((snapshot) => {
//                             const snapshotLikes = [];

//                             snapshot.forEach((doc) => {
//                                 if (doc.data().liker === currentUser.uid) {
//                                     console.log("liker already exist");

//                                     return;
//                                 } else {
//                                     console.log('want to add like');

//                                     docRef
//                                         .collection("likes")
//                                         .add({
//                                             liker: currentUser.uid,
//                                         })
//                                         .then(() => {
//                                             console.log("like added to db");
//                                             // get all recipes likes
//                                             const unsubscribe = db
//                                                 .collection("recipes")
//                                                 .doc(recipe.id)
//                                                 .collection("likes")
//                                                 .onSnapshot((snapshot) => {
//                                                     const snapshotLikes = [];
//                                                     snapshot.forEach((doc) => {
//                                                         snapshotLikes.push({
//                                                             id: doc.id,
//                                                             ...doc.data(),
//                                                         });
//                                                     });
//                                                     setLikes(snapshotLikes);

//                                                 });
//                                                 return unsubscribe;
//                                         })
//                                         .catch((err) => {
//                                             console.log("something went wrong", err);
//                                         });
//                                 }
//                             });
//                             setLikes(snapshotLikes);
//                         });

//                     return unsubscribe;
//                     } else {
//                         docRef
//                         .collection("likes")
//                         .add({
//                             liker: currentUser.uid,
//                         }).then(() => {
//                             console.log('added like to db');

//                         }).catch((error) => {

//                         })
//                       }
//                   });
//               }
//             });

//         } else {
//             //console.log("want to delete recipe from favourites");
//         }
//     }, [like]);

//     console.log("likes", likes);

//     return (
//         <div className="card">
//             <div className="card__wrapper">
//                 {recipe.vegan && <p className="card__flag">Veganskt</p>}
//                 <Link to={`/my-recipes/${recipe.id}`} className="card__link">
//                     {recipe.photoUrl ? (
//                         <img
//                             src={recipe.photoUrl}
//                             className="card__image"
//                             role="presentation"
//                         />
//                     ) : (
//                         <img
//                             src={foodPlaceholder}
//                             id="placeholder"
//                             className="card__image"
//                             alt="plate with cutlery"
//                         />
//                     )}

//                     <h1 className="card__title">{recipe.name}</h1>
//                 </Link>
//                 <p className="card__text">{recipe.comment}</p>

//                 <div className="card__footer">
//                     <div className="card__footer-owner">
//                         <img
//                             className="card__profile-image"
//                             src={profilePlaceholder}
//                         />
//                         <p className="card__footer-name">
//                             {recipe.creatorUsername}
//                         </p>
//                     </div>

//                     {currentUser && currentUser.uid !== recipe.creator && (
//                         <div className="card__heart">
//                             {like ? (
//                                 <HeartFilled onClick={handleLike} />
//                             ) : (
//                                 <Heart onClick={handleLike} />
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecipeCard;
