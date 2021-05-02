import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const useMyRecipes = (vegan) => {
    const [errorLikes, setErrorLikes] = useState(false);
    const [loadingLikes, setLoadingLikes] = useState(false);
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [disLiked, setDisLiked] = useState(false);
    const { currentUser } = useAuth();

    let likedRecipeList = [];

    const getLikedRecipes = async () => {
        const favouriteRecipes = [];
        try {
            const promises = likedRecipeList.map(async (doc) => {
                const recipeDoc = await db
                    .collection("recipes")
                    .doc(doc.recipeId)
                    .get();

                //check if the user wants to see vegan recipes
                //return if the liked recipe is not vegan
                if (!recipeDoc.data().vegan && vegan) {
                    return;
                } else {
                    favouriteRecipes.push({
                        id: recipeDoc.id,
                        ...recipeDoc.data(),
                    });
                }

                return new Promise((resolve, reject) => resolve(recipeDoc));
            });

            Promise.all(promises)
                .then(() => {
                    setLikedRecipes(favouriteRecipes);
                    setLoadingLikes(false);
                })
                .catch((error) => {
                    setErrorLikes(error);
                    console.error(error);
                    setLoadingLikes(false);
                });
        } catch (error) {
            setErrorLikes(error);
            console.error(error);
            setLoadingLikes(false);
        }
    };

    useEffect(() => {
        setLikedRecipes([]);
        setDisLiked(false);
        setErrorLikes(false);

        //get a list of all the recipes that the user likes
        db.collection("likes")
            .where("liker", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                setLoadingLikes(true);
                querySnapshot.forEach((doc) => {
                    likedRecipeList.push({
                        ...doc.data(),
                    });
                });

                //if the user doesn't have any likes recipes return
                if (likedRecipeList.length === 0) {
                    setLoadingLikes(false);
                    return;
                }

                getLikedRecipes();
            })
            .catch((error) => {
                setErrorLikes(error);
                console.error(error);
                setLoadingLikes(false);
            });
    }, [currentUser.uid, vegan, disLiked]);

    return { likedRecipes, setDisLiked, loadingLikes, errorLikes };
};

export default useMyRecipes;
